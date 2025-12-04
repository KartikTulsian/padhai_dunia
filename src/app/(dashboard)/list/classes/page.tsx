import ClassesDetailsModal from "@/components/ClassesDetailsModal";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Attendance, Class, ClassCourse, ClassStudent, ClassTeacher, Event, Institute, Prisma, Student, Teacher, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ClassList = Class & {
  teachers: (ClassTeacher & { teacher: Teacher & { user: User } })[];
  students: (ClassStudent & { student: Student & { user: User } })[];
  courses: ClassCourse[];
  announcements: Announcement[];
  events: Event[];
  institute: Institute;
  attendance: Attendance[];
};

export default async function ClassListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const columns = [
    { header: "Class Name", accessor: "name" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Academic Year", accessor: "academicYear", className: "hidden md:table-cell" },
  ];

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const { page, classId, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  // Search mapping
  const query: Prisma.ClassWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        switch (key) {
          case "name":
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        teachers: { include: { teacher: { include: { user: true } } } },
        students: { include: { student: { include: { user: true } } } },
        courses: true,
        announcements: true,
        events: true,
        attendance: true,
        institute: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { name: "asc" },
    }),
    prisma.class.count({ where: query }),
  ]) as [ClassList[], number];

  const selectedClass = classId
    ? await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teachers: { include: { teacher: { include: { user: true } } } },
        students: { include: { student: { include: { user: true } } } },
        courses: true,
        announcements: true,
        events: true,
        attendance: true,
        institute: true,
      },
    })
    : null;


  // Row Renderer
  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer transition-colors"
    >
      <td className="p-4 font-medium">
        <Link href={`?classId=${item.id}&page=${p}`} scroll={false} className="hover:underline">
          {item.name}
        </Link>
      </td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">
        {item.teachers.find((t) => t.isPrimary)?.teacher?.user?.firstName ?? "N/A"}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">All Classes</h1>

        <div className="flex items-center gap-4">
          <TableSearch />

          {/* Buttons */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="filter" width={14} height={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="sort" width={14} height={14} />
          </button>

          {role === "admin" && <FormModal table="class" type="create" />}
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>

      {selectedClass && (
        <ClassesDetailsModal
          details={selectedClass as ClassList}
          onCloseUrl={`/list/classes?page=${p}`}
        />
      )}
    </div>
  );
};

