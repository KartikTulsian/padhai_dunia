import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  Calendar, BookOpen, GraduationCap, MapPin, Phone, Mail, Clock,
  Shield, CalendarDays, Building2, Activity,
  Target,
  Trophy
} from "lucide-react";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";

const StudentPage = async () => {
  const { userId } = await auth();

  // 1. Fetch Complete Student Data
  const student = await prisma.student.findUnique({
    where: { userId: userId! },
    include: {
      user: true,
      institute: true,
      classStudents: { include: { class: true } },
    },
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm max-w-md">
          <h2 className="font-bold text-xl mb-2">Profile Not Found</h2>
          <p className="text-sm">We couldn't retrieve your student profile. Please contact support.</p>
        </div>
      </div>
    );
  }

  // 2. Fetch Activity Data for Heatmap
  const recentActivities = await prisma.dailyActivity.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' },
    take: 365,
  });

  // Helper for dates
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatGoal = (goal: string) => {
    return goal.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Reusable Info Card
  const InfoCard = ({ icon: Icon, label, value, subValue }: any) => (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-500 hover:border-blue-400 hover:shadow-md transition-all duration-200 group h-full">
      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{label}</span>
        <span className="text-sm font-semibold text-gray-900 truncate" title={value || ""}>{value || "N/A"}</span>
        {subValue && <span className="text-xs text-gray-500 truncate mt-0.5">{subValue}</span>}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 flex flex-col gap-8 bg-gray-50/50 min-h-screen">

      {/* --- 1. PROFILE HEADER SECTION (Fixed Height / No Shrink) --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative shrink-0">
        {/* Banner */}
        <div className="h-32 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white/20 to-transparent"></div>
        </div>

        <div className="px-4 md:px-8 pb-8 pt-4">
          {/* Profile Section */}
          <div className="flex flex-col lg:flex-row gap-6 -mt-20 relative z-10">

            {/* Avatar & Identity */}
            <div className="flex flex-col items-center lg:items-start gap-4 lg:w-80 shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden relative bg-gray-100">
                  <Image
                    src={student.user.avatar || "/avatar.png"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-7 h-7 rounded-full border-4 border-white shadow-lg" title="Active"></div>
              </div>

              <div className="text-center lg:text-left w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                  {student.user.firstName} {student.user.lastName}
                </h1>

                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5" /> Student
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-mono border border-gray-300">
                    ID: {student.studentId}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4 justify-center lg:justify-start">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{student.institute?.name || "No Institute"}</span>
                </div>

                <div className="flex justify-center lg:justify-start">
                  <FormContainer table="student" type="update" data={student} />
                </div>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 lg:mt-0">
              <InfoCard icon={Mail} label="Email Address" value={student.user.email} />
              <InfoCard icon={Phone} label="Phone Number" value={student.user.phoneNumber} />
              <InfoCard icon={MapPin} label="Home Address" value={student.address} />
              <InfoCard icon={CalendarDays} label="Date of Birth" value={formatDate(student.dateOfBirth)} />
              <InfoCard
                icon={BookOpen}
                label="Current Class"
                value={student.classStudents[0]?.class?.name || "Not Assigned"}
                subValue={`Enrolled: ${formatDate(student.enrollmentDate)}`}
              />
              <InfoCard
                icon={Shield}
                label="Guardian Contact"
                value={student.guardianName || "N/A"}
                subValue={student.guardianPhone || student.guardianEmail || "No contact info"}
              />
            </div>
          </div>
        </div>
      </div>
      {/* --- 2. MAIN DASHBOARD CONTENT --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN: ACTIVITY & SCHEDULE (Takes 2/3 space) */}
        <div className="xl:col-span-2 flex flex-col gap-6 min-w-0">

          {/* ACTIVITY HEATMAP */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Learning Activity</h2>
                <p className="text-xs text-gray-500">Your contributions over the last year</p>
              </div>
            </div>

            {/* Heatmap Container */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[600px]">
                <ActivityHeatmap
                  data={recentActivities.map(item => ({
                    date: new Date(item.date),
                    count: item.activityScore
                  }))}
                  colorScheme="purple"
                />
              </div>
            </div>
          </div>

          {/* WEEKLY SCHEDULE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Weekly Schedule</h2>
                  <p className="text-xs text-gray-500 font-medium">Your classes and timing</p>
                </div>
              </div>
              {student.classStudents[0]?.class?.name && (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                  {student.classStudents[0].class.name}
                </span>
              )}
            </div>

            {/* Calendar grows naturally */}
            <div className="flex-1">
              <BigCalendar id={student.id} type="student" />
            </div>

            {/* Legend Footer */}
            <div className="flex flex-wrap gap-4 mt-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-xs text-gray-600 font-medium">Lessons</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-xs text-gray-600 font-medium">Quizzes</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-xs text-gray-600 font-medium">Exams</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div><span className="text-xs text-gray-600 font-medium">Assignments</span></div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EVENTS & ANNOUNCEMENTS (Takes 1/3 space) */}
        <div className="flex flex-col gap-6 min-w-0">

          {/* --- GOALS SECTION --- */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Target className="w-5 h-5" />
                   </div>
                   <div>
                      <h2 className="text-lg font-bold text-gray-800">My Goals</h2>
                      <p className="text-xs text-gray-500">Your targets and aspirations</p>
                   </div>
                </div>
                <Trophy className="w-5 h-5 text-yellow-400" />
             </div>
             
             {student.goals && student.goals.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                   {student.goals.map((goal, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100 flex items-center gap-2 shadow-sm"
                      >
                         🎯 {formatGoal(goal)}
                      </span>
                   ))}
                </div>
             ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                   <p className="text-sm text-gray-500">No goals set yet.</p>
                   <p className="text-xs text-gray-400 mt-1">Update your profile to add learning goals!</p>
                </div>
             )}
          </div>

          {/* Announcements Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <Announcements />
          </div>

          {/* Events Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
                <p className="text-xs text-gray-500 font-medium">Don't miss out</p>
              </div>
            </div>
            <EventCalendar />
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentPage;