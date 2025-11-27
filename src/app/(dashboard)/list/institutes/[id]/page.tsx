import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import Performance from "@/components/Performance";
import FormModal from "@/components/FormModal";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SingleInstitutePage(props: { params: { id: string } }) {
  const { id } = await props.params;

  // Fetch institute with all related data
  const institute = await prisma.institute.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          admins: true,
          students: true,
          teachers: true,
          classes: true,
          courses: true,
          announcements: true,
          events: true,
        },
      },
      admins: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              status: true,
            },
          },
        },
        take: 5,
      },
      students: {
        include: {
          user: {
            select: {
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      teachers: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              status: true,
            },
          },
        },
        take: 5,
      },
      courses: {
        include: {
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        where: {
          status: 'PUBLISHED',
        },
        take: 5,
      },
    },
  });

  if (!institute) {
    return notFound();
  }

  // Calculate statistics
  const activeStudents = await prisma.student.count({
    where: {
      instituteId: institute.id,
      user: {
        status: 'ACTIVE',
      },
    },
  });

  const activeTeachers = await prisma.teacher.count({
    where: {
      instituteId: institute.id,
      user: {
        status: 'ACTIVE',
      },
    },
  });

  // Get new students in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newStudentsCount = await prisma.student.count({
    where: {
      instituteId: institute.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  const newTeachersCount = await prisma.teacher.count({
    where: {
      instituteId: institute.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Get total enrollments across all institute courses
  const totalEnrollments = await prisma.courseEnrollment.count({
    where: {
      course: {
        instituteId: institute.id,
      },
    },
  });

  // Calculate revenue (mock - implement actual logic)
  const totalRevenue = await prisma.courseEnrollment.aggregate({
    where: {
      course: {
        instituteId: institute.id,
      },
      amountPaid: {
        not: null,
      },
    },
    _sum: {
      amountPaid: true,
    },
  });

  // Get daily activity data for last 52 weeks
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  // Get daily student registrations for activity chart
  const dailyRegistrations = await prisma.student.groupBy({
    by: ['createdAt'],
    where: {
      instituteId: institute.id,
      createdAt: {
        gte: oneYearAgo,
      },
    },
    _count: true,
  });

  // Create activity map for last 365 days
  const activityMap = new Map();
  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    activityMap.set(dateKey, 0);
  }

  // Fill in actual registration counts
  dailyRegistrations.forEach((reg) => {
    const dateKey = new Date(reg.createdAt).toISOString().split('T')[0];
    if (activityMap.has(dateKey)) {
      activityMap.set(dateKey, activityMap.get(dateKey) + reg._count);
    }
  });

  // Convert to array for rendering
  const activityData = Array.from(activityMap.entries())
    .reverse()
    .map(([date, count]) => ({ date, count }));

  // Calculate activation rate
  const activationRate = institute._count.students > 0
    ? Math.round((activeStudents / institute._count.students) * 100)
    : 0;

  const IconSpan = ({ children, className = "text-blue-500" }: { children: React.ReactNode, className?: string }) => (
    <span className={`w-5 h-5 flex items-center justify-center ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-6 xl:flex-row bg-gray-50 min-h-screen">
      
      {/* LEFT COLUMN */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        
        {/* === 1. INSTITUTE HEADER === */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border-l-8 border-indigo-500/80">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center sm:items-start sm:w-1/4">
              <Image
                src={institute.logo || "/institute.png"}
                alt={institute.name}
                width={120}
                height={120}
                className="w-32 h-32 rounded-xl object-cover ring-4 ring-indigo-200 shadow-md"
              />
              <div className="mt-4 flex flex-col gap-1 w-full">
                <span className={`text-xs font-bold px-3 py-1 rounded-full text-center ${
                  institute.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  institute.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {institute.status}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col justify-between gap-4 sm:w-3/4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900">{institute.name}</h1>
                  {role === "admin" && (
                    <FormModal table="institute" type="update" data={institute} />
                  )}
                </div>
                <p className="text-base text-indigo-600 font-semibold">
                  {institute.type.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {institute.description || "No description available"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm font-medium text-gray-700 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1">
                  <IconSpan>🆔</IconSpan>
                  <span className="text-xs">{institute.code}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconSpan>📧</IconSpan>
                  <span className="text-xs truncate">{institute.contactEmail}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconSpan>📞</IconSpan>
                  <span className="text-xs">{institute.contactPhone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconSpan>🌐</IconSpan>
                  <span className="text-xs truncate">{institute.website || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconSpan>📍</IconSpan>
                  <span className="text-xs">{institute.city}, {institute.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconSpan>🗓️</IconSpan>
                  <span className="text-xs">{new Intl.DateTimeFormat("en-GB").format(institute.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === 2. KEY METRICS === */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon="👥"
            label="Total Students"
            value={institute._count.students}
            subValue={`${activeStudents} active`}
            color="blue"
          />
          <MetricCard
            icon="👨‍🏫"
            label="Total Teachers"
            value={institute._count.teachers}
            subValue={`${activeTeachers} active`}
            color="purple"
          />
          <MetricCard
            icon="🎓"
            label="Total Classes"
            value={institute._count.classes}
            subValue={`${institute._count.courses} courses`}
            color="green"
          />
          <MetricCard
            icon="💰"
            label="Total Revenue"
            value={`₹${(totalRevenue._sum.amountPaid || 0).toLocaleString()}`}
            subValue={`${totalEnrollments} enrollments`}
            color="orange"
          />
        </div>

        {/* === 3. GROWTH METRICS === */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
            Growth Metrics (Last 30 Days)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GrowthCard
              icon="📈"
              label="New Students"
              value={newStudentsCount}
              color="blue"
            />
            <GrowthCard
              icon="👨‍🏫"
              label="New Teachers"
              value={newTeachersCount}
              color="purple"
            />
            <GrowthCard
              icon="✅"
              label="Activation Rate"
              value={`${activationRate}%`}
              color="green"
            />
            <GrowthCard
              icon="📊"
              label="Avg Attendance"
              value="87%"
              color="orange"
            />
          </div>
        </div>

        {/* === 4. GITHUB-STYLE ACTIVITY CHART === */}
        <ActivityHeatmap
          data={activityData.map(item => ({
            date: new Date(item.date),
            count: item.count
          }))}
          title="Student Registrations"
          subtitle={`${dailyRegistrations.length} registrations in the last year`}
          colorScheme="green"
        />

        {/* === 5. ADMINS & TEACHERS === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Institute Admins */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
              Institute Admins ({institute._count.admins})
            </h3>
            {institute.admins.length > 0 ? (
              <div className="space-y-3">
                {institute.admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
                  >
                    <Image
                      src={admin.user.avatar || "/avatar.png"}
                      alt={admin.user.firstName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {admin.user.firstName} {admin.user.lastName}
                        {admin.isCreator && (
                          <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            Creator
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{admin.user.email}</p>
                    </div>
                    <span className={`text-xs font-bold ${
                      admin.user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {admin.user.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No admins assigned</p>
            )}
          </div>

          {/* Top Teachers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
              Teachers ({institute._count.teachers})
            </h3>
            {institute.teachers.length > 0 ? (
              <div className="space-y-3">
                {institute.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition"
                  >
                    <Image
                      src={teacher.user.avatar || "/avatar.png"}
                      alt={teacher.user.firstName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {teacher.user.firstName} {teacher.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {teacher.subjects.slice(0, 2).join(", ")}
                      </p>
                    </div>
                    <span className={`text-xs font-bold ${
                      teacher.user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {teacher.user.status}
                    </span>
                  </div>
                ))}
                {institute._count.teachers > 5 && (
                  <Link
                    href={`/list/teachers?instituteId=${institute.id}`}
                    className="text-sm font-bold text-indigo-600 hover:underline block text-center"
                  >
                    View all {institute._count.teachers} teachers →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No teachers assigned</p>
            )}
          </div>
        </div>

        {/* === 6. PUBLISHED COURSES === */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
            Published Courses ({institute._count.courses})
          </h3>
          {institute.courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {institute.courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-gray-800">{course.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {course.code} • {course.type}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-700">
                      👥 {course._count.enrollments} students
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      course.level === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                      course.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No published courses</p>
          )}
        </div>

        {/* === 7. SCHEDULE CALENDAR === */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[600px]">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
            Institute Schedule
          </h2>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex gap-3 flex-wrap text-sm">
            {[
              { label: "Students", href: `/list/students?instituteId=${institute.id}`, color: "blue" },
              { label: "Teachers", href: `/list/teachers?instituteId=${institute.id}`, color: "purple" },
              { label: "Classes", href: `/list/classes?instituteId=${institute.id}`, color: "green" },
              { label: "Courses", href: `/list/courses?instituteId=${institute.id}`, color: "orange" },
              { label: "Announcements", href: `/list/announcements?instituteId=${institute.id}`, color: "red" },
              { label: "Events", href: `/list/events?instituteId=${institute.id}`, color: "indigo" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`px-4 py-2 rounded-lg bg-${item.color}-50 text-${item.color}-700 font-semibold hover:bg-${item.color}-100 transition shadow-sm`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Performance */}
        <Performance />

        {/* Announcements */}
        <Announcements />
      </div>
    </div>
  );
}

// Metric Card Component
const MetricCard = ({
  icon,
  label,
  value,
  subValue,
  color
}: {
  icon: string;
  label: string;
  value: string | number;
  subValue: string;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-500",
    purple: "bg-purple-50 border-purple-500",
    green: "bg-green-50 border-green-500",
    orange: "bg-orange-50 border-orange-500",
  };

  return (
    <div className={`${colorClasses[color]} border-b-4 p-5 rounded-xl shadow-md hover:scale-105 transition-transform`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
      <p className="text-xs text-gray-600 mt-1">{subValue}</p>
    </div>
  );
};

// Growth Card Component
const GrowthCard = ({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg text-center hover:scale-105 transition-transform`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-extrabold">{value}</h4>
    </div>
  );
};