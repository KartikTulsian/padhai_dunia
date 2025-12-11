import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const otherUserId = searchParams.get("otherUserId");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true,
        instituteAdmin: true,
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let whereClause: any = {};

    if (role === "student") {
      whereClause = { OR: [{ senderId: user.id }, { receiverId: user.id }] };
    } else if (role === "teacher") {
      whereClause = { 
        OR: [{ senderId: user.id }, { receiverId: user.id }],
        ...(courseId && { courseId }) 
      };
    } else if (role === "institute" && user.instituteAdmin) {
      whereClause = { course: { instituteId: user.instituteAdmin.instituteId } };
    } else if (role === "admin") {
      if (courseId) whereClause.courseId = courseId;
    }

    if (otherUserId) {
        whereClause.AND = [{ OR: [{ senderId: otherUserId }, { receiverId: otherUserId }] }];
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { sentAt: "desc" },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        course: { select: { id: true, title: true, code: true } }
      }
    });

    const conversationMap = new Map();

    messages.forEach((msg) => {
      // 1. Identify the "Student Anchor" for the conversation
      // In this system, chats are grouped by Student + Course.
      // So (Teacher -> Student) and (Admin -> Student) fall into the SAME bucket.
      let studentUser = null;
      if (msg.sender.role === 'student') studentUser = msg.sender;
      else if (msg.receiver.role === 'student') studentUser = msg.receiver;

      // If no student involved (unlikely in this flow), fallback to sorting IDs
      const anchorId = studentUser ? studentUser.id : [msg.senderId, msg.receiverId].sort().join('-');
      
      // 2. Create Unique Key: CourseID + StudentID
      const key = `${msg.courseId || 'direct'}-${anchorId}`;

      if (!conversationMap.has(key)) {
        // 3. Determine who to show on the Sidebar
        let displayUser;
        
        if (role === 'student') {
            // For student, show the Course or Teacher they last spoke to
            displayUser = msg.senderId === user.id ? msg.receiver : msg.sender;
        } else {
            // For Admin/Teacher, ALWAYS show the Student
            displayUser = studentUser || (msg.senderId === user.id ? msg.receiver : msg.sender);
        }

        conversationMap.set(key, {
          conversationId: key,
          otherUser: {
            id: displayUser.id,
            firstName: displayUser.firstName,
            lastName: displayUser.lastName,
            avatar: displayUser.avatar,
            role: displayUser.role
          },
          // 4. Pass Participants for the fancy header
          participants: [
            { id: msg.sender.id, name: `${msg.sender.firstName} ${msg.sender.lastName}`, role: msg.sender.role },
            { id: msg.receiver.id, name: `${msg.receiver.firstName} ${msg.receiver.lastName}`, role: msg.receiver.role }
          ],
          // Store the Student ID as 'subjectId' so we fetch the right messages later
          subjectId: studentUser ? studentUser.id : null,
          course: msg.course,
          lastMessage: {
            content: msg.content,
            sentAt: msg.sentAt,
            isRead: msg.isRead,
            senderId: msg.senderId
          },
          unreadCount: 0 
        });
      }
      
      if (msg.receiverId === user.id && !msg.isRead) {
        conversationMap.get(key).unreadCount++;
      }
    });

    const staffRoles = ['admin', 'institute', 'teacher'];

    // Only fetch staff contacts if the current user is a staff member
    if (role && staffRoles.includes(role)) {
        
        // Fetch all users with these roles (excluding self)
        const staffContacts = await prisma.user.findMany({
            where: {
                role: { in: staffRoles as any }, // Cast if your Prisma enum types conflict slightly
                id: { not: userId }
            },
            select: { id: true, firstName: true, lastName: true, avatar: true, role: true }
        });

        // Add them to the map if they don't exist
        staffContacts.forEach(contact => {
            // For staff-to-staff, there is no course and no "student subject".
            // The key logic must match the message logic above: `direct-${sortedIds}`
            const sortedIds = [userId, contact.id].sort().join('-');
            const key = `direct-${sortedIds}`;

            if (!conversationMap.has(key)) {
                conversationMap.set(key, {
                    conversationId: key,
                    otherUser: contact,
                    participants: [
                        { id: userId, name: "Me", role: role },
                        { id: contact.id, name: `${contact.firstName} ${contact.lastName}`, role: contact.role }
                    ],
                    subjectId: null, // Staff chat
                    course: null,
                    // Placeholder message data for "Empty" state
                    lastMessage: {
                        content: "Start a conversation",
                        sentAt: new Date(0).toISOString(), // Old date to push to bottom
                        isRead: true,
                        senderId: ""
                    },
                    unreadCount: 0
                });
            }
        });
    }

    // Convert to Array and Sort
    // We sort by lastMessage.sentAt descending so active chats are top, new empty contacts are bottom
    const conversations = Array.from(conversationMap.values()).sort((a, b) => {
        return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
    });

    return NextResponse.json(conversations);

  } catch (error) {
    console.error("Conversation fetch error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}