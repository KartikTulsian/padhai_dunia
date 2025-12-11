import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Table from "@/components/Table";
import Link from "next/link";
import { Prisma, Exam, Teacher, User, Course, ExamQuestion, ExamAttempt } from "@prisma/client";
import ExamDetailsModal from "@/components/ExamsDetailsModal";
import FormContainer from "@/components/FormContainer";

type ExamList = Exam & {
  teacher: Teacher & { user: User };
  course: Course;
  questions: ExamQuestion[];
  attempts: ExamAttempt[];
};

export default async function ExamListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  const columns = [
    { header: "Exam Title", accessor: "title" },
    { header: "Course", accessor: "course" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Type", accessor: "type", className: "hidden md:table-cell" },
    { header: "Scheduled", accessor: "scheduledAt", className: "hidden md:table-cell" },
  ];

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const { page, examId, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ExamWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        query.title = { contains: value, mode: "insensitive" };
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        course: true,
        teacher: { include: { user: true }},
        questions: true,
        attempts: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.exam.count({ where: query }),
  ]) as [ExamList[], number];

  const selectedExam = examId
    ? await prisma.exam.findUnique({
        where: { id: examId },
        include: {
          course: true,
          teacher: { include: { user: true }},
          questions: true,
          attempts: true,
        },
      })
    : null;

  const renderRow = (item: ExamList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] transition-colors">
      <td className="p-4 font-semibold">
        <Link href={`?examId=${item.id}&page=${p}`} className="hover:underline">
          {item.title}
        </Link>
      </td>
      <td>{item.course.title}</td>
      <td className="hidden md:table-cell">
        {item.teacher.user.firstName} {item.teacher.user.lastName}
      </td>
      <td className="hidden md:table-cell">{item.type.replace("_", " ")}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(item.scheduledAt)}
      </td>
      {/* <td className="flex gap-2 items-center">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="exam" type="update" data={item} />
            <FormContainer table="exam" type="delete" id={item.id} />
          </>
        )}
      </td> */}
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">
          {role === "admin" ? "All Exams" : role === "teacher" ? "Your Exams" : "Exams"}
        </h1>

        <div className="flex items-center gap-4">
          <TableSearch />

          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="filter" width={14} height={14} />
          </button>

          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="sort" width={14} height={14} />
          </button>

          {(role === "admin" || role === "teacher") && (
            <FormContainer table="exam" type="create" />
          )}
        </div>
      </div>

      {/* Table */}
      {data.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={data} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xl font-semibold text-gray-700">No exams found</p>
          <p className="text-sm text-gray-500">Try searching by name</p>
        </div>
      )}

      <Pagination page={p} count={count} />

      {selectedExam && (
        <ExamDetailsModal
          exam={selectedExam as ExamList}
          onCloseUrl={`/list/exams?page=${p}`}
        />
      )}

    </div>
  );
}
