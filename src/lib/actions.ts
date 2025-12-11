"use server"

import { Prisma } from "@prisma/client";
import { AnnouncementSchema, AssignmentSchema, ClassSchema, CourseModuleSchema, CourseSchema, CourseTeacherSchema, EnrollmentSchema, EventSchema, ExamSchema, InstituteAdminSchema, InstituteSchema, LessonSchema, OnboardingSchema, QuizSchema, ResultSchema, StudentSchema, StudyMaterialSchema, TeacherSchema, UserSchema } from "./formValidationSchema";
import prisma from "./prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: string | boolean }

export const createExam = async (currentState: CurrentState, data: ExamSchema) => {
    try {
        await prisma.exam.create({
            data: {
                title: data.title,
                description: data.description || null,
                courseId: data.courseId,
                teacherId: data.teacherId,
                type: data.type,
                scheduledAt: new Date(data.scheduledAt),
                duration: data.duration,
                totalMarks: data.totalMarks,
                passingMarks: data.passingMarks,
                instructions: data.instructions || null,
                isPublished: data.isPublished ?? false,

                questions: data.questions?.length
                    ? {
                        create: data.questions.map((q, i) => ({
                            questionText: q.questionText,
                            questionType: q.questionType,
                            options: q.options ? q.options : Prisma.JsonNull,
                            correctAnswer: q.correctAnswer ?? null,
                            marks: q.marks,
                            orderIndex: i,
                        })),
                    }
                    : undefined,

            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Create Exam Error:", err);
        return { success: false, error: true };
    }
};


export const updateExam = async (currentState: CurrentState, data: ExamSchema) => {
    try {
        // 1. Transaction to handle cleanup and update atomically
        await prisma.$transaction(async (tx) => {
            // First, delete existing questions to allow full re-creation (handles updates/deletes/reorders)
            await tx.examQuestion.deleteMany({
                where: { examId: data.exam_id },
            });

            // Then update the exam and create new questions
            await tx.exam.update({
                where: { id: data.exam_id },
                data: {
                    title: data.title,
                    description: data.description || null,
                    courseId: data.courseId,
                    teacherId: data.teacherId,
                    type: data.type,
                    scheduledAt: new Date(data.scheduledAt),
                    duration: data.duration,
                    totalMarks: data.totalMarks,
                    passingMarks: data.passingMarks,
                    instructions: data.instructions || null,
                    isPublished: data.isPublished ?? false,

                    // Re-create questions
                    questions: data.questions?.length
                        ? {
                            create: data.questions.map((q, i) => ({
                                questionText: q.questionText,
                                questionType: q.questionType,
                                options: q.options ? q.options : Prisma.JsonNull,
                                correctAnswer: q.correctAnswer ?? null,
                                marks: q.marks,
                                orderIndex: i,
                            })),
                        }
                        : undefined,
                },
            });
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Update Exam Error:", err);
        return { success: false, error: true };
    }
};


export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.exam.delete({
            where: {
                id: id
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};


export const createQuiz = async (currentState: CurrentState, data: QuizSchema) => {
    try {
        await prisma.quiz.create({
            data: {
                title: data.title,
                description: data.description || null,

                courseId: data.courseId,
                teacherId: data.teacherId,

                type: data.type,
                duration: data.duration || null,
                totalMarks: data.totalMarks,
                passingMarks: data.passingMarks || null,

                isPublished: data.isPublished ?? false,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Create Quiz Error:", err);
        return { success: false, error: true };
    }
};

export const updateQuiz = async (currentState: CurrentState, data: QuizSchema) => {
    try {
        await prisma.quiz.update({
            where: { id: data.quiz_id },
            data: {
                title: data.title,
                description: data.description || null,

                courseId: data.courseId,
                teacherId: data.teacherId,

                type: data.type,
                duration: data.duration || null,
                totalMarks: data.totalMarks,
                passingMarks: data.passingMarks || null,

                isPublished: data.isPublished ?? false,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Update Quiz Error:", err);
        return { success: false, error: true };
    }
};

export const deleteQuiz = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {

        await prisma.quiz.delete({
            where: {
                id: id
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Delete Quiz Error:", err);
        return { success: false, error: true };
    }
};

export const createResult = async (currentState: CurrentState, data: ResultSchema) => {
    try {
        await prisma.result.create({
            data: {
                studentId: data.studentId,

                courseId: data.courseId || null,
                examId: data.examId || null,
                assignmentId: data.assignmentId || null,

                subjectName: data.subjectName,
                subjectCode: data.subjectCode,

                marksObtained: data.marksObtained,
                totalMarks: data.totalMarks,
                percentage: data.percentage,
                grade: data.grade || null,

                examDate: new Date(data.examDate),
                resultDate: new Date(data.resultDate),

                remarks: data.remarks || null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Create Result Error:", err);
        return { success: false, error: true };
    }
};

export const updateResult = async (currentState: CurrentState, data: ResultSchema) => {
    try {
        await prisma.result.update({
            where: { id: data.result_id },
            data: {
                studentId: data.studentId,

                courseId: data.courseId || null,
                examId: data.examId || null,
                assignmentId: data.assignmentId || null,

                subjectName: data.subjectName,
                subjectCode: data.subjectCode,

                marksObtained: data.marksObtained,
                totalMarks: data.totalMarks,
                percentage: data.percentage,
                grade: data.grade || null,

                examDate: new Date(data.examDate),
                resultDate: new Date(data.resultDate),

                remarks: data.remarks || null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Update Result Error:", err);
        return { success: false, error: true };
    }
};

export const deleteResult = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.result.delete({
            where: {
                id: id
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Delete Result Error:", err);
        return { success: false, error: true };
    }
};


export const createCourse = async (
    currentState: CurrentState,
    data: CourseSchema
) => {
    try {

        const { classIds, targetAudience, ...courseData } = data;

        await prisma.course.create({
            data: {
                title: courseData.title,
                code: courseData.code,
                description: courseData.description || null,
                thumbnail: courseData.thumbnail || null,

                type: courseData.type,
                level: courseData.level,
                status: courseData.status || "DRAFT",

                price: courseData.price ?? 0,
                currency: courseData.currency ?? "INR",
                discountPrice: courseData.discountPrice || null,

                duration: courseData.duration || null,
                language: courseData.language || "English",
                category: courseData.category,
                tags: courseData.tags || [],
                prerequisites: courseData.prerequisites || [],

                targetAudience: targetAudience || [],

                instituteId: courseData.instituteId || null,
                isPublic: courseData.isPublic ?? false,

                ...(courseData.publishedAt && { publishedAt: new Date(courseData.publishedAt) }),

                classes: {
                    create: classIds?.map((classId) => ({
                        class: { connect: { id: classId } },
                        startDate: new Date(), // Defaulting start date to now
                    })),
                },
            },
        });
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateCourse = async (currentState: CurrentState, data: CourseSchema) => {
    try {
        const { classIds, targetAudience, ...courseData } = data;

        await prisma.$transaction(async (tx) => {
      // 1. Update basic course details
      await tx.course.update({
        where: { id: courseData.id },
        data: {
          title: courseData.title,
          code: courseData.code,
          description: courseData.description || null,
          thumbnail: courseData.thumbnail || null,
          type: courseData.type,
          level: courseData.level,
          status: courseData.status || "DRAFT",
          price: courseData.price ?? 0,
          currency: courseData.currency ?? "INR",
          discountPrice: courseData.discountPrice || null,
          duration: courseData.duration || null,
          language: courseData.language || "English",
          category: courseData.category,
          tags: courseData.tags || [],
          prerequisites: courseData.prerequisites || [],

          targetAudience: targetAudience || [],

          instituteId: courseData.instituteId || null,
          isPublic: courseData.isPublic ?? false,
          ...(courseData.publishedAt && { publishedAt: new Date(courseData.publishedAt) }),
        },
      });

      // 2. Sync Class Relations
      // Get currently linked classes
      const currentLinks = await tx.classCourse.findMany({
        where: { courseId: courseData.id },
        select: { classId: true },
      });
      const currentClassIds = currentLinks.map((l) => l.classId);

      // Determine classes to add and remove
      const classesToAdd = classIds.filter((id) => !currentClassIds.includes(id));
      const classesToRemove = currentClassIds.filter((id) => !classIds.includes(id));

      // Remove unselected classes
      if (classesToRemove.length > 0) {
        await tx.classCourse.deleteMany({
          where: {
            courseId: courseData.id,
            classId: { in: classesToRemove },
          },
        });
      }

      // Add newly selected classes
      if (classesToAdd.length > 0) {
        await tx.classCourse.createMany({
            data: classesToAdd.map((id) => ({
                courseId: courseData.id!,
                classId: id,
                startDate: new Date()
            }))
        });
      }
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Course Error:", err);
    return { success: false, error: true };
  }
};

export const deleteCourse = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.course.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};


export const createLesson = async (currentState: CurrentState, data: LessonSchema) => {
    try {
        await prisma.lesson.create({
            data: {
                moduleId: data.moduleId,
                title: data.title,
                description: data.description || null,
                type: data.type,
                content: data.content || null,
                duration: data.duration || null,
                orderIndex: data.orderIndex,

                teacherId: data.teacherId || null,
                isFree: data.isFree ?? false,
                isPublished: data.isPublished ?? false,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateLesson = async (currentState: CurrentState, data: LessonSchema) => {
    try {
        await prisma.lesson.update({
            where: { id: data.id },
            data,
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteLesson = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.lesson.delete({
            where: {
                id: id
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createAssignment = async (
    currentState: CurrentState,
    data: AssignmentSchema
) => {
    try {
        await prisma.assignment.create({
            data: {
                title: data.title,
                description: data.description,

                courseId: data.courseId,
                teacherId: data.teacherId,

                dueDate: new Date(data.dueDate),
                totalMarks: data.totalMarks,
                passingMarks: data.passingMarks,

                attachments: data.attachments || [],
                instructions: data.instructions || null,

                status: data.status || "DRAFT",
                allowLateSubmission: data.allowLateSubmission ?? false,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateAssignment = async (
    currentState: CurrentState,
    data: AssignmentSchema
) => {
    try {
        await prisma.assignment.update({
            where: { id: data.id },
            data: {
                ...data,
                ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteAssignment = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.assignment.delete({
            where: {
                id: id
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.class.create({
                data: {
                    name: data.name,
                    grade: data.grade,
                    section: data.section || null,
                    capacity: data.capacity,
                    academicYear: data.academicYear,
                    instituteId: data.instituteId,
                    supervisorId: data.supervisorId || null,

                    ...(data.supervisorId
                        ? {
                            teachers: {
                                create: [
                                    {
                                        teacherId: data.supervisorId,
                                        isPrimary: true,
                                    },
                                ],
                            },
                        }
                        : {}),
                },
            });
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Create Class Error:", err);
        return { success: false, error: true };
    }
};

export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    if (!data.id) {
        console.log("Update Class Error: Missing ID");
        return { success: false, error: true };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Update main class data
            await tx.class.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    grade: data.grade,
                    section: data.section || null,
                    capacity: data.capacity,
                    academicYear: data.academicYear,
                    instituteId: data.instituteId,
                    supervisorId: data.supervisorId || null,
                },
            });

            // 2. Handle Class Teacher Relation
            // First, remove existing primary teacher relation for this class
            // Note: This logic assumes one primary supervisor. If you have multiple teachers, you might need finer logic.
            await tx.classTeacher.deleteMany({
                where: { classId: data.id, isPrimary: true },
            });

            // 3. Add new supervisor if selected
            if (data.supervisorId) {
                // Check if this teacher is already assigned (to avoid unique constraint errors if not primary)
                // For simplicity with this schema, we re-create the primary entry.
                await tx.classTeacher.create({
                    data: {
                        classId: data.id!,
                        teacherId: data.supervisorId,
                        isPrimary: true,
                    },
                });
            }
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Update Class Error:", err);
        return { success: false, error: true };
    }
};

export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    try {
        // Ensure isVirtual is a boolean
        const isVirtual = typeof data.isVirtual === "string"
            ? data.isVirtual === "true"
            : Boolean(data.isVirtual);

        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description || null,

                instituteId: data.instituteId || null,
                classId: data.classId || null,

                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),

                location: data.location || null,
                isVirtual: isVirtual,
                meetingLink: isVirtual ? (data.meetingLink || null) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Create Event Error:", err);
        return { success: false, error: true };
    }
};

export const updateEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    if (!data.event_id) {
        console.log("Update Event Error: Missing event_id");
        return { success: false, error: true };
    }

    try {
        // Ensure isVirtual is a boolean
        const isVirtual = typeof data.isVirtual === "string"
            ? data.isVirtual === "true"
            : Boolean(data.isVirtual);

        await prisma.event.update({
            where: { id: data.event_id },
            data: {
                title: data.title,
                description: data.description || null,

                instituteId: data.instituteId || null,
                classId: data.classId || null,

                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),

                location: data.location || null,
                isVirtual: isVirtual,
                meetingLink: isVirtual ? (data.meetingLink || null) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Update Event Error:", err);
        return { success: false, error: true };
    }
};

export const deleteEvent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    if (!id) {
        console.log("Delete Event Error: Missing id");
        return { success: false, error: true };
    }

    try {
        await prisma.event.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Delete Event Error:", err);
        return { success: false, error: true };
    }
};


export const createStudyMaterial = async (
  currentState: CurrentState,
  data: StudyMaterialSchema
) => {
  try {
    await prisma.studyMaterial.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize || null,

        courseId: data.courseId,
        isPublic: data.isPublic ?? false,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Create Study Material Error:", err);
    return { success: false, error: true };
  }
};

export const updateStudyMaterial = async (
  currentState: CurrentState,
  data: StudyMaterialSchema
) => {
  try {
    await prisma.studyMaterial.update({
      where: { id: data.material_id },
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize || null,

        isPublic: data.isPublic ?? false,
        courseId: data.courseId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Study Material Error:", err);
    return { success: false, error: true };
  }
};

export const deleteStudyMaterial = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.studyMaterial.delete({
      where: {
        id: id
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Study Material Error:", err);
    return { success: false, error: true };
  }
};


export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    try {
        await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                target: data.target,

                instituteId: data.instituteId || null,
                classId: data.classId || null,

                publishedAt: new Date(),
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Create Announcement Error:", err);
        return { success: false, error: true };
    }
};

export const updateAnnouncement = async (currentState: CurrentState, data: AnnouncementSchema) => {
    try {
        await prisma.announcement.update({
            where: { id: data.id },
            data: {
                title: data.title,
                content: data.content,
                target: data.target,

                instituteId: data.instituteId || null,
                classId: data.classId || null,

                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Update Announcement Error:", err);
        return { success: false, error: true };
    }
};

export const deleteAnnouncement = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.announcement.delete({
            where: {
                id: id
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createUser = async (currentState: CurrentState, data: UserSchema) => {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return { success: false, error: "No authenticated user found." };
        }

        const userId = clerkUser.id;

        if (!data.password) {
            return { success: false, error: "Password is required when creating the profile." };
        }

        await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,

                firstName: data.firstName,
                lastName: data.lastName,

                phoneNumber: data.phoneNumber || null,
                avatar: data.avatar || null,

                role: data.role as "admin" | "institute" | "teacher" | "student",

                status: data.status ?? "PENDING_VERIFICATION",

                emailVerified: data.emailVerified ?? false,
                lastLogin: data.lastLogin ? new Date(data.lastLogin) : null,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const updateUser = async (
    currentState: CurrentState,
    data: UserSchema // Use so fields are optional
) => {
    try {
        const updateData: any = {};

        if (data.email) updateData.email = data.email;
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.password) updateData.password = data.password;

        if (data.phoneNumber !== undefined)
            updateData.phoneNumber = data.phoneNumber || null;

        if (data.avatar !== undefined) updateData.avatar = data.avatar || null;

        if (data.role) updateData.role = data.role as "admin" | "institute" | "teacher" | "student";
        if (data.status) updateData.status = data.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

        if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
        if (data.lastLogin) updateData.lastLogin = new Date(data.lastLogin);

        await prisma.user.update({
            where: { id: data.id },
            data: updateData,
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Error updating user:", err);
        return { success: false, error: true };
    }
};

export const deleteUser = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const clerk = await clerkClient();

        await prisma.user.delete({
            where: {
                id: id
            },
        });

        await clerk.users.deleteUser(id)
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  const clerk = await clerkClient();
  try {
    // 1. Check if Teacher ID exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { teacherId: data.teacherId },
    });
    if (existingTeacher) {
      return { success: false, error: true };
    }

    // 2. Create User in Clerk
    let clerkUser;
    try {
      clerkUser = await clerk.users.createUser({
        emailAddress: [data.email],
        password: data.password || "Password@123",
        firstName: data.firstName,
        lastName: data.lastName,
        publicMetadata: { role: "teacher" },
      });
    } catch (clerkErr: any) {
      console.error("Clerk Creation Error:", clerkErr);
      return { success: false, error: true };
    }

    // 3. Create User & Teacher in Prisma
    await prisma.user.create({
      data: {
        id: clerkUser.id,
        email: data.email,
        password: "secured_by_clerk",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: "teacher",
        status: "ACTIVE",
        ...(data.avatar && { avatar: data.avatar }),
        teacherProfile: {
          create: {
            teacherId: data.teacherId,
            instituteId: data.instituteId || null,
            // Convert comma-separated string to array
            subjects: data.subjects 
                ? data.subjects.split(",").map((s) => s.trim()) 
                : [],
            qualification: data.qualification || null,
            experience: data.experience || 0,
            specialization: data.specialization || null,
            bio: data.bio || null,
            isVerified: data.isVerified || false,
            joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
          },
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Create Teacher Error:", err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    // 1. Update Prisma User (Basic Info)
    if (data.userId) {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || null,
          email: data.email,
          ...(data.avatar && { avatar: data.avatar }),
        },
      });
    }

    // 2. Update Prisma Teacher
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        teacherId: data.teacherId,
        instituteId: data.instituteId || null,
        // Convert comma-separated string to array
        subjects: data.subjects 
            ? data.subjects.split(",").map((s) => s.trim()) 
            : [],
        qualification: data.qualification || null,
        experience: data.experience || 0,
        specialization: data.specialization || null,
        bio: data.bio || null,
        isVerified: data.isVerified,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Teacher Error:", err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  const userId = data.get("userId") as string;
  
  try {
    const clerk = await clerkClient();

    // Delete from Prisma (Cascade handles teacher profile)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Delete from Clerk
    await clerk.users.deleteUser(userId);

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  const clerk = await clerkClient();
  try {
    // 1. Check if Student ID exists
    const existingStudentId = await prisma.student.findUnique({
      where: { studentId: data.studentId },
    });
    if (existingStudentId) {
      return { success: false, error: true };
    }

    // 2. Create User in Clerk
    let clerkUser;
    try {
      clerkUser = await clerk.users.createUser({
        emailAddress: [data.email],
        password: data.password || "Password@123",
        firstName: data.firstName,
        lastName: data.lastName,
        publicMetadata: { role: "student" },
      });
    } catch (clerkErr: any) {
      console.error("Clerk Creation Error:", clerkErr);
      return { success: false, error: true };
    }

    // 3. Create User & Student in Prisma
    await prisma.user.create({
      data: {
        id: clerkUser.id, 
        email: data.email,
        password: "secured_by_clerk",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: "student",
        status: "ACTIVE",
        ...(data.avatar && { avatar: data.avatar }),
        studentProfile: {
          create: {
            studentId: data.studentId,
            instituteId: data.instituteId || null,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : new Date(),
            guardianName: data.guardianName || null,
            guardianPhone: data.guardianPhone || null,
            guardianEmail: data.guardianEmail || null,
            address: data.address || null,

            goals: data.goals || [],

            // Link Classes
            ...(data.classIds && data.classIds.length > 0 && {
                classStudents: {
                    create: data.classIds.map((cid) => ({
                        classId: cid
                    }))
                }
            })
          },
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Create Student Error:", err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    // 1. Update Prisma User (Basic Info)
    // We need userId to update the parent User model. 
    // Ensure data.userId is populated in the form.
    if (data.userId) {
      await prisma.user.update({
        where: { id: data.userId }, 
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || null,
          email: data.email, 
          ...(data.avatar && { avatar: data.avatar }),
        },
      });
    }

    // 2. Update Prisma Student
    await prisma.student.update({
      where: { id: data.id },
      data: {
        studentId: data.studentId,
        instituteId: data.instituteId || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        
        // FIX: Use undefined instead of null for non-nullable fields to skip update if empty
        enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : undefined,
        guardianName: data.guardianName || null,
        guardianPhone: data.guardianPhone || null,
        guardianEmail: data.guardianEmail || null,
        address: data.address || null,

        goals: data.goals,
      },
    });

    // 3. Update Classes (Re-sync)
    if (data.classIds && data.id) {
        // Delete classes not in the new list
        await prisma.classStudent.deleteMany({
            where: {
                studentId: data.id,
                classId: { notIn: data.classIds }
            }
        });
        
        // Find existing to avoid duplicates
        const existingLinks = await prisma.classStudent.findMany({
            where: { studentId: data.id, classId: { in: data.classIds } },
            select: { classId: true }
        });
        const existingClassIds = existingLinks.map(l => l.classId);
        const newClasses = data.classIds.filter(cid => !existingClassIds.includes(cid));

        if (newClasses.length > 0) {
            await prisma.classStudent.createMany({
                data: newClasses.map(cid => ({
                    studentId: data.id!,
                    classId: cid
                }))
            });
        }
    }

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Student Error:", err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string; 
  const userId = data.get("userId") as string; 
  
  try {
    const clerk = await clerkClient();

    // Delete from Prisma (Cascade handles student profile)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Delete from Clerk
    await clerk.users.deleteUser(userId);

    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Student Error:", err);
    return { success: false, error: true };
  }
};

export const createInstitute = async (
  currentState: CurrentState,
  data: InstituteSchema
) => {
  try {
    // 1. Check for unique code
    const existing = await prisma.institute.findUnique({ where: { code: data.code } });
    if (existing) return { success: false, error: true };

    // 2. Create Institute
    const institute = await prisma.institute.create({
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        status: data.status || "PENDING_APPROVAL",
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        website: data.website || null,
        description: data.description || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || "India",
        zipCode: data.zipCode || null,
        ...(data.logo && { logo: data.logo }),
        settings: data.settings ? JSON.parse(data.settings) : {},
      },
    });

    // 3. Assign Initial Admin (if selected)
    if (data.adminId) {
      await prisma.instituteAdmin.create({
        data: {
          instituteId: institute.id,
          userId: data.adminId,
          isCreator: true,
        },
      });

      // Update User Role to INSTITUTE
      await prisma.user.update({
          where: { id: data.adminId },
          data: { role: "institute" }
      });
      
      // Try syncing Clerk Metadata
      try {
        const clerk = await clerkClient();
        await clerk.users.updateUser(data.adminId, { publicMetadata: { role: "institute" }});
      } catch (e) {
        console.log("Clerk sync skipped", e);
      }
    }

    return { success: true, error: false };
  } catch (err) {
    console.error("Create Institute Error:", err);
    return { success: false, error: true };
  }
};

export const updateInstitute = async (
  currentState: CurrentState,
  data: InstituteSchema
) => {
  try {
    await prisma.institute.update({
      where: { id: data.id },
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        status: data.status,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        website: data.website || null,
        description: data.description || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country,
        zipCode: data.zipCode || null,
        ...(data.logo && { logo: data.logo }),
        settings: data.settings ? JSON.parse(data.settings) : undefined,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Update Institute Error:", err);
    return { success: false, error: true };
  }
};

export const deleteInstitute = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    // This will delete the institute. 
    // Note: Use Cascade in Prisma Schema if you want to delete related Students/Teachers automatically.
    await prisma.institute.delete({
      where: { id: id },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Institute Error:", err);
    return { success: false, error: true };
  }
};

export const createInstituteAdmin = async (currentState: CurrentState, data: InstituteAdminSchema) => {
  try {
    const clerk = await clerkClient();
    
    // 1. Create Clerk User
    let clerkUser;
    try {
        clerkUser = await clerk.users.createUser({
            emailAddress: [data.email],
            password: data.password || "Password@123",
            firstName: data.firstName,
            lastName: data.lastName,
            publicMetadata: { role: "institute" },
        });
    } catch(e) {
        console.error("Clerk Create Error", e);
        return { success: false, error: true };
    }

    // 2. Create Prisma User & Link to Institute
    await prisma.user.create({
        data: {
            id: clerkUser.id,
            email: data.email,
            password: "secured_by_clerk",
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber || null,
            role: "institute",
            status: "ACTIVE",
            instituteAdmin: {
                create: {
                    instituteId: data.instituteId,
                    isCreator: data.isCreator || false
                }
            }
        }
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Create Institute Admin Error:", err);
    return { success: false, error: true };
  }
};

export const updateInstituteAdmin = async (currentState: CurrentState, data: InstituteAdminSchema) => {
  try {
    // 1. Update User Details (Phone, Names)
    if (data.userId) {
        await prisma.user.update({
            where: { id: data.userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber || null, // Updates User.phoneNumber
                // email: data.email // Avoid updating email to prevent auth mismatch
            }
        });
    }

    // 2. Update Admin Link Details (Institute assignment)
    if (data.id) {
        await prisma.instituteAdmin.update({
            where: { id: data.id },
            data: {
                instituteId: data.instituteId
            }
        });
    }

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Institute Admin Error:", err);
    return { success: false, error: true };
  }
};

export const deleteInstituteAdmin = async (currentState: CurrentState, data: FormData) => {
  const userId = data.get("userId") as string;
  try {
    const clerk = await clerkClient();
    // Delete User (Cascades to InstituteAdmin)
    await prisma.user.delete({ where: { id: userId } });
    await clerk.users.deleteUser(userId);
    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Institute Admin Error:", err);
    return { success: false, error: true };
  }
};

export const completeOnboarding = async (currentState: CurrentState, data: OnboardingSchema) => {
  const { userId } = await auth();
  const clerk = await clerkClient();

  if (!userId) {
    return { success: false, error: "Unauthorized: No User Found" };
  }

  try {
    // 1. Fetch Clerk User Info
    const clerkUser = await clerk.users.getUser(userId);
    
    // Check if the email is verified in Clerk
    const isEmailVerified = clerkUser.emailAddresses.some(
      (e) => e.emailAddress === data.email && e.verification?.status === "verified"
    );

    // 2. Create/Update Base User in Postgres
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: data.role as any, 
        avatar: clerkUser.imageUrl,
        emailVerified: isEmailVerified, 
      },
      create: {
        id: userId,
        email: data.email,
        password: "secured_by_clerk", 
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        role: data.role as any,
        status: "ACTIVE", 
        avatar: clerkUser.imageUrl,
        emailVerified: isEmailVerified,
      },
    });

    // 3. Role Specific Logic
    
    // --- INSTITUTE ---
    if (data.role === "institute") {
      let instituteId = data.selectedInstituteId;

      // Logic for CREATING a new Institute
      if (data.instituteMode === "create") {
        if (!data.instituteName || !data.instituteCode || !data.instituteContactEmail) {
            return { success: false, error: "Missing required institute details" };
        }

        const existingInstitute = await prisma.institute.findUnique({ where: { code: data.instituteCode }});
        if(existingInstitute) return { success: false, error: "Institute Code already exists!" };

        const newInstitute = await prisma.institute.create({
          data: {
            name: data.instituteName,
            code: data.instituteCode,
            type: data.instituteType || "SCHOOL",
            contactEmail: data.instituteContactEmail,
            // Fallback to user phone if institute phone not given, or null
            contactPhone: data.phoneNumber || "N/A", 
            
            // New Fields Mapping
            description: data.instituteDescription || null,
            website: data.instituteWebsite || null,
            address: data.instituteAddress || null,
            city: data.instituteCity || null,
            state: data.instituteState || null,
            zipCode: data.instituteZip || null,
            status: "PENDING_APPROVAL", 
          },
        });
        instituteId = newInstitute.id;
      }

      // Create the Institute Admin link
      if (instituteId) {
        await prisma.instituteAdmin.create({
          data: {
            userId: user.id,
            instituteId: instituteId,
            isCreator: data.instituteMode === "create",
          },
        });
      }
    } 
    
    // --- STUDENT ---
    else if (data.role === "student") {
      if (!data.studentId || !data.selectedInstituteId) {
          return { success: false, error: "Student ID and Institute Selection are required" };
      }

      const existingStudent = await prisma.student.findUnique({ where: { studentId: data.studentId } });
      if(existingStudent) return { success: false, error: "This Student ID is already registered." };

      await prisma.student.create({
        data: {
          userId: user.id,
          studentId: data.studentId,
          instituteId: data.selectedInstituteId,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          // New Fields Mapping
          guardianName: data.guardianName || null,
          guardianPhone: data.guardianPhone || null,
          guardianEmail: data.guardianEmail || null,
          address: data.studentAddress || null,

          goals: data.goals || [],
        },
      });
    } 
    
    // --- TEACHER ---
    else if (data.role === "teacher") {
      if (!data.teacherId || !data.subjects) {
          return { success: false, error: "Teacher ID and Subjects are required" };
      }

      const existingTeacher = await prisma.teacher.findUnique({ where: { teacherId: data.teacherId }});
      if(existingTeacher) return { success: false, error: "This Teacher ID is already registered." };

      await prisma.teacher.create({
        data: {
          userId: user.id,
          teacherId: data.teacherId,
          instituteId: data.selectedInstituteId || null, 
          subjects: data.subjects.includes(",") 
            ? data.subjects.split(",").map(s => s.trim()) 
            : [data.subjects.trim()],
          experience: data.experience || 0,
          bio: data.bio || "",
          // New Fields Mapping
          qualification: data.qualification || null,
          specialization: data.specialization || null,
        },
      });
    }

    // 4. Update Clerk Metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        role: data.role, // This will set 'institute', 'teacher', or 'student'
        onboardingComplete: true,
      },
    });

    return { success: true, error: false };

  } catch (err: any) {
    console.error("Onboarding Error:", err);
    return { success: false, error: err.message || "Database connection failed" };
  }
};

export const enrollInCourse = async (
  currentState: CurrentState,
  data: EnrollmentSchema
) => {
  try {
    // 1. Check if already enrolled
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: data.studentId,
          courseId: data.courseId,
        },
      },
    });

    if (existing) {
      return { success: false, error: true, message: "Already enrolled in this course!" };
    }

    // 2. Create Enrollment
    await prisma.courseEnrollment.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        status: "ACTIVE",
        progress: 0,
        enrolledAt: new Date(),
      },
    });

    return { success: true, error: false, message: "Successfully enrolled!" };
  } catch (err) {
    console.error("Enrollment Error:", err);
    return { success: false, error: true, message: "Failed to enroll" };
  }
};

export const createCourseModule = async (
  currentState: CurrentState,
  data: CourseModuleSchema
) => {
  try {
    await prisma.courseModule.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description || null,
        orderIndex: data.orderIndex,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Create Module Error:", err);
    return { success: false, error: true };
  }
};

export const updateCourseModule = async (
  currentState: CurrentState,
  data: CourseModuleSchema
) => {
  try {
    await prisma.courseModule.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description || null,
        orderIndex: data.orderIndex,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Update Module Error:", err);
    return { success: false, error: true };
  }
};

export const deleteCourseModule = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.courseModule.delete({ where: { id } });
    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Module Error:", err);
    return { success: false, error: true };
  }
};

export const createCourseTeacher = async (
  currentState: CurrentState,
  data: CourseTeacherSchema
) => {
  try {
    // Check if already assigned
    const existing = await prisma.courseTeacher.findUnique({
      where: {
        courseId_teacherId: {
          courseId: data.courseId,
          teacherId: data.teacherId,
        },
      },
    });

    if (existing) {
      return { success: false, error: true };
    }

    await prisma.courseTeacher.create({
      data: {
        courseId: data.courseId,
        teacherId: data.teacherId,
        role: data.role,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Assign Teacher Error:", err);
    return { success: false, error: true };
  }
};

// Deletes the allocation (removes teacher from course)
export const deleteCourseTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string; // This is the CourseTeacher ID
  try {
    await prisma.courseTeacher.delete({
      where: { id },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Remove Teacher Error:", err);
    return { success: false, error: true };
  }
};