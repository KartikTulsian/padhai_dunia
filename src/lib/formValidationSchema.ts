import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),

  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),

  password: z
    .string().min(6, "Password must be at least 6 characters!").optional(),

  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),

  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),


  avatar: z.string().optional().or(z.literal("")),

  role: z.enum(["admin", "institute", "teacher", "student"], {
    message: "User role is required!",
  }),

  status: z
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"])
    .optional(),

  emailVerified: z.boolean().optional(),
  lastLogin: z.string().datetime().optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;


export const superAdminSchema = z.object({
  id: z.string().optional(),

  userId: z.string().min(1, { message: "User ID is required!" }),

  dashboardAccess: z
    .any()
    .optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type SuperAdminSchema = z.infer<typeof superAdminSchema>;


export const instituteSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1, { message: "Institute name is required!" }),

  code: z
    .string()
    .min(1, { message: "Institute code is required!" }),

  type: z.enum(
    [
      "SCHOOL", "COLLEGE", "COACHING_CENTER", "PRIVATE_TUITION",
      "COURSE_PROVIDER", "UNIVERSITY",
    ],
    { message: "Institute type is required!" }
  ),

  status: z
    .enum(["ACTIVE", "INACTIVE", "PENDING_APPROVAL", "SUSPENDED"])
    .optional(),

  logo: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  website: z
    .string()
    .url({ message: "Invalid website URL!" })
    .optional()
    .or(z.literal("")),

  contactEmail: z
    .string()
    .email({ message: "Valid contact email is required!" }),

  contactPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),

  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  country: z.string().default("India").optional(),

  zipCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^[0-9]{5,6}$/.test(val), {
      message: "Zip Code must be 5–6 digits",
    }),

  settings: z.any().optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type InstituteSchema = z.infer<typeof instituteSchema>;



export const instituteAdminSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, { message: "User ID is required!" }),
  instituteId: z.string().min(1, { message: "Institute ID is required!" }),
  isCreator: z.boolean().default(false).optional(),
  permissions: z.any().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type InstituteAdminSchema = z.infer<typeof instituteAdminSchema>;


export const studentSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, { message: "User ID is required!" }),
  studentId: z.string().min(1, { message: "Student ID is required!" }),
  instituteId: z.string().optional().or(z.literal("")),
  dateOfBirth: z
    .string()
    .datetime({ message: "Invalid date format!" })
    .optional(),

  guardianName: z.string().optional().or(z.literal("")),
  guardianPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),
  guardianEmail: z
    .string()
    .email({ message: "Invalid guardian email!" })
    .optional()
    .or(z.literal("")),

  address: z.string().optional().or(z.literal("")),

  enrollmentDate: z
    .string()
    .datetime({ message: "Invalid enrollment date!" })
    .optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type StudentSchema = z.infer<typeof studentSchema>;



export const teacherSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, { message: "User ID is required!" }),
  teacherId: z.string().min(1, { message: "Teacher ID is required!" }),
  instituteId: z.string().optional().or(z.literal("")),
  subjects: z
    .array(z.string().min(1, { message: "Subject cannot be empty" }))
    .min(1, { message: "At least one subject is required!" }),
  qualification: z.string().optional().or(z.literal("")),
  experience: z
    .number()
    .int({ message: "Experience must be an integer!" })
    .optional()
    .nullable(),
  specialization: z.string().optional().or(z.literal("")),
  bio: z.string().min(1, "Bio is required"),
  isVerified: z.boolean().default(false).optional(),
  joinDate: z.string().refine(
    (value) => !value || !isNaN(Date.parse(value)),
    { message: "Invalid join date!" }
  ).optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;


export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Class name is required!" }),
  grade: z.enum(
    [
      "GRADE_1", "GRADE_2", "GRADE_3", "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
      "GRADE_8", "GRADE_9", "GRADE_10", "GRADE_11", "GRADE_12",
      "UNDERGRADUATE", "POSTGRADUATE", "OTHER",
    ],
    { message: "Grade is required!" }
  ),

  section: z.string().optional().or(z.literal("")),
  capacity: z
    .number({ required_error: "Capacity is required!" })
    .int({ message: "Capacity must be an integer!" })
    .min(1, { message: "Capacity must be at least 1!" }),

  academicYear: z
    .string()
    .min(1, { message: "Academic year is required!" })
    .refine(
      (val) => /^[0-9]{4}\/[0-9]{2}$/.test(val),
      { message: "Academic year must be in format YYYY/YY (e.g., 2024/25)" }
    ),

  instituteId: z.string().min(1, { message: "Institute ID is required!" }),

  supervisorId: z.string().optional().or(z.literal("")),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;




export const courseSchema = z.object({
  id: z.string().optional(),

  title: z.string().min(1, { message: "Course title is required!" }),

  code: z.string().min(1, { message: "Course code is required!" }),

  description: z.string().optional().or(z.literal("")),

  thumbnail: z.string().optional().or(z.literal("")),

  type: z.enum(
    ["INSTITUTE_SPECIFIC", "PUBLIC", "PREMIUM", "FREE"],
    { message: "Course type is required!" }
  ),

  level: z.enum(
    ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
    { message: "Course level is required!" }
  ),

  status: z.enum(
    ["DRAFT", "PUBLISHED", "ARCHIVED", "UNDER_REVIEW"],
    { message: "Course status is required!" }
  ).optional(),
  price: z.number().min(0, { message: "Price cannot be negative!" }).default(0),
  currency: z.string().default("INR"),
  discountPrice: z
    .number()
    .optional()
    .nullable()
    .refine((val) => (val == null ? true : val >= 0), {
      message: "Discount price cannot be negative!",
    }),
  duration: z
    .number()
    .int({ message: "Duration must be an integer!" })
    .optional()
    .nullable(),
  language: z.string().default("English"),
  category: z.string().min(1, { message: "Category is required!" }),
  tags: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  instituteId: z.string().optional().or(z.literal("")),
  isPublic: z.boolean().default(false).optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional(),
});

export type CourseSchema = z.infer<typeof courseSchema>;




export const lessonSchema = z.object({
  id: z.string().optional(),

  moduleId: z.string().min(1, { message: "Module ID is required!" }),
  title: z.string().min(1, { message: "Lesson title is required!" }),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(
    ["VIDEO", "DOCUMENT", "PRESENTATION", "INTERACTIVE", "LIVE_CLASS", "QUIZ"],
    { message: "Lesson type is required!" }
  ),
  content: z.string().optional().or(z.literal("")),
  duration: z
    .number()
    .int({ message: "Duration must be an integer!" })
    .min(1, { message: "Duration must be at least 1 minute!" })
    .optional()
    .nullable(),
  orderIndex: z
    .number({ message: "Order index is required!" })
    .int({ message: "Order index must be an integer!" }),
  teacherId: z.string().optional().or(z.literal("")),
  isFree: z.boolean().default(false).optional(),
  isPublished: z.boolean().default(false).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type LessonSchema = z.infer<typeof lessonSchema>;


export const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(200),
  description: z.string().min(5),
  courseId: z.string().uuid(),
  teacherId: z.string().uuid(),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  totalMarks: z.number().positive(),
  passingMarks: z.number().nonnegative(),
  attachments: z.array(z.string().url()).optional().default([]),
  instructions: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"],
    { message: "assignement status is required" }),
  allowLateSubmission: z.boolean().default(false),
})
  .refine((data) => data.passingMarks <= data.totalMarks, {
    message: "Passing marks cannot exceed total marks",
    path: ["passingMarks"],
  });
export type AssignmentSchema = z.infer<typeof assignmentSchema>;



export const examSchema = z
  .object({
    exam_id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string().optional().or(z.literal("")),
    courseId: z.string().min(1, { message: "Course ID is required!" }),
    teacherId: z.string().min(1, { message: "Teacher ID is required!" }),
    type: z.enum(["MIDTERM", "FINAL", "UNIT_TEST", "MOCK_TEST", "PRACTICE_TEST"], {
      message: "Exam type is required!",
    }),
    scheduledAt: z.string().min(1, { message: "Scheduled date & time is required!" }),
    duration: z
      .coerce.number({
        required_error: "Duration is required!",
      })
      .positive("Duration must be greater than 0"),
    totalMarks: z
      .coerce.number({
        required_error: "Total marks are required!",
      })
      .positive("Total marks must be greater than 0"),
    passingMarks: z
      .coerce.number({
        required_error: "Passing marks are required!",
      })
      .nonnegative("Passing marks cannot be negative"),
    instructions: z.string().optional().or(z.literal("")),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => {

    if (isNaN(Date.parse(data.scheduledAt))) return false;
    return true;
  }, {
    message: "Invalid scheduled date format",
    path: ["scheduledAt"],
  })
  .refine(
    (data) => data.passingMarks <= data.totalMarks,
    {
      message: "Passing marks cannot exceed total marks",
      path: ["passingMarks"],
    }
  );

export type ExamSchema = z.infer<typeof examSchema>;


export const quizSchema = z
  .object({
    quiz_id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string().optional().or(z.literal("")),
    courseId: z.string().min(1, { message: "Course ID is required!" }),
    teacherId: z.string().min(1, { message: "Teacher ID is required!" }),
    type: z.enum(
      ["DAILY_TRIVIA", "WEEKLY_PROGRESS", "TOPIC_QUIZ", "PRACTICE_QUIZ"],
      { message: "Quiz type is required!" }
    ),
    duration: z
      .coerce.number()
      .positive("Duration must be greater than 0")
      .optional()
      .nullable(),
    totalMarks: z
      .coerce.number({
        required_error: "Total marks are required!",
      })
      .positive("Total marks must be greater than 0"),
    passingMarks: z
      .coerce.number()
      .nonnegative("Passing marks cannot be negative")
      .optional()
      .nullable(),
    isPublished: z.boolean().optional(),
    scheduledAt: z.string().optional().or(z.literal("")),
  })
  .refine((data) => {

    if (!data.scheduledAt || data.scheduledAt === "") return true;
    return !isNaN(Date.parse(data.scheduledAt));
  }, {
    message: "Invalid scheduled date format",
    path: ["scheduledAt"],
  })
  .refine(
    (data) => {
      if (data.passingMarks == null) return true;
      return data.passingMarks <= data.totalMarks;
    },
    {
      message: "Passing marks cannot exceed total marks",
      path: ["passingMarks"],
    }
  );

export type QuizSchema = z.infer<typeof quizSchema>;



export const studyMaterialSchema = z.object({
  material_id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(
    ["PDF", "VIDEO", "DOCUMENT", "PRESENTATION", "LINK", "EBOOK"],
    { message: "Material type is required!" }
  ),
  fileUrl: z.string().url({ message: "Valid file URL is required!" }),
  fileSize: z.coerce.number().positive("File size must be greater than 0").optional().nullable(),
  courseId: z.string().min(1, { message: "Course ID is required!" }),
  isPublic: z.boolean().optional(),
  uploadedAt: z.string().optional(), // auto-generated usually
});

export type StudyMaterialSchema = z.infer<typeof studyMaterialSchema>;



export const resultSchema = z
  .object({
    result_id: z.string().optional(),
    studentId: z.string().min(1, { message: "Student ID is required!" }),
    courseId: z.string().optional().or(z.literal("")),
    examId: z.string().optional().or(z.literal("")),
    assignmentId: z.string().optional().or(z.literal("")),
    subjectName: z.string().min(1, { message: "Subject name is required!" }),
    subjectCode: z.string().min(1, { message: "Subject code is required!" }),
    marksObtained: z.coerce
      .number({ required_error: "Marks obtained is required!" })
      .nonnegative("Marks cannot be negative"),
    totalMarks: z.coerce
      .number({ required_error: "Total marks is required!" })
      .positive("Total marks must be greater than 0"),
    percentage: z.coerce
      .number({ required_error: "Percentage is required!" })
      .min(0, "Percentage cannot be negative")
      .max(100, "Percentage cannot exceed 100"),
    grade: z.string().optional().or(z.literal("")),
    examDate: z.string().min(1, { message: "Exam date is required!" }),
    resultDate: z.string().min(1, { message: "Result date is required!" }),
    remarks: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => data.marksObtained <= data.totalMarks,
    {
      message: "Marks obtained cannot exceed total marks",
      path: ["marksObtained"],
    }
  )
  .refine(
    (data) => {
      const exam = new Date(data.examDate);
      const result = new Date(data.resultDate);
      return result >= exam;
    },
    {
      message: "Result date cannot be before exam date",
      path: ["resultDate"],
    }
  );

export type ResultSchema = z.infer<typeof resultSchema>;



export const announcementSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    content: z.string().min(1, { message: "Content is required!" }),
    target: z.enum(
      [
        "ALL_STUDENTS",
        "SPECIFIC_CLASS",
        "SPECIFIC_COURSE",
        "INSTITUTE_WIDE",
        "PLATFORM_WIDE"
      ],
      { message: "Target is required!" }
    ),
    instituteId: z.string().optional().or(z.literal("")),
    classId: z.string().optional().or(z.literal("")),
    publishedAt: z.string().optional(), // usually auto-set
    expiresAt: z.string().optional().or(z.literal("")),

  })
  .refine(
    (data) => {
      if (!data.expiresAt) return true; // skip if optional
      const exp = new Date(data.expiresAt);
      const pub = data.publishedAt ? new Date(data.publishedAt) : new Date();
      return exp >= pub;
    },
    {
      message: "Expiry date cannot be before publish date",
      path: ["expiresAt"],
    }
  );

export type AnnouncementSchema = z.infer<typeof announcementSchema>;


export const eventSchema = z
  .object({
    event_id: z.string().optional(),

    title: z.string().min(1, { message: "Title is required!" }),

    description: z.string().optional().or(z.literal("")),

    instituteId: z.string().optional().or(z.literal("")),
    classId: z.string().optional().or(z.literal("")),

    startTime: z.string().min(1, { message: "Start time is required!" }),
    endTime: z.string().min(1, { message: "End time is required!" }),

    location: z.string().optional().or(z.literal("")),
    
    // Transform string from select to boolean
    isVirtual: z
      .union([z.boolean(), z.string()])
      .transform((val) => {
        if (typeof val === "string") {
          return val === "true";
        }
        return val;
      }),

    meetingLink: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end >= start;
    },
    {
      message: "End time cannot be earlier than start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      // If virtual event, meeting link should be a valid URL
      if (data.isVirtual && data.meetingLink) {
        return data.meetingLink.startsWith("http://") || 
               data.meetingLink.startsWith("https://");
      }
      return true;
    },
    {
      message: "Meeting link must be a valid URL starting with http:// or https://",
      path: ["meetingLink"],
    }
  );

export type EventSchema = z.infer<typeof eventSchema>;
