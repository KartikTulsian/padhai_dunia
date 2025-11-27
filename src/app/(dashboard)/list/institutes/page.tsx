import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Institute, InstituteAdmin, Prisma, Student, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes } from "react";

type InstituteList = Institute & {
  admins: InstituteAdmin[];
  students: Student[];
  teachers: Teacher[];
};

const IconSpan = ({ children, className = "text-gray-500", ...props }: { children: React.ReactNode, className?: string } & HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={`w-4 h-4 text-center text-sm font-semibold flex items-center justify-center ${className}`}
    {...props} // Spread all extra props (like title) onto the span element
  >
    {children}
  </span>
);

export default async function InstitutesListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  const columns = [
    { header: "Institute Info", accessor: "info" },
    { header: "Code", accessor: "code", className: "hidden sm:table-cell" },
    { header: "Type", accessor: "type", className: "hidden md:table-cell" },
    { header: "Students", accessor: "students", className: "hidden lg:table-cell" },
    { header: "Teachers", accessor: "teachers", className: "hidden xl:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: InstituteList) => {
    // Determine the status color
    const statusColor = item.status === 'ACTIVE' ? 'text-green-600' :
      item.status === 'SUSPENDED' ? 'text-red-600' : 
      item.status === 'PENDING_APPROVAL' ? 'text-orange-600' : 'text-gray-600';

    return (
      <tr
        key={item.id}
        className="border-b border-gray-100 transition-colors duration-150 ease-in-out hover:bg-purple-50/50"
      >
        {/* Institute Info (Name & Code) */}
        <td className="flex items-center gap-4 p-4 text-gray-800">
          <Image
            src={item.logo || '/avatar.png'} // Changed default avatar for institutes
            alt={item.name || 'Institute'}
            width={40}
            height={40}
            className="hidden sm:block w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-base">
              {item.name || 'N/A'}
            </h3>
            <p className="text-xs text-gray-500 font-mono">Code: {item.code}</p>
          </div>
        </td>
        
        {/* Code (Visible on small screens and up) */}
        <td className="hidden sm:table-cell text-gray-600 text-sm">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.code}</span>
        </td>

        {/* Type (Visible on medium screens and up) */}
        <td className="hidden md:table-cell text-gray-600">
          <div className="flex items-center gap-2">
            <IconSpan className="text-blue-500">🏢</IconSpan>
            <span className="text-sm font-medium">{item.type.replace(/_/g, ' ')}</span>
          </div>
        </td>

        {/* No. of Students (Visible on large screens and up) */}
        <td className="hidden lg:table-cell text-gray-600">
          {/* FIXED: Accessing the length of the students array */}
          <div className="flex items-center gap-2">
            <IconSpan className="text-green-500">🧑‍🎓</IconSpan>
            <span className="text-base font-semibold">{item.students.length}</span>
          </div>
        </td>

        {/* No. of Teachers (Visible on extra-large screens and up) */}
        <td className="hidden xl:table-cell text-gray-600">
          {/* FIXED: Accessing the length of the teachers array */}
          <div className="flex items-center gap-2">
            <IconSpan className="text-orange-500">👨‍🏫</IconSpan>
            <span className="text-base font-semibold">{item.teachers.length}</span>
          </div>
        </td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-3">
            {/* View/Details Button (Styled with clean colors/icons) */}
            <Link href={`/list/institutes/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA]">
                <Image src="/view.png" alt="" width={16} height={16} />
              </button>

            </Link>

            {/* Delete Button (Admin only) */}
            {role === "admin" && (
              <FormModal table="institute" type="delete" id={item.id} />
            )}

            {/* Status Indicator (Quick Glance) */}
            <IconSpan className={`hidden sm:flex ${statusColor}`} title={`Status: ${item.status || 'N/A'}`}>
              {item.status === 'ACTIVE' ? '✅' : '🔴'}
            </IconSpan>
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.InstituteWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } }, 
              { code: { contains: value, mode: "insensitive" } },
              { website: { contains: value, mode: "insensitive" } },
            ];
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.institute.findMany({
      where: query,
      include: {
        admins: true,
        students: true,
        teachers: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.institute.count({ where: query }),
  ]) as [InstituteList[], number];


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg flex-1 m-4 md:m-6 mt-0">

      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">All Institutes ({count})</h1>

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
            <FormModal table="institute" type="create" />
          }
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      {data.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={data} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xl font-medium text-gray-600">No institutes found.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters.</p>
        </div>
      )}

      {/* --- PAGINATION --- */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}
