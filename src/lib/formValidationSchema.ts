import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(), 

  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),

  password: z
    .string().min(6,"Password must be at least 6 characters!" ).optional(),

  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),

  phoneNumber:  z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),


  avatar: z.string().optional().or(z.literal("")),

  role: z.enum(["SUPER_ADMIN", "INSTITUTE_ADMIN", "TEACHER", "STUDENT"], {
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
      "SCHOOL","COLLEGE","COACHING_CENTER","PRIVATE_TUITION",
      "COURSE_PROVIDER","UNIVERSITY",
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
  bio: z.string().min(1,"Bio is required"),
  isVerified: z.boolean().default(false).optional(),
  joinDate: z.string().datetime({ message: "Invalid join date!" }).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;


export const classSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(1, { message: "Class name is required!" }),
  grade: z.enum(
    [
      "GRADE_1","GRADE_2","GRADE_3","GRADE_4","GRADE_5","GRADE_6","GRADE_7",
      "GRADE_8","GRADE_9","GRADE_10","GRADE_11","GRADE_12",
      "UNDERGRADUATE","POSTGRADUATE","OTHER",
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
  title: z.string().min(3).max(200),
  description: z.string().min(5),
  courseId: z.string().uuid(),
  teacherId: z.string().uuid(),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  totalMarks: z.number().positive(),
  passingMarks: z.number().nonnegative(),
  attachments: z.array(z.string().url()).optional().default([]),
  instructions: z.string().optional().nullable(),
  status: AssignmentStatusEnum.default("DRAFT"),
  allowLateSubmission: z.boolean().default(false),
})
.refine((data) => data.passingMarks <= data.totalMarks, {
  message: "Passing marks cannot exceed total marks",
  path: ["passingMarks"],
});
export type AssignmentSchema = z.infer<typeof assignmentSchema>;


