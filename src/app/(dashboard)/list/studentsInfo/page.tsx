import { HTMLAttributes } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Attendance, CourseEnrollment, Institute, Prisma, Student, StudentProgress, User } from "@prisma/client";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

type StudentList = Student & {
  user: User
  institute: Institute
  enrollments: CourseEnrollment[]
  attendance: Attendance[]
};

const IconSpan = ({ children, className = "text-gray-500", ...props }: { children: React.ReactNode, className?: string } & HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={`w-4 h-4 text-center text-sm font-semibold flex items-center justify-center ${className}`}
    {...props} // Spread all extra props (like title) onto the span element
  >
    {children}
  </span>
);

export default async function InstituteStudentListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {


  // const [expanded, setExpanded] = useState<number | null>(null);

  // const toggleExpand = (id: number) => {
  //   setExpanded(expanded === id ? null : id);
  // };

  // const { sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Student Info", accessor: "info" },
    { header: "ID", accessor: "studentId", className: "hidden sm:table-cell" },
    { header: "Enrollment Date", accessor: "enrollmentDate", className: "hidden lg:table-cell" },
    { header: "Institute", accessor: "institute", className: "hidden md:table-cell" },
    { header: "Contact", accessor: "guardianPhone", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions" },
  ];

  const renderRow = (item: StudentList) => {
    // Determine the color for the status based on user's status (mocked or actual)
    const statusColor = item.user?.status === 'ACTIVE' ? 'text-green-500' :
      item.user?.status === 'SUSPENDED' ? 'text-red-500' : 'text-orange-500';

    return (
      <tr
        key={item.id}
        className="border-b border-gray-100 transition-colors duration-150 ease-in-out hover:bg-indigo-50/50"
      >
        {/* Student Info */}
        <td className="flex items-center gap-4 p-4 text-gray-800">
          {/* Avatar - Fixed class name: The typo `w-ITEM_PER_PAGE` is fixed to `w-10` */}
          <Image
            src={item.user?.avatar || '/avatar.png'}
            alt={item.user?.firstName || 'Student'}
            width={40}
            height={40}
            className="hidden sm:block w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-base">
              {item.user?.firstName || 'N/A'} {item.user?.lastName || 'Student'}
            </h3>
            <p className="text-xs text-gray-500">{item.user?.email}</p>
          </div>
        </td>

        {/* Student ID */}
        <td className="hidden sm:table-cell text-gray-600">
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{item.studentId}</span>
        </td>

        {/* Enrollment Date */}
        <td className="hidden lg:table-cell text-gray-600">
          <span className="text-sm font-medium">
            {new Intl.DateTimeFormat("en-GB").format(item.enrollmentDate)}
          </span>
        </td>

        {/* Institute */}
        <td className="hidden md:table-cell text-gray-600">
          <div className="flex items-center gap-2">
            <IconSpan className="text-purple-500">🏛️</IconSpan>
            <span className="text-sm">{item.institute?.name || "Platform User"}</span>
          </div>
        </td>

        {/* Contact (Guardian Phone) */}
        <td className="hidden lg:table-cell text-gray-600">
          <div className="flex items-center gap-2">
            <IconSpan className="text-teal-500">📞</IconSpan>
            <span className="text-sm">{item.guardianPhone || "N/A"}</span>
          </div>
        </td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-3">
            {/* View/Details Button */}
            <Link href={`/list/studentsInfo/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA]">

                <Image src="/view.png" alt="" width={16} height={16} />

              </button>
            </Link>

            {/* Delete Button (Admin only) */}
            {role === "admin" && (
              <FormModal table="student" type="delete" id={item.id} />
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

  const query: Prisma.StudentWhereInput = {};

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
    prisma.student.findMany({
      where: query,
      include: {
        user: true,
        institute: true,
        enrollments: true,
        attendance: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { enrollmentDate: 'desc' },
    }),
    prisma.student.count({ where: query }),
  ]) as [StudentList[], number];

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg flex-1 m-4 md:m-6 mt-0">

      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Students ({count})</h1>

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
            <FormModal table="student" type="create" />
          }
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      {data.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={data} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xl font-medium text-gray-600">No students found.</p>
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