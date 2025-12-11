import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { Course, CourseModule, Lesson, LessonProgress, Prisma, Student, Teacher, User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import LessonsDetailsModal from "@/components/LessonsDetailsModal";
import Link from "next/link";
import FormContainer from "@/components/FormContainer";

type LessonList = Lesson & {
  module: CourseModule & { course: Course };
    teacher: Teacher & { user: User };
    progress: (LessonProgress & { student: Student & { user: User } })[];
};


export default async function LessonsListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  const columns = [
    { header: "Lesson Title", accessor: "title" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Course", accessor: "course", className: "hidden md:table-cell" },
    { header: "Module", accessor: "module", className: "hidden md:table-cell" },
    { header: "Type", accessor: "type", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "actions" },
  ];

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const teacherId = (sessionClaims?.metadata as { teacherId?: string })?.teacherId;

  const { page, lessonId, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        switch (key) {
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ];
            break;
        }
      }
    }
  }

  // Role-based filtering
  if (role === "teacher" && teacherId) {
    query.teacherId = teacherId;
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        module: { include: { course: true } },
        teacher: { include: { user: true } },
        progress: { include: { student: { include: { user: true } } } },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lesson.count({ where: query }),
  ]) as [LessonList[], number];

  const selectedLesson = lessonId
    ? await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: { include: { course: true } },
          teacher: { include: { user: true } },
          progress: { include: { student: { include: { user: true } } } },
        },
      })
    : null;

  const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer transition-colors"
    >
      <td className="p-4 font-medium">
        <Link href={`?lessonId=${item.id}&page=${p}`} scroll={false} className="hover:underline">
          {item.title}
        </Link>
      </td>
      <td className="hidden md:table-cell">
        {item.teacher?.user?.firstName} {item.teacher?.user?.lastName}
      </td>
      <td className="hidden md:table-cell">{item.module.course.title}</td>
      <td className="hidden md:table-cell">{item.module.title}</td>
      <td className="hidden md:table-cell">{item.type}</td>
      <td>
        {(role === "admin" || role === "teacher") && (
          <div className="flex items-center gap-2">
            <FormContainer table="lesson" type="update" data={item} />
            {role === "admin" && <FormContainer table="lesson" type="delete" id={item.id} />}
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">Lessons Overview</h1>

        <div className="flex items-center gap-4">
          <TableSearch />

          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="" width={14} height={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="" width={14} height={14} />
          </button>

          {(role === "admin" || role === "teacher") && (
            <FormContainer table="lesson" type="create" />
          )}
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>

      {selectedLesson && (
        <LessonsDetailsModal
          details={selectedLesson as any}
          onCloseUrl={`/list/lessons?page=${p}`}
          role={role}
        />
      )}
    </div>
  );
}