import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import Performance from "@/components/Performance";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import FormContainer from "@/components/FormContainer";
import { Target, Trophy } from "lucide-react";

export default async function SingleStudentPage(props: { params: { id: string } }) {
  const { id } = await props.params;

  // Fetch student with all related data
  const student = await prisma.student.findUnique({
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
          enrollments: true,
          classStudents: true,
          assignments: true,
          examAttempts: true,
          quizAttempts: true,
          results: true,
          lessonProgress: true,
        },
      },
      classStudents: {
        include: {
          class: {
            select: {
              name: true,
              grade: true,
              section: true,
              capacity: true,
              academicYear: true,
            },
          },
        },
        take: 1,
        orderBy: {
          joinedAt: 'desc',
        },
      },
      enrollments: {
        include: {
          course: {
            select: {
              title: true,
              code: true,
              type: true,
              status: true,
            },
          },
        },
        where: {
          status: 'ACTIVE',
        },
        take: 5,
        orderBy: {
          enrolledAt: 'desc',
        },
      },
      progress: {
        take: 5,
      },
      results: {
        orderBy: {
          examDate: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!student) {
    return notFound();
  }

  // Calculate attendance percentage
  const totalAttendanceDays = await prisma.attendance.count({
    where: { studentId: student.id },
  });

  const presentDays = await prisma.attendance.count({
    where: {
      studentId: student.id,
      status: 'PRESENT',
    },
  });

  const attendancePercentage = totalAttendanceDays > 0 
    ? Math.round((presentDays / totalAttendanceDays) * 100) 
    : 0;

  // Calculate average score from results
  const averageScore = student.results.length > 0
    ? Math.round(
        student.results.reduce((sum, result) => sum + result.percentage, 0) / 
        student.results.length
      )
    : 0;

  // Get total completed lessons
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      studentId: student.id,
      isCompleted: true,
    },
  });

  // Get recent activity for calendar
  const recentActivities = await prisma.dailyActivity.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' },
    take: 150,
  });

  // Format student name
  const fullName = `${student.user.firstName} ${student.user.lastName}`;
  
  // Format enrollment date
  const enrollmentDate = new Intl.DateTimeFormat("en-GB").format(student.enrollmentDate);
  
  // Format date of birth
  const dateOfBirth = student.dateOfBirth 
    ? new Intl.DateTimeFormat("en-GB").format(student.dateOfBirth)
    : "Not provided";

  // Get current class
  const currentClass = student.classStudents[0]?.class;

  // Calculate overall progress
  const overallProgress = student.progress.length > 0
    ? Math.round(
        student.progress.reduce((sum, p) => sum + p.overallProgress, 0) / 
        student.progress.length
      )
    : 0;

  const formatGoal = (goal: string) => {
    return goal.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

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
          
          {/* A. USER INFO CARD */}
          <div className="bg-white p-6 rounded-xl shadow-2xl flex-1 flex flex-col sm:flex-row gap-6 border-l-8 border-blue-500/80 transition-shadow hover:shadow-blue-300">
            
            <div className="flex flex-col items-center sm:items-start sm:w-1/3">
              <Image
                src={student.user.avatar || "/avatar.png"}
                alt={fullName}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-200 shadow-md"
              />
            </div>
            
            <div className="flex flex-col justify-between gap-4 sm:w-2/3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-extrabold text-gray-900">{fullName}</h1>
                  {(role === "admin" || role === "institute" || role === "teacher") && (
                    <FormContainer table="student" type="update" data={student} />
                  )}
                </div>
                <p className="text-base text-blue-600 font-semibold italic">🆔 Student ID: {student.studentId}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {student.institute?.name || "Independent Student"} • Class {currentClass?.name || "N/A"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm font-medium text-gray-700 mt-3 border-t border-gray-100 pt-3">
                
                <div className="flex items-center gap-1">
                  <IconSpan>🎂</IconSpan>
                  <span title="Date of Birth">{dateOfBirth}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <IconSpan>📧</IconSpan>
                  <span className="truncate" title={student.user.email}>{student.user.email}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <IconSpan>📞</IconSpan>
                  <span>{student.user.phoneNumber || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <IconSpan className={student.user.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>🟢</IconSpan>
                  <span className={`font-semibold ${student.user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                    {student.user.status}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* B. SMALL STAT CARDS */}
          <div className="grid grid-cols-2 gap-4 lg:w-2/5">
            
            {/* CARD - Attendance */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-blue-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-blue-500">📊</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Attendance</span>
              <h1 className="text-3xl font-extrabold text-blue-800">{attendancePercentage}%</h1>
            </div>

            {/* CARD - Current Class */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-purple-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-purple-500">🎓</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Current Class</span>
              <h1 className="text-3xl font-extrabold text-purple-800">{currentClass?.name || "N/A"}</h1>
            </div>

            {/* CARD - Lessons Done */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-green-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-green-500">📖</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Lessons Done</span>
              <h1 className="text-3xl font-extrabold text-green-800">{completedLessons}</h1>
            </div>

            {/* CARD - Avg Score */}
            <div className="bg-white p-5 rounded-xl shadow-md border-b-4 border-orange-500 flex flex-col justify-between transition-transform hover:scale-[1.02]">
              <IconSpan className="text-orange-500">🏆</IconSpan>
              <span className="text-sm font-medium text-gray-500 mt-2">Avg Score</span>
              <h1 className="text-3xl font-extrabold text-orange-800">{averageScore}%</h1>
            </div>
          </div>
        </div>

        {/* === 2. STUDENT INFORMATION === */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Student Information</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">#</IconSpan> Student ID</span>
              <span className="text-sm font-medium text-gray-800">{student.studentId}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">🏛️</IconSpan> Institute</span>
              <span className="text-sm font-medium text-gray-800">{student.institute?.name || "Independent"}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">🎓</IconSpan> Current Class</span>
              <span className="text-sm font-medium text-gray-800">
                {currentClass ? `${currentClass.name} (${currentClass.grade.replace("GRADE_", "Grade ")})` : "Not assigned"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">📅</IconSpan> Academic Year</span>
              <span className="text-sm font-medium text-gray-800">{currentClass?.academicYear || "N/A"}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">✅</IconSpan> Status</span>
              <span className={`text-sm font-bold ${student.user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                {student.user.status}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">📊</IconSpan> Progress</span>
              <span className="text-sm font-medium text-gray-800">{overallProgress}%</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">👤</IconSpan> Guardian</span>
              <span className="text-sm font-medium text-gray-800">{student.guardianName || "N/A"}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">📞</IconSpan> Guardian Contact</span>
              <span className="text-sm font-medium text-gray-800">{student.guardianPhone || student.guardianEmail || "N/A"}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><IconSpan className="w-3 h-3 text-gray-400">🏠</IconSpan> Address</span>
              <span className="text-sm font-medium text-gray-800">{student.address || "N/A"}</span>
            </div>
          </div>
        </div>
        
        {/* === 3. COURSES & RESULTS === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Enrolled Courses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Enrolled Courses ({student._count.enrollments})</h1>
            {student.enrollments.length > 0 ? (
              <div className="space-y-4">
                {student.enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex flex-col gap-2 p-4 bg-gray-50 hover:bg-blue-50 transition duration-200 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{enrollment.course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {enrollment.course.code} • <span className="font-medium">{enrollment.course.type}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-600">{Math.round(enrollment.progress)}%</span>
                    </div>
                  </div>
                ))}
                {student._count.enrollments > 5 && (
                  <Link 
                    href={`/list/courses?studentId=${student.id}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline mt-4 block"
                  >
                    View all {student._count.enrollments} courses →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No active course enrollments.</p>
            )}
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Recent Results ({student._count.results})</h1>
            {student.results.length > 0 ? (
              <div className="space-y-4">
                {student.results.map((result) => {
                  const gradeColor = result.grade?.startsWith('A') ? 'bg-green-100 text-green-800' :
                                     result.grade?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                     result.grade?.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                                     'bg-red-100 text-red-800';
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 transition duration-200 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{result.subjectName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {result.subjectCode} • {new Intl.DateTimeFormat("en-GB").format(result.examDate)}
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {result.marksObtained}/{result.totalMarks} ({result.percentage.toFixed(1)}%)
                        </p>
                      </div>
                      {result.grade && (
                        <span className={`text-lg font-bold px-3 py-1 rounded-lg ${gradeColor}`}>
                          {result.grade}
                        </span>
                      )}
                    </div>
                  );
                })}
                {student._count.results > 5 && (
                  <Link 
                    href={`/list/results?studentId=${student.id}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline mt-4 block"
                  >
                    View all {student._count.results} results →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No results available yet.</p>
            )}
          </div>
        </div>

        {/* === 4. ACTIVITY STATISTICS === */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Activity Statistics</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="text-center p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-200 transition-transform hover:bg-blue-100">
              <IconSpan className="text-blue-600 mx-auto text-3xl mb-1">📝</IconSpan>
              <p className="text-3xl font-extrabold text-blue-800">{student._count.assignments}</p>
              <p className="text-sm text-gray-600">Assignments</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg shadow-inner border border-green-200 transition-transform hover:bg-green-100">
              <IconSpan className="text-green-600 mx-auto text-3xl mb-1">📄</IconSpan>
              <p className="text-3xl font-extrabold text-green-800">{student._count.examAttempts}</p>
              <p className="text-sm text-gray-600">Exams</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg shadow-inner border border-purple-200 transition-transform hover:bg-purple-100">
              <IconSpan className="text-purple-600 mx-auto text-3xl mb-1">❓</IconSpan>
              <p className="text-3xl font-extrabold text-purple-800">{student._count.quizAttempts}</p>
              <p className="text-sm text-gray-600">Quizzes</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg shadow-inner border border-orange-200 transition-transform hover:bg-orange-100">
              <IconSpan className="text-orange-600 mx-auto text-3xl mb-1">📖</IconSpan>
              <p className="text-3xl font-extrabold text-orange-800">{completedLessons}</p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>
          </div>
        </div>

        {/* --- 5. ACTIVITY HEATMAP & CALENDAR --- */}
        {/* Replace the old Statistics section if desired, or place this before/after it */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            {/* Pass the fetched recentActivities data */}
            <ActivityHeatmap
                data={recentActivities.map(item => ({
                    date: new Date(item.date), // Ensure it's a Date object
                    // Use activityScore for intensity, or sum counts
                    count: item.activityScore // Or: item.lessonsCompleted + item.quizzesAttempted + item.assignmentsSubmitted 
                }))}
                title="Daily Learning Activity"
                subtitle={`Heatmap of activities like lessons, quizzes, and assignments over the past year.`}
                colorScheme="purple"
            />
        </div>

        {/* === 6. SCHEDULE CALENDAR === */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[800px] mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT COLUMN (NARROW SIDEBAR) */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">

        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
           <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Target className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-gray-800">Learning Goals</h2>
                 </div>
              </div>
              <Trophy className="w-5 h-5 text-yellow-500" />
           </div>
           
           {student.goals && student.goals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                 {student.goals.map((goal, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1"
                    >
                       🎯 {formatGoal(goal)}
                    </span>
                 ))}
              </div>
           ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                 <p className="text-xs text-gray-500">No goals set.</p>
              </div>
           )}
        </div>
        
        {/* QUICK ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h1>
          <div className="flex gap-3 flex-wrap text-sm">
            {[
              { label: "Lessons", href: `/list/lessons?studentId=${student.id}`, bgColor: "bg-blue-50", textColor: "text-blue-700" },
              { label: "Teachers", href: `/list/teachers?studentId=${student.id}`, bgColor: "bg-purple-50", textColor: "text-purple-700" },
              { label: "Exams", href: `/list/exams?studentId=${student.id}`, bgColor: "bg-red-50", textColor: "text-red-700" },
              { label: "Assignments", href: `/list/assignments?studentId=${student.id}`, bgColor: "bg-orange-50", textColor: "text-orange-700" },
              { label: "Results", href: `/list/results?studentId=${student.id}`, bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
              { label: "Courses", href: `/list/courses?studentId=${student.id}`, bgColor: "bg-green-50", textColor: "text-green-700" },
              { label: "Attendance", href: `/list/attendance?studentId=${student.id}`, bgColor: "bg-indigo-50", textColor: "text-indigo-700" },
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