import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { Course, CourseEnrollment, CourseTeacher, Institute, Prisma, Teacher, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Table from "@/components/Table";
import Link from "next/link";
import AppLink from "@/components/AppLink";
import FormContainer from "@/components/FormContainer";

type CourseList = Course & {
  enrollments: CourseEnrollment[];
  teachers: (CourseTeacher & { teacher: Teacher & { user: User } })[];
  institute: Institute | null;
};

// Define a type for your tabs
type TabItem = {
  id: string;
  label: string;
};

export default async function CourseListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const { page, tab, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const currentTab = tab || "my_courses"; // Default tab

  let studentGoals: string[] = [];
  if (role === "student" && currentUserId) {
      const studentProfile = await prisma.student.findUnique({
          where: { userId: currentUserId },
          select: { goals: true }
      });
      if (studentProfile?.goals) {
          studentGoals = studentProfile.goals; // e.g. ["JEE_PREPARATION", "ENGINEERING"]
      }
  }

  // --- QUERY BUILDER ---
  const query: Prisma.CourseWhereInput = {};

  // 1. Search Logic
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "title":
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }

  // 2. Tab & Role Logic
  if (role === "student") {
    if (currentTab === "my_courses") {
      // Tab: Enrolled Courses
      query.enrollments = {
        some: {
          student: { userId: currentUserId! },
        },
      };
    } else if (currentTab === "recommended") {
      // Tab: Recommended (Based on Goals) 
      query.isPublic = true;
      if (studentGoals.length > 0) {
          // Filter courses where targetAudience has at least one matching goal
          query.targetAudience = {
              hasSome: studentGoals as any // Casting for Prisma enum compatibility
          };
      }
    } else {
      // Tab: All Courses
      query.isPublic = true;
    }
  } else if (role === "teacher") {
    if (currentTab === "my_courses") {
      // Tab 1: Allotted Courses
      query.teachers = {
        some: {
          teacher: {
            userId: currentUserId!,
          },
        },
      };
    } 
    // Tab 2: All Courses (No extra filter needed beyond search)
  } else if (role === "institute") {
    if (currentTab === "my_courses") {
        // Tab 1: Created by Institute
        query.institute = {
            admins: {
                some: {
                    userId: currentUserId!
                }
            }
        };
    }
    // Tab 2: All Courses
  }

  // 3. Fetch Data
  const [data, count] = await prisma.$transaction([
    prisma.course.findMany({
      where: query,
      include: {
        enrollments: true,
        institute: true,
        teachers: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where: query }),
  ]);

  // --- UI HELPERS ---
  const columns = [
    { header: "Course Name", accessor: "title" },
    { header: "Code", accessor: "code", className: "hidden md:table-cell" },
    { header: "Type", accessor: "type", className: "hidden md:table-cell" },
    { header: "Institute", accessor: "institute", className: "hidden lg:table-cell" },
    { header: "Level", accessor: "level", className: "hidden lg:table-cell" },
    { header: "Price", accessor: "price", className: "hidden xl:table-cell" },
    ...(role === "admin" || role === "institute"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: CourseList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50 transition-colors"
    >
      <td className="p-4 flex items-center gap-4">
          <div className="flex flex-col">
            <Link href={`/list/courses/${item.id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                {item.title}
            </Link>
            <span className="text-xs text-gray-500 md:hidden">{item.code}</span>
          </div>
      </td>
      <td className="hidden md:table-cell text-gray-600 font-mono text-xs">{item.code}</td>
      <td className="hidden md:table-cell">
          <span className={`px-2 py-1 rounded text-xs font-semibold 
            ${item.type === 'FREE' ? 'bg-green-100 text-green-700' : 
              item.type === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
            {item.type.replace("_", " ")}
          </span>
      </td>
      <td className="hidden lg:table-cell text-gray-600">{item.institute?.name || "Platform"}</td>
      <td className="hidden lg:table-cell text-gray-600 capitalize">{item.level.toLowerCase()}</td>
      <td className="hidden xl:table-cell font-medium text-gray-700">
        {item.price === 0 ? "Free" : `${item.currency} ${item.price}`}
      </td>
      {(role === "admin" || role === "institute") && (
      <td>
        <div className="flex items-center gap-2">
          {/* <AppLink href={`/list/courses/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100 hover:bg-sky-200 transition text-sky-600">
              <Image src="/view.png" alt="View" width={14} height={14} />
            </button>
          </AppLink> */}
          
             <FormContainer table="course" type="delete" id={item.id} />
          
        </div>
      </td>
      )}
    </tr>
  );

  // --- TABS DEFINITION ---
  // Explicitly type the tabs array
  let tabs: TabItem[] = [];

  if (role === "student") {
      tabs = [
          { id: "my_courses", label: "Enrolled Courses" },
          { id: "all_courses", label: "All Courses" }
      ];
  } else if (role === "teacher") {
      tabs = [
          { id: "my_courses", label: "My Allotted Courses" },
          { id: "all_courses", label: "All Platform Courses" }
      ];
  } else if (role === "institute") {
      tabs = [
          { id: "my_courses", label: "Created Courses" },
          { id: "all_courses", label: "Platform Library" }
      ];
  } else {
      // Admin gets no tabs, just a title
  }

  return (
    <div className="bg-white p-4 rounded-xl flex-1 m-4 mt-0 shadow-sm border border-gray-100 h-full flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        
        {/* TABS or TITLE */}
        <div className="flex items-center gap-4">
            {role !== "admin" ? (
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {tabs.map((t) => (
                        <Link
                            key={t.id}
                            href={`/list/courses?tab=${t.id}`}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                currentTab === t.id 
                                    ? "bg-white text-blue-600 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {t.label}
                        </Link>
                    ))}
                </div>
            ) : (
                <h1 className="text-xl font-bold text-gray-800">All Courses</h1>
            )}
        </div>

        {/* SEARCH & ACTIONS */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <TableSearch />
          
          <div className="flex items-center gap-3 self-end md:self-auto">
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 transition">
                <Image src="/filter.png" alt="" width={16} height={16} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 transition">
                <Image src="/sort.png" alt="" width={16} height={16} />
              </button>
              
              {(role === "admin" || role === "institute" || role === "teacher") && (
                <FormContainer table="course" type="create" />
              )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1">
          {data.length > 0 ? (
            <Table columns={columns} renderRow={renderRow} data={data} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-2xl">📚</div>
                <h3 className="text-gray-900 font-semibold">No Courses Found</h3>
                <p className="text-gray-500 text-sm mt-1">
                    {currentTab === 'my_courses' 
                        ? "You haven't enrolled in or created any courses yet." 
                        : "Try adjusting your search criteria."}
                </p>
            </div>
          )}
      </div>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}