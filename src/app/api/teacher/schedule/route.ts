import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    let teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      teacherId = teacher.id;
    }

    // Fetch lessons taught by this teacher
    // Assuming 'Lesson' model has a 'teacherId' field. 
    // If Lesson relates to Class/Course, we fetch based on CourseTeacher logic.
    // Here I assume direct relation or via course modules.
    
    // Fetching lessons via CourseTeacher relation:
    const teacherCourses = await prisma.courseTeacher.findMany({
        where: { teacherId: teacherId },
        select: { courseId: true }
    });
    
    const courseIds = teacherCourses.map(tc => tc.courseId);

    const lessons = await prisma.lesson.findMany({
        where: {
            // Fetch lessons in courses assigned to this teacher
            // OR if you have a direct teacherId on Lesson, use that.
            // Using Course relation for broader coverage:
            module: { courseId: { in: courseIds } },
            isPublished: true
        },
        include: {
            module: { include: { course: { select: { title: true, code: true } } } }
        }
    });

    // Schedule logic (Reuse the round-robin logic for visual demo)
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() + distanceToMonday);
    thisMonday.setHours(0,0,0,0);

    const scheduledLessons = lessons.map((lesson, index) => {
        const daysToAdd = Math.floor(index / 3); 
        const date = new Date(thisMonday);
        date.setDate(thisMonday.getDate() + daysToAdd);
        if (date.getDay() === 0) date.setDate(date.getDate() + 1);
        if (date.getDay() === 6) date.setDate(date.getDate() + 2);

        const hour = (index % 3 === 0) ? 9 : (index % 3 === 1) ? 11 : 14;
        date.setHours(hour, 0, 0, 0);

        return { 
            id: lesson.id,
            title: lesson.title,
            duration: 60, // default
            scheduledTime: date,
            course: { title: lesson.module.course.title }
        };
    });

    return NextResponse.json({ lessons: scheduledLessons });

  } catch (error) {
    console.error("Teacher Schedule API Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}