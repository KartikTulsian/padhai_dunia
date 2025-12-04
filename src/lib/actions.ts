"use server"

import { AnnouncementSchema, AssignmentSchema, ClassSchema, CourseSchema, EventSchema, ExamSchema, LessonSchema, QuizSchema, ResultSchema, StudentSchema, StudyMaterialSchema, TeacherSchema, UserSchema } from "./formValidationSchema";
import prisma from "./prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

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
    await prisma.exam.update({
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
      },
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
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });


    // revalidatePath("/list/announcement");
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

    return { success: true };
  } catch (err) {
    console.log("Update Quiz Error:", err);
    return { success: false };
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

    return { success: true, error:false };
  } catch (err) {
    console.log("Update Result Error:", err);
    return { success: false, error: true};
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
    await prisma.course.create({
      data: {
        title: data.title,
        code: data.code,
        description: data.description || null,
        thumbnail: data.thumbnail || null,

        type: data.type,
        level: data.level,
        status: data.status || "DRAFT",

        price: data.price ?? 0,
        currency: data.currency ?? "INR",
        discountPrice: data.discountPrice || null,

        duration: data.duration || null,
        language: data.language || "English",
        category: data.category,
        tags: data.tags || [],
        prerequisites: data.prerequisites || [],

        instituteId: data.instituteId || null,
        isPublic: data.isPublic ?? false,

        ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
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
    await prisma.course.update({
      where: { id: data.id },
      data: {
        ...data,
        ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
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
    return { success: false, error: true};
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
   data: ClassSchema & {teachers?: string[]} 
  ) => {
  try {
    await prisma["class"].create({
      data: {
        name: data.name,
        grade: data.grade,
        section: data.section || null,
        capacity: data.capacity,
        academicYear: data.academicYear,

        instituteId: data.instituteId,
        supervisorId: data.supervisorId || null,

        // Connect teachers if provided
        ...(data.teachers?.length
          ? {
              teachers: {
                create: data.teachers.map((teacherId) => ({
                  teacher: { connect: { id: teacherId } },
                })),
              },
            }
          : {}),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma["class"].update({
      where: { id: data.id },
      data,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
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
        id: id
      },
    });

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
  try {
    await prisma.teacher.create({
      data: {
        userId: data.userId,
        teacherId: data.teacherId,
        instituteId: data.instituteId || null,

        subjects: data.subjects,
        qualification: data.qualification || null,
        experience: data.experience ?? null,
        specialization: data.specialization || null,
        bio: data.bio,

        isVerified: data.isVerified ?? false,
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),

        // Optional fields
        ...(data.createdAt && { createdAt: new Date(data.createdAt) }),
        ...(data.updatedAt && { updatedAt: new Date(data.updatedAt) }),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// UPDATE TEACHER
export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        ...(data.userId && { userId: data.userId }),
        ...(data.teacherId && { teacherId: data.teacherId }),

        instituteId:
          data.instituteId && data.instituteId !== "" ? data.instituteId : null,

        ...(data.subjects && { subjects: data.subjects }),
        ...(data.qualification !== undefined && {
          qualification: data.qualification || null,
        }),
        ...(data.experience !== undefined && {
          experience: data.experience ?? null,
        }),
        ...(data.specialization !== undefined && {
          specialization: data.specialization || null,
        }),
        ...(data.bio && { bio: data.bio }),

        ...(data.isVerified !== undefined && {
          isVerified: data.isVerified,
        }),

        ...(data.joinDate && {
          joinDate: new Date(data.joinDate),
        }),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



// DELETE TEACHER
export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const clerk = await clerkClient();

    await prisma.teacher.delete({
      where: {
        id: id
      },
    });

    await clerk.users.deleteUser(id);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema & { classes?: string[] } // include optional classes array
) => {
  try {
    await prisma.student.create({
      data: {
        userId: data.userId,
        studentId: data.studentId,

        instituteId: data.instituteId || null,

        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        guardianName: data.guardianName || null,
        guardianPhone: data.guardianPhone || null,
        guardianEmail: data.guardianEmail || null,
        address: data.address || null,

        enrollmentDate: data.enrollmentDate
          ? new Date(data.enrollmentDate)
          : new Date(),

        // Connect student to classes
        ...(data.classes?.length
          ? {
              classStudents: {
                create: data.classes.map((classId) => ({
                  class: { connect: { id: classId } },
                })),
              },
            }
          : {}),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log("Error creating student:", err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    await prisma.student.update({
      where: { id: data.id },
      data: {
        ...data,
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(data.enrollmentDate && { enrollmentDate: new Date(data.enrollmentDate) }),
      },
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {

    const clerk = await clerkClient();

    await prisma.student.delete({
      where: {
        id: id
      },
    });

    await clerk.users.deleteUser(id);
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
    console.log("Create Study Material Error:", err);
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
    console.log("Update Study Material Error:", err);
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
    console.log(err);
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

export const deleteUser= async (
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