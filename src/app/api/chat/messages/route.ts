import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const otherUserId = searchParams.get("otherUserId"); 
  const { userId } = await auth();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const messages = await prisma.message.findMany({
      where: {
        courseId: courseId || undefined,
        OR: [
          // Direct chat
          { senderId: userId, receiverId: otherUserId! },
          { senderId: otherUserId!, receiverId: userId },
          // Admin viewing 3rd party chat (fetches based on the student/teacher ID filter)
          { senderId: otherUserId! },
          { receiverId: otherUserId! }
        ]
      },
      orderBy: { sentAt: "asc" },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } }
      }
    });

    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { content, receiverId, courseId } = body;

    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        courseId: courseId || null,
        content,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } }
      }
    });

    // Fetch Receiver Info to Determine Routing Logic
    const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { role: true }
    });

    // Construct Notification Link based on Receiver Role
    let notificationLink = "/list/messages"; // Fallback

    if (receiver?.role === "student" && courseId) {
        // Students can't access /list/messages. Send them to the course page.
        // Assuming your course page is at /list/courses/[id] or /courses/[id]
        notificationLink = `/list/courses/${courseId}`; // Or the specific course page
    } else {
        // Teachers/Admins go to the messaging center with query params to open chat
        notificationLink = `/list/messages?courseId=${courseId || ''}&otherUserId=${userId}`;
    }

    // Create Notification
    await prisma.notification.create({
        data: {
          userId: receiverId,
          type: "MESSAGE",
          title: `New message from ${newMessage.sender.firstName}`,
          content: content.length > 50 ? content.slice(0, 50) + "..." : content,
          link: notificationLink
        }
    });

    return NextResponse.json(newMessage);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}