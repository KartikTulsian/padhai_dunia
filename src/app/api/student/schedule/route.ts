import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const paramId = searchParams.get("studentId");

    // 1. Determine the Student ID to fetch
    let targetStudentId = paramId;

    if (!targetStudentId) {
      // If no param, find the student profile linked to the logged-in user
      const selfStudent = await prisma.student.findUnique({
        where: { userId: userId },
        select: { id: true }
      });
      if (!selfStudent) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      targetStudentId = selfStudent.id;
    }

    // 2. Fetch Data
    const student = await prisma.student.findUnique({
      where: { id: targetStudentId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: { where: { isPublished: true }, orderBy: { orderIndex: 'asc' } }
                  },
                  orderBy: { orderIndex: 'asc' }
                }
              }
            }
          },
          where: { status: "ACTIVE" }
        },
        classStudents: {
          include: {
             class: { include: { courses: { include: { course: true } } } }
          }
        }
      }
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // 3. Gather Course IDs
    const courseIds = new Set<string>();
    student.enrollments.forEach(e => courseIds.add(e.courseId));
    student.classStudents.forEach(cs => cs.class.courses.forEach(cc => courseIds.add(cc.courseId)));
    const allCourseIds = Array.from(courseIds);

    // 4. Fetch Events
    const [quizzes, exams, assignments] = await Promise.all([
        prisma.quiz.findMany({
            where: { courseId: { in: allCourseIds }, isPublished: true, scheduledAt: { gte: new Date() } },
            include: { course: { select: { title: true } } }
        }),
        prisma.exam.findMany({
            where: { courseId: { in: allCourseIds }, isPublished: true, scheduledAt: { gte: new Date() } },
            include: { course: { select: { title: true } } }
        }),
        prisma.assignment.findMany({
            where: { 
                courseId: { in: allCourseIds }, 
                status: "PUBLISHED", 
                dueDate: { gte: new Date() },
                // Optional: Filter out submitted ones if your schema supports it
            },
            include: { course: { select: { title: true } } }
        })
    ]);

    // 5. Generate Lesson Schedule (Simple Round Robin)
    // Flattens all lessons from all enrolled courses
    const allLessons = student.enrollments.flatMap(e => 
        e.course.modules.flatMap(m => 
            m.lessons.map(l => ({ ...l, course: { title: e.course.title } }))
        )
    );

    // Schedule logic: Distribute lessons starting from THIS WEEK Monday
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    
    // Calculate date of this week's Monday
    // If today is Sunday (0), Monday was 6 days ago. If Mon (1), 0 days ago.
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() + distanceToMonday);
    thisMonday.setHours(0,0,0,0);

    const scheduledLessons = allLessons.map((lesson, index) => {
        // Distribute 3 lessons per day
        const daysToAdd = Math.floor(index / 3); 
        
        const date = new Date(thisMonday);
        date.setDate(thisMonday.getDate() + daysToAdd);
        
        // Skip Weekends if logic pushes it there (Simple check)
        if (date.getDay() === 0) date.setDate(date.getDate() + 1); // Push Sun to Mon
        if (date.getDay() === 6) date.setDate(date.getDate() + 2); // Push Sat to Mon

        // Set time: 9AM, 11AM, 2PM based on index
        const timeSlot = index % 3;
        const hour = timeSlot === 0 ? 9 : timeSlot === 1 ? 11 : 14;
        
        date.setHours(hour, 0, 0, 0);

        return { ...lesson, scheduledTime: date };
    });

    return NextResponse.json({
        lessons: scheduledLessons,
        quizzes,
        exams,
        assignments
    });

  } catch (error) {
    console.error("Schedule API Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}