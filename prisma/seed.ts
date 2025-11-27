import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password helper
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // ============================================
  // 1. CREATE SUPER ADMIN
  // ============================================
  console.log('👑 Creating Super Admin...');
  
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'admin@padhaiduniya.com',
      password: await hashPassword('Admin@123'),
      firstName: 'Super',
      lastName: 'Admin',
      phoneNumber: '+919876543210',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      lastLogin: new Date(),
    },
  });

  await prisma.superAdmin.create({
    data: {
      userId: superAdminUser.id,
      dashboardAccess: {
        fullAccess: true,
        canManageInstitutes: true,
        canManageCourses: true,
        canViewAnalytics: true,
      },
    },
  });

  console.log('✅ Super Admin created');

  // ============================================
  // 2. CREATE INSTITUTES
  // ============================================
  console.log('🏫 Creating Institutes...');

  const institutes = await Promise.all([
    prisma.institute.create({
      data: {
        name: 'ABC International School',
        code: 'ABC-SCH-001',
        type: 'SCHOOL',
        status: 'ACTIVE',
        logo: 'https://via.placeholder.com/200x200?text=ABC+School',
        description: 'Premier international school with modern facilities',
        website: 'https://abcschool.edu',
        contactEmail: 'contact@abcschool.edu',
        contactPhone: '+911234567890',
        address: '123 Education Street',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        zipCode: '110001',
      },
    }),
    prisma.institute.create({
      data: {
        name: 'XYZ Engineering College',
        code: 'XYZ-CLG-001',
        type: 'COLLEGE',
        status: 'ACTIVE',
        logo: 'https://via.placeholder.com/200x200?text=XYZ+College',
        description: 'Leading engineering college',
        website: 'https://xyzcollege.edu',
        contactEmail: 'info@xyzcollege.edu',
        contactPhone: '+912234567890',
        address: '456 College Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001',
      },
    }),
    prisma.institute.create({
      data: {
        name: 'Focus Coaching Center',
        code: 'FOCUS-CCH-001',
        type: 'COACHING_CENTER',
        status: 'ACTIVE',
        logo: 'https://via.placeholder.com/200x200?text=Focus',
        description: 'IIT-JEE and NEET coaching center',
        website: 'https://focuscoaching.com',
        contactEmail: 'support@focuscoaching.com',
        contactPhone: '+913334567890',
        address: '789 Coaching Lane',
        city: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        zipCode: '700001',
      },
    }),
  ]);

  console.log(`✅ ${institutes.length} Institutes created`);

  // ============================================
  // 3. CREATE INSTITUTE ADMINS
  // ============================================
  console.log('👨‍💼 Creating Institute Admins...');

  const instituteAdmins = await Promise.all([
    // ABC School Admin
    prisma.user.create({
      data: {
        email: 'admin@abcschool.edu',
        password: await hashPassword('Admin@123'),
        firstName: 'Rajesh',
        lastName: 'Kumar',
        phoneNumber: '+919111111111',
        role: 'INSTITUTE_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        instituteAdmin: {
          create: {
            instituteId: institutes[0].id,
            isCreator: true,
            permissions: {
              canManageTeachers: true,
              canManageStudents: true,
              canManageCourses: true,
              canViewReports: true,
            },
          },
        },
      },
    }),
    // XYZ College Admin
    prisma.user.create({
      data: {
        email: 'admin@xyzcollege.edu',
        password: await hashPassword('Admin@123'),
        firstName: 'Priya',
        lastName: 'Sharma',
        phoneNumber: '+919222222222',
        role: 'INSTITUTE_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        instituteAdmin: {
          create: {
            instituteId: institutes[1].id,
            isCreator: true,
            permissions: {
              canManageTeachers: true,
              canManageStudents: true,
              canManageCourses: true,
              canViewReports: true,
            },
          },
        },
      },
    }),
    // Focus Coaching Admin
    prisma.user.create({
      data: {
        email: 'admin@focuscoaching.com',
        password: await hashPassword('Admin@123'),
        firstName: 'Amit',
        lastName: 'Patel',
        phoneNumber: '+919333333333',
        role: 'INSTITUTE_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        instituteAdmin: {
          create: {
            instituteId: institutes[2].id,
            isCreator: true,
            permissions: {
              canManageTeachers: true,
              canManageStudents: true,
              canManageCourses: true,
              canViewReports: true,
            },
          },
        },
      },
    }),
  ]);

  console.log(`✅ ${instituteAdmins.length} Institute Admins created`);

  // ============================================
  // 4. CREATE TEACHERS
  // ============================================
  console.log('👨‍🏫 Creating Teachers...');

  const teachers = await Promise.all([
    // Teachers for ABC School
    prisma.user.create({
      data: {
        email: 'john.doe@abcschool.edu',
        password: await hashPassword('Teacher@123'),
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+919444444444',
        role: 'TEACHER',
        status: 'ACTIVE',
        emailVerified: true,
        teacherProfile: {
          create: {
            teacherId: 'T001',
            instituteId: institutes[0].id,
            subjects: ['Math', 'Geometry'],
            qualification: 'M.Sc Mathematics',
            experience: 10,
            specialization: 'Advanced Mathematics',
            bio: 'Experienced math teacher with passion for teaching',
            isVerified: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.doe@abcschool.edu',
        password: await hashPassword('Teacher@123'),
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '+919555555555',
        role: 'TEACHER',
        status: 'ACTIVE',
        emailVerified: true,
        teacherProfile: {
          create: {
            teacherId: 'T002',
            instituteId: institutes[0].id,
            subjects: ['Physics', 'Chemistry'],
            qualification: 'M.Sc Physics',
            experience: 8,
            specialization: 'Physical Sciences',
            bio: 'Passionate about making science fun',
            isVerified: true,
          },
        },
      },
    }),
    // Teachers for XYZ College
    prisma.user.create({
      data: {
        email: 'mr.sharma@xyzcollege.edu',
        password: await hashPassword('Teacher@123'),
        firstName: 'Ravi',
        lastName: 'Sharma',
        phoneNumber: '+919666666666',
        role: 'TEACHER',
        status: 'ACTIVE',
        emailVerified: true,
        teacherProfile: {
          create: {
            teacherId: 'T003',
            instituteId: institutes[1].id,
            subjects: ['DBMS', 'SQL Fundamentals'],
            qualification: 'Ph.D Computer Science',
            experience: 15,
            specialization: 'Database Management',
            bio: 'Database expert with industry experience',
            isVerified: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'ms.roy@xyzcollege.edu',
        password: await hashPassword('Teacher@123'),
        firstName: 'Meera',
        lastName: 'Roy',
        phoneNumber: '+919777777777',
        role: 'TEACHER',
        status: 'ACTIVE',
        emailVerified: true,
        teacherProfile: {
          create: {
            teacherId: 'T004',
            instituteId: institutes[1].id,
            subjects: ['Operating Systems'],
            qualification: 'M.Tech Computer Science',
            experience: 12,
            specialization: 'Systems Programming',
            bio: 'OS and systems expert',
            isVerified: true,
          },
        },
      },
    }),
    // Platform Teachers (no institute)
    prisma.user.create({
      data: {
        email: 'teacher@padhaiduniya.com',
        password: await hashPassword('Teacher@123'),
        firstName: 'Platform',
        lastName: 'Teacher',
        phoneNumber: '+919888888888',
        role: 'TEACHER',
        status: 'ACTIVE',
        emailVerified: true,
        teacherProfile: {
          create: {
            teacherId: 'T005',
            subjects: ['Web Development', 'JavaScript', 'React'],
            qualification: 'B.Tech + 10 years industry experience',
            experience: 10,
            specialization: 'Full Stack Development',
            bio: 'Industry expert teaching web development',
            isVerified: true,
          },
        },
      },
    }),
  ]);

  console.log(`✅ ${teachers.length} Teachers created`);

  // ============================================
  // 5. CREATE CLASSES
  // ============================================
  console.log('🎓 Creating Classes...');

  const classes = await Promise.all([
    // ABC School Classes
    prisma.class.create({
      data: {
        name: '1A',
        grade: 'GRADE_1',
        section: 'A',
        capacity: 20,
        academicYear: '2024/25',
        instituteId: institutes[0].id,
        supervisorId: teachers[0].id,
      },
    }),
    prisma.class.create({
      data: {
        name: '2A',
        grade: 'GRADE_2',
        section: 'A',
        capacity: 22,
        academicYear: '2024/25',
        instituteId: institutes[0].id,
        supervisorId: teachers[0].id,
      },
    }),
    prisma.class.create({
      data: {
        name: '3C',
        grade: 'GRADE_3',
        section: 'C',
        capacity: 20,
        academicYear: '2024/25',
        instituteId: institutes[0].id,
        supervisorId: teachers[1].id,
      },
    }),
    // XYZ College Classes
    prisma.class.create({
      data: {
        name: 'CSE-3A',
        grade: 'UNDERGRADUATE',
        section: 'A',
        capacity: 40,
        academicYear: '2024/25',
        instituteId: institutes[1].id,
        supervisorId: teachers[2].id,
      },
    }),
  ]);

  console.log(`✅ ${classes.length} Classes created`);

  // ============================================
  // 6. CREATE STUDENTS
  // ============================================
  console.log('👨‍🎓 Creating Students...');

  const students = await Promise.all([
    // ABC School Students
    prisma.user.create({
      data: {
        email: 'cameron@student.com',
        password: await hashPassword('Student@123'),
        firstName: 'Cameron',
        lastName: 'Moran',
        phoneNumber: '+919000000001',
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true,
        studentProfile: {
          create: {
            studentId: 'S001',
            instituteId: institutes[0].id,
            dateOfBirth: new Date('2018-05-15'),
            guardianName: 'Robert Moran',
            guardianPhone: '+919876543211',
            guardianEmail: 'robert.moran@example.com',
            address: '123 Oakwood Ave, New York',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'sofia@student.com',
        password: await hashPassword('Student@123'),
        firstName: 'Sofia',
        lastName: 'Patel',
        phoneNumber: '+919000000002',
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true,
        studentProfile: {
          create: {
            studentId: 'S002',
            instituteId: institutes[0].id,
            dateOfBirth: new Date('2017-08-20'),
            guardianName: 'Priya Patel',
            guardianPhone: '+919812345678',
            guardianEmail: 'priya.patel@example.com',
            address: 'Delhi, India',
          },
        },
      },
    }),
    // XYZ College Students
    prisma.user.create({
      data: {
        email: 'riya.sen@student.com',
        password: await hashPassword('Student@123'),
        firstName: 'Riya',
        lastName: 'Sen',
        phoneNumber: '+919000000003',
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true,
        studentProfile: {
          create: {
            studentId: 'S003',
            instituteId: institutes[1].id,
            dateOfBirth: new Date('2005-03-10'),
            guardianName: 'Anita Sen',
            guardianPhone: '+919898765432',
            guardianEmail: 'anita.sen@example.com',
            address: 'Mumbai, India',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'amit.das@student.com',
        password: await hashPassword('Student@123'),
        firstName: 'Amit',
        lastName: 'Das',
        phoneNumber: '+919000000004',
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true,
        studentProfile: {
          create: {
            studentId: 'S004',
            instituteId: institutes[1].id,
            dateOfBirth: new Date('2005-07-22'),
            guardianName: 'Rajesh Das',
            guardianPhone: '+919876543212',
            guardianEmail: 'rajesh.das@example.com',
            address: 'Mumbai, India',
          },
        },
      },
    }),
    // Platform-only students
    prisma.user.create({
      data: {
        email: 'ipsita.ghosh@student.com',
        password: await hashPassword('Student@123'),
        firstName: 'Ipsita',
        lastName: 'Ghosh',
        phoneNumber: '+919000000005',
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true,
        studentProfile: {
          create: {
            studentId: 'S005',
            dateOfBirth: new Date('2000-11-05'),
            address: 'Kolkata, India',
          },
        },
      },
    }),
  ]);

  console.log(`✅ ${students.length} Students created`);

  // Get student profiles
  const studentProfiles = await prisma.student.findMany();

  // ============================================
  // 7. ASSIGN STUDENTS TO CLASSES
  // ============================================
  console.log('📝 Assigning Students to Classes...');

  await Promise.all([
    prisma.classStudent.create({
      data: {
        classId: classes[0].id,
        studentId: studentProfiles[0].id,
        rollNumber: 1,
      },
    }),
    prisma.classStudent.create({
      data: {
        classId: classes[1].id,
        studentId: studentProfiles[1].id,
        rollNumber: 1,
      },
    }),
    prisma.classStudent.create({
      data: {
        classId: classes[3].id,
        studentId: studentProfiles[2].id,
        rollNumber: 1,
      },
    }),
    prisma.classStudent.create({
      data: {
        classId: classes[3].id,
        studentId: studentProfiles[3].id,
        rollNumber: 2,
      },
    }),
  ]);

  console.log('✅ Students assigned to classes');

  // ============================================
  // 8. CREATE COURSES
  // ============================================
  console.log('📚 Creating Courses...');

  const teacherProfiles = await prisma.teacher.findMany();

  const courses = await Promise.all([
    // Institute-specific course (XYZ College)
    prisma.course.create({
      data: {
        title: 'Database Management Systems',
        code: 'CS101',
        description: 'Complete DBMS course covering normalization, SQL, and more',
        thumbnail: 'https://via.placeholder.com/400x300?text=DBMS+Course',
        type: 'INSTITUTE_SPECIFIC',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        price: 0,
        duration: 60,
        category: 'Computer Science',
        tags: ['DBMS', 'SQL', 'Database'],
        prerequisites: ['Basic Programming'],
        instituteId: institutes[1].id,
        isPublic: false,
        publishedAt: new Date(),
      },
    }),
    // Platform public course
    prisma.course.create({
      data: {
        title: 'Complete Web Development Bootcamp',
        code: 'WEB101',
        description: 'Learn HTML, CSS, JavaScript, React from scratch',
        thumbnail: 'https://via.placeholder.com/400x300?text=Web+Dev',
        type: 'PREMIUM',
        level: 'BEGINNER',
        status: 'PUBLISHED',
        price: 4999,
        discountPrice: 2999,
        duration: 120,
        language: 'English',
        category: 'Web Development',
        tags: ['HTML', 'CSS', 'JavaScript', 'React'],
        prerequisites: [],
        isPublic: true,
        publishedAt: new Date(),
      },
    }),
    // Free platform course
    prisma.course.create({
      data: {
        title: 'Introduction to Python Programming',
        code: 'PY101',
        description: 'Learn Python basics for free',
        thumbnail: 'https://via.placeholder.com/400x300?text=Python',
        type: 'FREE',
        level: 'BEGINNER',
        status: 'PUBLISHED',
        price: 0,
        duration: 40,
        language: 'English',
        category: 'Programming',
        tags: ['Python', 'Programming', 'Basics'],
        prerequisites: [],
        isPublic: true,
        publishedAt: new Date(),
      },
    }),
    // School course
    prisma.course.create({
      data: {
        title: 'Physics Class 10',
        code: 'PHY101',
        description: 'Complete Physics curriculum for Class 10',
        thumbnail: 'https://via.placeholder.com/400x300?text=Physics',
        type: 'INSTITUTE_SPECIFIC',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        price: 0,
        duration: 80,
        category: 'Science',
        tags: ['Physics', 'Science', 'Class 10'],
        prerequisites: [],
        instituteId: institutes[0].id,
        isPublic: false,
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ ${courses.length} Courses created`);

  // ============================================
  // 9. ASSIGN TEACHERS TO COURSES
  // ============================================
  console.log('👨‍🏫 Assigning Teachers to Courses...');

  await Promise.all([
    prisma.courseTeacher.create({
      data: {
        courseId: courses[0].id,
        teacherId: teacherProfiles[2].id, // Mr. Sharma - DBMS
        role: 'Instructor',
      },
    }),
    prisma.courseTeacher.create({
      data: {
        courseId: courses[1].id,
        teacherId: teacherProfiles[4].id, // Platform Teacher - Web Dev
        role: 'Instructor',
      },
    }),
    prisma.courseTeacher.create({
      data: {
        courseId: courses[2].id,
        teacherId: teacherProfiles[4].id, // Platform Teacher - Python
        role: 'Instructor',
      },
    }),
    prisma.courseTeacher.create({
      data: {
        courseId: courses[3].id,
        teacherId: teacherProfiles[1].id, // Jane Doe - Physics
        role: 'Instructor',
      },
    }),
  ]);

  console.log('✅ Teachers assigned to courses');

  // ============================================
  // 10. ENROLL STUDENTS IN COURSES
  // ============================================
  console.log('📝 Enrolling Students in Courses...');

  await Promise.all([
    prisma.courseEnrollment.create({
      data: {
        studentId: studentProfiles[2].id, // Riya Sen
        courseId: courses[0].id, // DBMS
        progress: 45,
        status: 'ACTIVE',
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        studentId: studentProfiles[3].id, // Amit Das
        courseId: courses[0].id, // DBMS
        progress: 30,
        status: 'ACTIVE',
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        studentId: studentProfiles[4].id, // Ipsita Ghosh
        courseId: courses[1].id, // Web Dev
        progress: 65,
        status: 'ACTIVE',
        paymentId: 'PAY123456',
        amountPaid: 2999,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        studentId: studentProfiles[0].id, // Cameron
        courseId: courses[3].id, // Physics
        progress: 20,
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✅ Students enrolled in courses');

  // ============================================
  // 11. CREATE COURSE MODULES & LESSONS
  // ============================================
  console.log('📖 Creating Course Modules and Lessons...');

  const dbmsModule = await prisma.courseModule.create({
    data: {
      courseId: courses[0].id,
      title: 'Introduction to DBMS',
      description: 'Basic concepts of database management',
      orderIndex: 1,
    },
  });

  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        moduleId: dbmsModule.id,
        title: 'What is a Database?',
        description: 'Understanding databases and DBMS',
        type: 'VIDEO',
        content: 'https://example.com/video/dbms-intro',
        duration: 30,
        orderIndex: 1,
        teacherId: teacherProfiles[2].id,
        isPublished: true,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: dbmsModule.id,
        title: 'Normalization',
        description: 'Database normalization techniques',
        type: 'VIDEO',
        content: 'https://example.com/video/normalization',
        duration: 45,
        orderIndex: 2,
        teacherId: teacherProfiles[2].id,
        isPublished: true,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: dbmsModule.id,
        title: 'ER Diagrams',
        description: 'Entity-Relationship diagrams',
        type: 'DOCUMENT',
        content: 'https://example.com/docs/er-diagrams.pdf',
        duration: 60,
        orderIndex: 3,
        teacherId: teacherProfiles[2].id,
        isPublished: true,
      },
    }),
  ]);

  console.log(`✅ Created module with ${lessons.length} lessons`);

  // ============================================
  // 12. CREATE LESSON PROGRESS
  // ============================================
  console.log('📊 Creating Lesson Progress...');

  await Promise.all([
    prisma.lessonProgress.create({
      data: {
        lessonId: lessons[0].id,
        studentId: studentProfiles[2].id,
        isCompleted: true,
        progress: 100,
        timeSpent: 1800, // 30 minutes
        completedAt: new Date(),
      },
    }),
    prisma.lessonProgress.create({
      data: {
        lessonId: lessons[1].id,
        studentId: studentProfiles[2].id,
        isCompleted: true,
        progress: 100,
        timeSpent: 2700, // 45 minutes
        completedAt: new Date(),
      },
    }),
    prisma.lessonProgress.create({
      data: {
        lessonId: lessons[2].id,
        studentId: studentProfiles[2].id,
        isCompleted: false,
        progress: 50,
        timeSpent: 1800,
      },
    }),
  ]);

  console.log('✅ Lesson progress created');

  // ============================================
  // 13. CREATE ASSIGNMENTS
  // ============================================
  console.log('📝 Creating Assignments...');

  const assignment = await prisma.assignment.create({
    data: {
      title: 'DBMS Normalization Assignment',
      description: 'Normalize the given database schema to 3NF',
      courseId: courses[0].id,
      teacherId: teacherProfiles[2].id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalMarks: 100,
      passingMarks: 40,
      status: 'PUBLISHED',
      allowLateSubmission: true,
      instructions: 'Submit your solutions in PDF format',
    },
  });

  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment.id,
      studentId: studentProfiles[2].id,
      content: 'My solution to the normalization problem...',
      attachments: ['https://example.com/submissions/riya-solution.pdf'],
      status: 'GRADED',
      marksObtained: 88,
      feedback: 'Excellent work! Well explained.',
      gradedAt: new Date(),
    },
  });

  console.log('✅ Assignments created');

  // ============================================
  // 14. CREATE EXAMS & QUIZZES
  // ============================================
  console.log('📝 Creating Exams and Quizzes...');

  const exam = await prisma.exam.create({
    data: {
      title: 'DBMS Midterm Exam',
      description: 'Midterm examination covering all topics',
      courseId: courses[0].id,
      teacherId: teacherProfiles[2].id,
      type: 'MIDTERM',
      scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      duration: 120,
      totalMarks: 100,
      passingMarks: 40,
      isPublished: true,
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: 'Daily SQL Quiz',
      description: 'Test your SQL knowledge',
      courseId: courses[0].id,
      teacherId: teacherProfiles[2].id,
      type: 'DAILY_TRIVIA',
      duration: 15,
      totalMarks: 10,
      passingMarks: 6,
      isPublished: true,
      scheduledAt: new Date(),
    },
  });

  console.log('✅ Exams and quizzes created');

  // ============================================
  // 15. CREATE DAILY ACTIVITIES
  // ============================================
  console.log('📅 Creating Daily Activities...');

  const today = new Date();
  const activities = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const lessonsCompleted = Math.floor(Math.random() * 5);
    const quizzesAttempted = Math.floor(Math.random() * 3);
    const assignmentsSubmitted = Math.floor(Math.random() * 2);
    const timeSpent = Math.floor(Math.random() * 180) + 30; // 30-210 minutes

    const activityScore = Math.min(
      100,
      (lessonsCompleted * 20 + quizzesAttempted * 15 + assignmentsSubmitted * 25 + timeSpent / 2)
    );

    activities.push(
      prisma.dailyActivity.create({
        data: {
          studentId: studentProfiles[2].id, // Riya Sen
          date: date,
          lessonsCompleted,
          quizzesAttempted,
          assignmentsSubmitted,
          timeSpent,
          pointsEarned: Math.floor(activityScore),
          activityScore: activityScore,
        },
      })
    );
  }

  await Promise.all(activities);

  console.log('✅ Daily activities created');

  // ============================================
  // 16. CREATE STUDENT PROGRESS
  // ============================================
  console.log('📈 Creating Student Progress...');

  await Promise.all([
    prisma.studentProgress.create({
      data: {
        studentId: studentProfiles[2].id,
        courseId: courses[0].id,
        totalLessons: 3,
        completedLessons: 2,
        totalAssignments: 1,
        completedAssignments: 1,
        totalQuizzes: 1,
        completedQuizzes: 0,
        overallProgress: 45,
        averageScore: 88,
      },
    }),
    prisma.studentProgress.create({
      data: {
        studentId: studentProfiles[3].id,
        courseId: courses[0].id,
        totalLessons: 3,
        completedLessons: 1,
        totalAssignments: 1,
        completedAssignments: 0,
        totalQuizzes: 1,
        completedQuizzes: 0,
        overallProgress: 30,
        averageScore: 0,
      },
    }),
  ]);

  console.log('✅ Student progress created');

  // ============================================
  // 17. CREATE RESULTS
  // ============================================
  console.log('🎯 Creating Results...');

  await Promise.all([
    prisma.result.create({
      data: {
        studentId: studentProfiles[2].id,
        courseId: courses[0].id,
        subjectName: 'Database Management Systems',
        subjectCode: 'CS101',
        marksObtained: 92,
        totalMarks: 100,
        percentage: 92,
        grade: 'A+',
        examDate: new Date('2025-09-20'),
        resultDate: new Date('2025-09-25'),
        remarks: 'Excellent performance',
      },
    }),
    prisma.result.create({
      data: {
        studentId: studentProfiles[3].id,
        courseId: courses[0].id,
        subjectName: 'Operating Systems',
        subjectCode: 'CS202',
        marksObtained: 81,
        totalMarks: 100,
        percentage: 81,
        grade: 'A',
        examDate: new Date('2025-09-18'),
        resultDate: new Date('2025-09-23'),
        remarks: 'Good work',
      },
    }),
  ]);

  console.log('✅ Results created');

  // ============================================
  // 18. CREATE ATTENDANCE
  // ============================================
  console.log('✅ Creating Attendance Records...');

  const attendanceRecords = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    attendanceRecords.push(
      prisma.attendance.create({
        data: {
          studentId: studentProfiles[2].id,
          classId: classes[3].id,
          date: date,
          status: i % 5 === 0 ? 'ABSENT' : 'PRESENT',
          remarks: i % 5 === 0 ? 'Medical leave' : null,
        },
      })
    );
  }

  await Promise.all(attendanceRecords);

  console.log('✅ Attendance records created');

  // ============================================
  // 19. CREATE ANNOUNCEMENTS
  // ============================================
  console.log('📢 Creating Announcements...');

  await Promise.all([
    prisma.announcement.create({
      data: {
        title: 'About 4A Math Test',
        content: 'Math test for class 4A will be held on 2025-01-01',
        target: 'SPECIFIC_CLASS',
        instituteId: institutes[0].id,
        classId: classes[0].id,
        isPinned: true,
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'About 3A Math Test',
        content: 'Math test for class 3A will be held on 2025-01-01',
        target: 'SPECIFIC_CLASS',
        instituteId: institutes[0].id,
        classId: classes[1].id,
        isPinned: false,
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'Platform Maintenance',
        content: 'The platform will undergo maintenance on Sunday',
        target: 'PLATFORM_WIDE',
        isPinned: true,
      },
    }),
  ]);

  console.log('✅ Announcements created');

  // ============================================
  // 20. CREATE EVENTS
  // ============================================
  console.log('📅 Creating Events...');

  await Promise.all([
    prisma.event.create({
      data: {
        title: 'Lake Trip',
        description: 'Class trip to the lake',
        instituteId: institutes[0].id,
        classId: classes[0].id,
        startTime: new Date('2025-01-01T10:00:00'),
        endTime: new Date('2025-01-01T11:00:00'),
        location: 'Lake Park',
        isVirtual: false,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Parent-Teacher Meeting',
        description: 'Discuss student progress',
        instituteId: institutes[0].id,
        startTime: new Date('2025-01-05T15:00:00'),
        endTime: new Date('2025-01-05T17:00:00'),
        location: 'School Auditorium',
        isVirtual: false,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Online Workshop: Career Guidance',
        description: 'Career guidance for students',
        startTime: new Date('2025-01-10T18:00:00'),
        endTime: new Date('2025-01-10T20:00:00'),
        isVirtual: true,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      },
    }),
  ]);

  console.log('✅ Events created');

  // ============================================
  // 21. CREATE MESSAGES
  // ============================================
  console.log('💬 Creating Messages...');

  await Promise.all([
    prisma.message.create({
      data: {
        senderId: teacherProfiles[2].userId,
        receiverId: studentProfiles[2].userId,
        subject: 'Assignment Feedback',
        content: 'Great work on your DBMS assignment! Keep it up.',
        isRead: true,
        readAt: new Date(),
      },
    }),
    prisma.message.create({
      data: {
        senderId: instituteAdmins[1].id,
        receiverId: teacherProfiles[2].userId,
        subject: 'Course Update Required',
        content: 'Please update the course materials for next semester.',
        isRead: false,
      },
    }),
  ]);

  console.log('✅ Messages created');

  // ============================================
  // 22. CREATE NOTIFICATIONS
  // ============================================
  console.log('🔔 Creating Notifications...');

  await Promise.all([
    prisma.notification.create({
      data: {
        userId: studentProfiles[2].userId,
        type: 'ASSIGNMENT',
        title: 'New Assignment Posted',
        content: 'DBMS Normalization Assignment has been posted',
        link: `/courses/${courses[0].id}/assignments/${assignment.id}`,
        isRead: true,
        readAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        userId: studentProfiles[2].userId,
        type: 'RESULT',
        title: 'Exam Result Published',
        content: 'Your DBMS exam result is now available',
        link: '/results',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: studentProfiles[3].userId,
        type: 'ANNOUNCEMENT',
        title: 'New Announcement',
        content: 'Important announcement from the institute',
        link: '/announcements',
        isRead: false,
      },
    }),
  ]);

  console.log('✅ Notifications created');

  // ============================================
  // 23. CREATE COURSE REVIEWS
  // ============================================
  console.log('⭐ Creating Course Reviews...');

  await Promise.all([
    prisma.courseReview.create({
      data: {
        courseId: courses[0].id,
        studentId: studentProfiles[2].studentId,
        rating: 4.5,
        review: 'Excellent course! Very well explained by Mr. Sharma.',
      },
    }),
    prisma.courseReview.create({
      data: {
        courseId: courses[1].id,
        studentId: studentProfiles[4].studentId,
        rating: 5.0,
        review: 'Best web development course I have taken!',
      },
    }),
  ]);

  console.log('✅ Course reviews created');

  // ============================================
  // 24. CREATE STUDY MATERIALS
  // ============================================
  console.log('📚 Creating Study Materials...');

  await Promise.all([
    prisma.studyMaterial.create({
      data: {
        title: 'DBMS Complete Notes',
        description: 'Comprehensive notes covering all DBMS topics',
        type: 'PDF',
        fileUrl: 'https://example.com/materials/dbms-notes.pdf',
        fileSize: 5242880, // 5MB
        courseId: courses[0].id,
        isPublic: false,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'SQL Practice Questions',
        description: '100+ SQL practice questions with solutions',
        type: 'PDF',
        fileUrl: 'https://example.com/materials/sql-practice.pdf',
        fileSize: 2097152, // 2MB
        courseId: courses[0].id,
        isPublic: false,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'Web Development Cheatsheet',
        description: 'Quick reference for HTML, CSS, JS',
        type: 'PDF',
        fileUrl: 'https://example.com/materials/web-dev-cheatsheet.pdf',
        fileSize: 1048576, // 1MB
        courseId: courses[1].id,
        isPublic: true,
      },
    }),
  ]);

  console.log('✅ Study materials created');

  // ============================================
  // 25. CREATE ACTIVITY LOGS
  // ============================================
  console.log('📝 Creating Activity Logs...');

  await Promise.all([
    prisma.activityLog.create({
      data: {
        userId: studentProfiles[2].userId,
        activityType: 'LOGIN',
        description: 'User logged in',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: studentProfiles[2].userId,
        activityType: 'COURSE_ENROLLMENT',
        description: 'Enrolled in DBMS course',
        metadata: { courseId: courses[0].id },
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: studentProfiles[2].userId,
        activityType: 'LESSON_COMPLETED',
        description: 'Completed lesson: What is a Database?',
        metadata: { lessonId: lessons[0].id },
      },
    }),
  ]);

  console.log('✅ Activity logs created');

  // ============================================
  // 26. CREATE PLATFORM STATISTICS
  // ============================================
  console.log('📊 Creating Platform Statistics...');

  const statsData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    statsData.push(
      prisma.platformStats.create({
        data: {
          date: date,
          totalUsers: 100 + i * 5,
          totalStudents: 60 + i * 3,
          totalTeachers: 20 + i,
          totalInstitutes: 10 + Math.floor(i / 3),
          totalCourses: 50 + i * 2,
          activeUsers: 50 + Math.floor(Math.random() * 30),
          newEnrollments: Math.floor(Math.random() * 20),
          revenueGenerated: Math.floor(Math.random() * 50000),
        },
      })
    );
  }

  await Promise.all(statsData);

  console.log('✅ Platform statistics created');

  // ============================================
  // 27. CREATE EXAM QUESTIONS
  // ============================================
  console.log('❓ Creating Exam Questions...');

  await Promise.all([
    prisma.examQuestion.create({
      data: {
        examId: exam.id,
        questionText: 'What is normalization in DBMS?',
        questionType: 'ESSAY',
        marks: 10,
        orderIndex: 1,
      },
    }),
    prisma.examQuestion.create({
      data: {
        examId: exam.id,
        questionText: 'Which normal form eliminates transitive dependencies?',
        questionType: 'MCQ',
        options: {
          A: '1NF',
          B: '2NF',
          C: '3NF',
          D: 'BCNF',
        },
        correctAnswer: 'C',
        marks: 5,
        orderIndex: 2,
      },
    }),
  ]);

  console.log('✅ Exam questions created');

  // ============================================
  // 28. CREATE QUIZ QUESTIONS
  // ============================================
  console.log('❓ Creating Quiz Questions...');

  await Promise.all([
    prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        questionText: 'What does SQL stand for?',
        questionType: 'MCQ',
        options: {
          A: 'Structured Query Language',
          B: 'Simple Query Language',
          C: 'Standard Query Language',
          D: 'System Query Language',
        },
        correctAnswer: 'A',
        explanation: 'SQL stands for Structured Query Language',
        marks: 2,
        orderIndex: 1,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        questionText: 'SELECT * FROM table_name fetches all columns',
        questionType: 'TRUE_FALSE',
        correctAnswer: 'TRUE',
        explanation: 'The * wildcard selects all columns',
        marks: 2,
        orderIndex: 2,
      },
    }),
  ]);

  console.log('✅ Quiz questions created');

  // ============================================
  // 29. CREATE QUIZ ATTEMPTS
  // ============================================
  console.log('📝 Creating Quiz Attempts...');

  await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      studentId: studentProfiles[2].id,
      startedAt: new Date(),
      submittedAt: new Date(),
      answers: {
        q1: 'A',
        q2: 'TRUE',
      },
      marksObtained: 4,
      isPassed: true,
    },
  });

  console.log('✅ Quiz attempts created');

  // ============================================
  // 30. ASSIGN CLASS TEACHERS
  // ============================================
  console.log('👨‍🏫 Assigning Teachers to Classes...');

  await Promise.all([
    prisma.classTeacher.create({
      data: {
        classId: classes[0].id,
        teacherId: teacherProfiles[0].id,
        isPrimary: true,
      },
    }),
    prisma.classTeacher.create({
      data: {
        classId: classes[1].id,
        teacherId: teacherProfiles[0].id,
        isPrimary: true,
      },
    }),
    prisma.classTeacher.create({
      data: {
        classId: classes[2].id,
        teacherId: teacherProfiles[1].id,
        isPrimary: true,
      },
    }),
    prisma.classTeacher.create({
      data: {
        classId: classes[3].id,
        teacherId: teacherProfiles[2].id,
        isPrimary: true,
      },
    }),
  ]);

  console.log('✅ Teachers assigned to classes');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👑 Super Admins: 1`);
  console.log(`🏫 Institutes: ${institutes.length}`);
  console.log(`👨‍💼 Institute Admins: ${instituteAdmins.length}`);
  console.log(`👨‍🏫 Teachers: ${teachers.length}`);
  console.log(`👨‍🎓 Students: ${students.length}`);
  console.log(`🎓 Classes: ${classes.length}`);
  console.log(`📚 Courses: ${courses.length}`);
  console.log(`📖 Lessons: ${lessons.length}`);
  console.log(`📝 Assignments: 1`);
  console.log(`📝 Exams: 1`);
  console.log(`❓ Quizzes: 1`);
  console.log(`📢 Announcements: 3`);
  console.log(`📅 Events: 3`);
  console.log(`📊 Platform Stats: 30 days`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🔑 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Super Admin:');
  console.log('  Email: admin@padhaiduniya.com');
  console.log('  Password: Admin@123\n');
  console.log('Institute Admin (ABC School):');
  console.log('  Email: admin@abcschool.edu');
  console.log('  Password: Admin@123\n');
  console.log('Institute Admin (XYZ College):');
  console.log('  Email: admin@xyzcollege.edu');
  console.log('  Password: Admin@123\n');
  console.log('Teacher (DBMS):');
  console.log('  Email: mr.sharma@xyzcollege.edu');
  console.log('  Password: Teacher@123\n');
  console.log('Student (Riya Sen):');
  console.log('  Email: riya.sen@student.com');
  console.log('  Password: Student@123\n');
  console.log('Student (Platform User):');
  console.log('  Email: ipsita.ghosh@student.com');
  console.log('  Password: Student@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });