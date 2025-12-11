import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";
import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { 
  User, Calendar, BookOpen, Briefcase, MapPin, Phone, Mail, Clock, 
  Award, Building2, CheckCircle2, GraduationCap 
} from "lucide-react";
import Image from "next/image";

const TeacherPage = async () => {
  const { userId } = await auth();

  // 1. Fetch Complete Teacher Data
  const teacher = await prisma.teacher.findUnique({
    where: { userId: userId! },
    include: {
      user: true,
      institute: true,
      _count: {
        select: {
          courses: true,
          classes: true,
          lessons: true,
        },
      },
    },
  });

  if (!teacher) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm max-w-md">
                <h2 className="font-bold text-xl mb-2">Profile Not Found</h2>
                <p className="text-sm">We couldn't retrieve your teacher profile data.</p>
            </div>
        </div>
    );
  }

  const joinDate = new Date(teacher.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Helper for Profile Data Rows
  const ProfileInfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors group">
        <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm group-hover:shadow-md transition-all">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]" title={value}>{value || "N/A"}</span>
        </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-8 bg-gray-50/50 min-h-screen">
      
      {/* --- 1. TOP HEADER SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Welcome Banner */}
        <div className="md:col-span-2 xl:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-purple-50 via-white to-transparent pointer-events-none"></div>
            <div className="relative z-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Welcome back, {teacher.user.firstName}! 👋
                </h1>
                <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                    You have <span className="font-bold text-purple-600">{teacher._count.lessons || 0} lessons</span> scheduled for this week. 
                    Manage your curriculum and student interactions efficiently.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100 uppercase tracking-wider">
                        <Building2 className="w-3.5 h-3.5" /> {teacher.institute?.name || "Platform Teacher"}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 uppercase tracking-wider">
                        <GraduationCap className="w-3.5 h-3.5" /> {teacher.qualification || "Instructor"}
                    </span>
                </div>
            </div>
        </div>

        {/* Experience Stat Card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12"><Award className="w-32 h-32" /></div>
            <div className="flex justify-between items-start relative z-10">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner"><Briefcase className="w-6 h-6 text-white" /></div>
            </div>
            <div className="relative z-10">
                <h2 className="text-5xl font-extrabold mt-4 tracking-tight">{teacher.experience || 0}<span className="text-xl font-medium text-white/80 ml-1">yrs</span></h2>
                <p className="text-xs text-white/80 mt-1 font-medium uppercase tracking-wide">Teaching Experience</p>
            </div>
        </div>

      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* --- LEFT COLUMN: PROFILE & SCHEDULE (2/3 Width) --- */}
        <div className="w-full xl:w-2/3 flex flex-col gap-8">
            
            {/* 2. PROFILE DETAILS CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
                {/* Decorative Header */}
                <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800"></div>
                
                <div className="px-8 pb-8">
                    <div className="flex flex-col sm:flex-row gap-6 -mt-12 relative z-10">
                        {/* Avatar */}
                        <div className="relative shrink-0 mx-auto sm:mx-0">
                            <div className="w-32 h-32 rounded-full border-[5px] border-white shadow-lg bg-white overflow-hidden">
                                <Image 
                                    src={teacher.user.avatar || "/avatar.png"} 
                                    alt="Profile" 
                                    fill
                                    className="object-cover rounded-2xl border-cyan-400 border-4"
                                />
                            </div>
                            {teacher.isVerified && (
                                <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Teacher">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Name & Actions */}
                        <div className="flex-1 pt-14 sm:pt-12 text-center sm:text-left">
                             <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mt-2">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{teacher.user.firstName} {teacher.user.lastName}</h1>
                                    <p className="text-sm text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                                        <Mail className="w-3.5 h-3.5" /> {teacher.user.email}
                                    </p>
                                </div>
                                <div className="mx-auto sm:mx-0">
                                    <FormContainer table="teacher" type="update" data={teacher} />
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <ProfileInfoItem icon={Briefcase} label="Employee ID" value={teacher.teacherId} />
                        <ProfileInfoItem icon={BookOpen} label="Subjects" value={teacher.subjects.join(", ")} />
                        <ProfileInfoItem icon={Phone} label="Contact" value={teacher.user.phoneNumber} />
                        <ProfileInfoItem icon={Calendar} label="Joined" value={joinDate} />
                    </div>

                    {/* Bio Section */}
                    {teacher.bio && (
                        <div className="mt-6 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <User className="w-3 h-3" /> About Me
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                "{teacher.bio}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. WEEKLY SCHEDULE */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 h-[700px] flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Class Schedule</h2>
                            <p className="text-xs text-gray-500 font-medium">Manage your teaching hours</p>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Lessons</span>
                    </div>
                </div>
                
                <div className="flex-1 relative">
                    <BigCalendar id={teacher.id} type="teacher" />
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN (Smaller 1/3): Widgets --- */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6">
            
            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
                        <p className="text-xs text-gray-500 font-medium">Don't miss out</p>
                    </div>
                </div>
                <EventCalendar />
            </div>

            {/* Announcements */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex-1">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Notice Board</h2>
                    <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View All</span>
                </div>
                <Announcements />
            </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherPage;