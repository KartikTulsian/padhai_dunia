import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { senderId, courseId } = await req.json();

    // 1. Mark all unread messages from this sender in this context as read
    await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: userId,
        courseId: courseId || null,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // 2. Also mark related Notifications as read (Optional but good UX)
    // This is a basic cleanup to ensure the red dot goes away if they are already in chat
    await prisma.notification.updateMany({
        where: {
            userId: userId,
            type: "MESSAGE",
            isRead: false,
            // In a real app, you'd filter by sender ID content, but generic cleanup helps here
        },
        data: { isRead: true, readAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to mark as seen" }, { status: 500 });
  }
}