import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { ClassTeacher, CourseTeacher, Institute, Prisma, Teacher, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes } from "react";

type TeacherList = Teacher & {
  user: User
  institute: Institute
  courses: CourseTeacher[]
  classes: ClassTeacher[]
}

const IconSpan = ({ children, className = "text-gray-500", ...props }: { children: React.ReactNode, className?: string } & HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={`w-4 h-4 text-center text-sm font-semibold flex items-center justify-center ${className}`}
    {...props} // Spread all extra props (like title) onto the span element
  >
    {children}
  </span>
);

export default async function TeacherListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  // const { sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Teacher Info", accessor: "info" },
    { header: "Qualification", accessor: "qualification", className: "hidden sm:table-cell" },
    { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Experience", accessor: "experience", className: "hidden lg:table-cell" },
    { header: "Institute", accessor: "institute", className: "hidden xl:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: TeacherList) => {
    // Determine the user status color for quick visibility
    const statusColor = item.user?.status === 'ACTIVE' ? 'text-green-500' :
      item.user?.status === 'SUSPENDED' ? 'text-red-500' : 'text-orange-500';

    return (
      <tr
        key={item.id}
        className="border-b border-gray-100 transition-colors duration-150 ease-in-out hover:bg-indigo-50/50"
      >
        {/* Teacher Info */}
        <td className="flex items-center gap-4 p-4 text-gray-800">
          <Image
            src={item.user?.avatar || '/avatar.png'}
            alt={item.user?.firstName || 'Teacher'}
            width={40}
            height={40}
            // Adjusted className for better responsiveness and consistency
            className="hidden sm:block w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-base">
              {item.user?.firstName || 'N/A'} {item.user?.lastName || 'Teacher'}
            </h3>
            <p className="text-xs text-gray-500">{item.user?.email}</p>
          </div>
        </td>

        {/* Qualification */}
        <td className="hidden sm:table-cell text-gray-600 text-sm">
          {item.qualification || 'N/A'}
        </td>

        {/* Subjects */}
        <td className="hidden md:table-cell text-gray-600">
          <div className="flex flex-wrap gap-1">
            {/* Safely join subjects, providing fallback for null/undefined */}
            <span className="text-sm font-medium line-clamp-2 w-48">
              {(item.subjects ?? []).join(", ") || "No subjects listed"}
            </span>
          </div>
        </td>

        {/* Experience */}
        <td className="hidden lg:table-cell text-gray-600">
          <div className="flex items-center gap-2">
            <IconSpan className="text-orange-500">🏆</IconSpan>
            <span className="text-sm">{item.experience ?? 0} Yrs</span>
          </div>
        </td>

        {/* Institute */}
        <td className="hidden xl:table-cell text-gray-600">
          <div className="flex items-center gap-2">
            <IconSpan className="text-purple-500">🏛️</IconSpan>
            <span className="text-sm font-medium">{item.institute?.name || "Platform Teacher"}</span>
          </div>
        </td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-3">
            {/* View/Details Button (Styled with clean colors/icons) */}
            <Link href={`/list/teachersInfo/${item.id}`}>

              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA]">

                <Image src="/view.png" alt="" width={16} height={16} />

              </button>

            </Link>

            {/* Delete Button (Admin only) */}
            {role === "admin" && (
              <FormModal table="teacher" type="delete" id={item.id} />
            )}

            {/* Status Indicator (Quick Glance) */}
            <IconSpan className={`hidden sm:flex ${statusColor}`} title={`Status: ${item.user?.status || 'N/A'}`}>
              {item.user?.status === 'ACTIVE' ? '✅' : '🔴'}
            </IconSpan>
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { user: { firstName: { contains: value, mode: "insensitive" } } },
              { user: { lastName: { contains: value, mode: "insensitive" } } },
              { user: { email: { contains: value, mode: "insensitive" } } },
            ];
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        user: true,
        institute: true,
        courses: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { joinDate: 'desc' },
    }),
    prisma.teacher.count({ where: query }),
  ]) as [TeacherList[], number];

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg flex-1 m-4 md:m-6 mt-0">

      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Teachers ({count})</h1>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
          <TableSearch />

          {/* Utility Buttons (Filter/Sort) */}
          <button title="Filter" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <IconSpan className="text-gray-600">🔎</IconSpan>
          </button>
          <button title="Sort" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <IconSpan className="text-gray-600">⇵</IconSpan>
          </button>

          {/* Create Button (Admin only) */}
          {role === "admin" &&
            <FormModal table="teacher" type="create" />
          }
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      {data.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={data} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xl font-medium text-gray-600">No teachers found.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters.</p>
        </div>
      )}

      {/* --- PAGINATION --- */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};