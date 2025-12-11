import ActivityHeatmap from "@/components/ActivityHeatmap";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SingleTeacherPage(props: { params: { id: string } }) {
  const { id } = await props.params;

  // Fetch teacher with all related data
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phoneNumber: true,
          status: true,
          lastLogin: true,
        },
      },
      institute: {
        select: {
          name: true,
          type: true,
          city: true,
        },
      },
      _count: {
        select: {
          classes: true,
          courses: true,
          lessons: true,
          assignments: true,
          exams: true,
          quizzes: true,
        },
      },
      classes: {
        include: {
          class: {
            select: {
              name: true,
              grade: true,
              capacity: true,
            },
          },
        },
        take: 5,
      },
      courses: {
        include: {
          course: {
            select: {
              title: true,
              code: true,
              status: true,
              type: true,
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
        },
        take: 5,
      },
    },
  });

  if (!teacher) {
    return notFound();
  }

  // Calculate total students (unique students across all courses and classes)
  const totalStudentsInClasses = await prisma.classStudent.count({
    where: {
      class: {
        teachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
    },
  });

  const totalStudentsInCourses = await prisma.courseEnrollment.count({
    where: {
      course: {
        teachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
    },
  });

  const totalStudents = totalStudentsInClasses + totalStudentsInCourses;

  // Calculate attendance percentage (mock for now - implement actual logic)
  const attendancePercentage = 92;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const [lessonsCreated, assignmentsCreated, examsCreated, quizzesCreated] = await Promise.all([
    prisma.lesson.findMany({
      where: { teacherId: id, createdAt: { gte: oneYearAgo } },
      select: { createdAt: true },
    }),
    prisma.assignment.findMany({
      where: { teacherId: id, createdAt: { gte: oneYearAgo } },
      select: { createdAt: true },
    }),
    prisma.exam.findMany({
      where: { teacherId: id, createdAt: { gte: oneYearAgo } },
      select: { createdAt: true },
    }),
    prisma.quiz.findMany({
      where: { teacherId: id, createdAt: { gte: oneYearAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Aggregate counts by date
  const activityCountsByDate: Record<string, number> = {};
  const allActivities = [
    ...lessonsCreated,
    ...assignmentsCreated,
    ...examsCreated,
    ...quizzesCreated
  ];

  allActivities.forEach(activity => {
    // FIX: Use consistent date formatting
    const d = activity.createdAt;
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    activityCountsByDate[dateKey] = (activityCountsByDate[dateKey] || 0) + 1;
  });

  // Convert to the format needed by ActivityHeatmap component
  // CRITICAL: Pass Date objects, not strings
  const teacherActivityData = Object.entries(activityCountsByDate).map(([dateStr, count]) => ({
    date: new Date(dateStr + 'T00:00:00'), // Add time to prevent timezone shifts
    count,
  }));


  // Format teacher name
  const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`;

  // Format join date
  const joinDate = new Intl.DateTimeFormat("en-GB").format(teacher.joinDate);

  // Format last login
  const lastLogin = teacher.user.lastLogin
    ? new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(teacher.user.lastLogin)
    : "Never";

  const IconSpan = ({ children, className = "text-blue-500" }: { children: React.ReactNode, className?: string }) => (
    <span className={`w-5 h-5 flex items-center justify-center ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-6 xl:flex-row bg-gray-50 min-h-screen">

      {/* LEFT COLUMN (WIDER CONTENT) */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">

        {/* === 1. TOP SECTION: USER INFO & STAT CARDS === */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* A. USER INFO CARD (Prominent and Clean) */}
          <div className="bg-white p-6 rounded-xl shadow-2xl flex-1 flex flex-col sm:flex-row gap-6 border-l-8 border-indigo-500/80 transition-shadow hover:shadow-indigo-300">

            <div className="flex flex-col items-center sm:items-start sm:w-1/3">
              <Image
                src={teacher.user.avatar || "/avatar.png"}
                alt={fullName}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-200 shadow-md"
              />
            </div>

            <div className="flex flex-col justify-between gap-4 sm:w-2/3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-extrabold text-gray-900">{fullName}</h1>
                  {(role === "admin" || role === "institute") && (
                    <FormContainer table="teacher" type="update" data={teacher} />
                  )}
                </div>
                <p className="text-base text-indigo-600 font-semibold italic">{teacher.qualification || "Educator"}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {teacher.bio || "No biography available. Use the edit feature to add a brief professional introduction."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm font-medium text-gray-700 mt-3 border-t border-gray-100 pt-3">

                <div className="flex items-center gap-1">
                  <IconSpan>📅</IconSpan>
                  <span title="Joined Date">{joinDate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <IconSpan>📧</IconSpan>
                  <span className="truncate" title={teacher.user.email}>{teacher.user.email}</span>
                </div>

                <div className="flex items-center gap-1">
                  <IconSpan>📞</IconSpan>
                  <span>{teacher.user.phoneNumber || "N/A"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <IconSpan className={teacher.user.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>🟢</IconSpan>
                  <span className={`font-semibold ${teacher.user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                    {teacher.user.status}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* B. SMALL STAT CARDS (Data Visualization Focus) */}
          <div className="grid grid-cols-2 gap-4 lg:w-2/5">

            {/* CARD - Total Students */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-blue-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-blue-500">🧑‍🎓</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Total Students</span>
              <h1 className="text-3xl font-extrabold text-blue-800">{totalStudents}</h1>
            </div>

            {/* CARD - Classes */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-teal-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-teal-500">🏫</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Classes Taught</span>
              <h1 className="text-3xl font-extrabold text-teal-800">{teacher._count.classes}</h1>
            </div>

            {/* CARD - Courses */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-purple-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-purple-500">📚</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Courses Assigned</span>
              <h1 className="text-3xl font-extrabold text-purple-800">{teacher._count.courses}</h1>
            </div>

            {/* CARD - Experience */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-orange-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-orange-500">🏆</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Experience</span>
              <h1 className="text-3xl font-extrabold text-orange-800">{teacher.experience ?? 0} <span className="text-lg font-semibold">Yrs</span></h1>
            </div>
          </div>
        </div>

        {/* === 2. PROFESSIONAL DETAILS & SUBJECTS === */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Professional Details</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

            {/* Field: Teacher ID */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">#</IconSpan> Teacher ID</span>
              <span className="text-sm font-medium text-gray-800">{teacher.teacherId}</span>
            </div>

            {/* Field: Institute */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">🏛️</IconSpan> Institute</span>
              <span className="text-sm font-medium text-gray-800">{teacher.institute?.name || "Platform Teacher"}</span>
            </div>

            {/* Field: Specialization */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">✨</IconSpan> Specialization</span>
              <span className="text-sm font-medium text-gray-800">{teacher.specialization || "N/A"}</span>
            </div>

            {/* Field: Verification Status */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">✅</IconSpan> Verification</span>
              <span className={`text-sm font-bold ${teacher.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                {teacher.isVerified ? "Verified" : "Pending"}
              </span>
            </div>

            {/* Field: Subjects */}
            <div className="flex flex-col col-span-2 md:col-span-3 mt-4">
              <span className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">📖</IconSpan> Subjects Taught</span>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.length > 0 ? (
                  teacher.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-medium hover:bg-indigo-100 transition"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 italic">No primary subjects listed.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === 3. CLASSES & COURSES LISTS === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Classes List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Teaching Classes ({teacher._count.classes})</h1>
            {teacher.classes.length > 0 ? (
              <div className="space-y-4">
                {teacher.classes.map((classTeacher) => (
                  <div
                    key={classTeacher.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 transition duration-200 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{classTeacher.class.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Grade: <span className="font-medium">{classTeacher.class.grade.replace("GRADE_", "").replace("_", " ")}</span> | Max: {classTeacher.class.capacity}
                      </p>
                    </div>
                    {classTeacher.isPrimary && (
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
                {teacher._count.classes > 5 && (
                  <Link
                    href={`/list/classes?teacherId=${teacher.id}`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline mt-4 block"
                  >
                    View all {teacher._count.classes} classes →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No classes are currently assigned.</p>
            )}
          </div>

          {/* Courses List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Assigned Courses ({teacher._count.courses})</h1>
            {teacher.courses.length > 0 ? (
              <div className="space-y-4">
                {teacher.courses.map((courseTeacher) => (
                  <div
                    key={courseTeacher.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 transition duration-200 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{courseTeacher.course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: {courseTeacher.course.code} | Students: <span className="font-medium">{courseTeacher.course._count.enrollments}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {courseTeacher.role}
                    </span>
                  </div>
                ))}
                {teacher._count.courses > 5 && (
                  <Link
                    href={`/list/courses?teacherId=${teacher.id}`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline mt-4 block"
                  >
                    View all {teacher._count.courses} courses →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No courses are currently assigned.</p>
            )}
          </div>
        </div>

        {/* === 4. CONTENT CONTRIBUTION STATISTICS === */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Content Contribution</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* Stat Card: Assignments */}
            <div className="text-center p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-200 transition-transform hover:bg-blue-100">
              <IconSpan className="text-blue-600 mx-auto text-3xl mb-1">✍️</IconSpan>
              <p className="text-3xl font-extrabold text-blue-800">{teacher._count.assignments}</p>
              <p className="text-sm text-gray-600">Assignments</p>
            </div>

            {/* Stat Card: Exams */}
            <div className="text-center p-4 bg-green-50 rounded-lg shadow-inner border border-green-200 transition-transform hover:bg-green-100">
              <IconSpan className="text-green-600 mx-auto text-3xl mb-1">📝</IconSpan>
              <p className="text-3xl font-extrabold text-green-800">{teacher._count.exams}</p>
              <p className="text-sm text-gray-600">Exams</p>
            </div>

            {/* Stat Card: Quizzes */}
            <div className="text-center p-4 bg-purple-50 rounded-lg shadow-inner border border-purple-200 transition-transform hover:bg-purple-100">
              <IconSpan className="text-purple-600 mx-auto text-3xl mb-1">❓</IconSpan>
              <p className="text-3xl font-extrabold text-purple-800">{teacher._count.quizzes}</p>
              <p className="text-sm text-gray-600">Quizzes</p>
            </div>

            {/* Stat Card: Lessons */}
            <div className="text-center p-4 bg-orange-50 rounded-lg shadow-inner border border-orange-200 transition-transform hover:bg-orange-100">
              <IconSpan className="text-orange-600 mx-auto text-3xl mb-1">💡</IconSpan>
              <p className="text-3xl font-extrabold text-orange-800">{teacher._count.lessons}</p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>
          </div>
        </div>

        {/* --- 5. TEACHER ACTIVITY HEATMAP --- */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <ActivityHeatmap
            data={teacherActivityData}
            title="Content Creation Activity"
            subtitle="Heatmap of lessons, assignments, exams, and quizzes created over the past year."
            colorScheme="orange" // Or choose another scheme like 'blue'
          />
        </div> */}

        {/* === 5. SCHEDULE CALENDAR === */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[800px] mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT COLUMN (NARROW SIDEBAR) */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">

        {/* QUICK ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h1>
          <div className="flex gap-3 flex-wrap text-sm">
            {/* Replaced colors with a clean palette and added subtle hover effects */}
            {[
              { label: "Classes", href: `/list/classes?teacherId=${teacher.id}`, bgColor: "bg-indigo-50", textColor: "text-indigo-700" },
              { label: "Students", href: `/list/students?teacherId=${teacher.id}`, bgColor: "bg-green-50", textColor: "text-green-700" },
              { label: "Lessons", href: `/list/lessons?teacherId=${teacher.id}`, bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
              { label: "Exams", href: `/list/exams?teacherId=${teacher.id}`, bgColor: "bg-pink-50", textColor: "text-pink-700" },
              { label: "Assignments", href: `/list/assignments?teacherId=${teacher.id}`, bgColor: "bg-blue-50", textColor: "text-blue-700" },
              { label: "Courses", href: `/list/courses?teacherId=${teacher.id}`, bgColor: "bg-teal-50", textColor: "text-teal-700" },
            ].map((item, index) => (
              <Link
                key={index}
                className={`p-3 rounded-lg ${item.bgColor} ${item.textColor} font-semibold transition hover:opacity-80 shadow-sm`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <Performance />

        {/* Announcements */}
        <Announcements />
      </div>
    </div>
  );
}