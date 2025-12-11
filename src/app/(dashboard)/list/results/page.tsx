import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Table from "@/components/Table";
import Link from "next/link";

import {
  Prisma,
  Exam,
  ExamAttempt,
  Course,
  Teacher,
  User,
  Student,
  Institute,
} from "@prisma/client";
import ResultsDetailsModal from "@/components/ResultsDetailsModal";

type ExamWithResults = Exam & {
  course: Course & { institute: Institute | null };
  teacher: Teacher & { user: User };
  attempts: (ExamAttempt & { student: Student & { user: User } })[];
};

export default async function ResultListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const { page, resultId, search } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const columns = [
    { header: "Exam", accessor: "title" },
    { header: "Course", accessor: "course" },
    { header: "Teacher", accessor: "teacher" },
    { header: "Exam Date", accessor: "examDate" },
    { header: "Published On", accessor: "publishedOn" },
    { header: "Students", accessor: "studentCount" },
    { header: "Highest Marks", accessor: "highestMarks" },
  ];

  // ---------- BUILD WHERE QUERY ----------
  const query: Prisma.ExamWhereInput = {};

  if (search) {
    query.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { course: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (role === "teacher" && currentUserId) {
    query.teacher = {
      userId: currentUserId,
    };
  }

  if (role === "student" && currentUserId) {
    query.attempts = {
      some: {
        student: { userId: currentUserId },
        isGraded: true,
      },
    };
  }

  if (role === "institute" && currentUserId) {
    query.course = {
      instituteId: currentUserId,
    };
  }

  // ---------------- FETCH RESULTS ----------------
  const [exams, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        course: { include: { institute: true } },
        teacher: { include: { user: true } },
        attempts: { include: { student: { include: { user: true } } } },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.exam.count({ where: query }),
  ]) as [ExamWithResults[], number];

  const selectedResult = resultId
    ? await prisma.exam.findUnique({
        where: { id: resultId },
        include: {
          course: { include: { institute: true } },
          teacher: { include: { user: true } },
          attempts: { include: { student: { include: { user: true } } } },
        },
      })
    : null;

  // ---------- RENDER ROW ----------
  const renderRow = (exam: ExamWithResults) => {
    const gradedAttempts = exam.attempts.filter((a) => a.isGraded);
    const highestMarks = gradedAttempts.length
      ? Math.max(...gradedAttempts.map((a) => a.marksObtained ?? 0))
      : 0;
    const studentCount = gradedAttempts.length;

    const publishTimes = gradedAttempts
      .map((a) => a.submittedAt?.getTime())
      .filter(Boolean) as number[];
    const publishedOn = publishTimes.length
      ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
          new Date(Math.max(...publishTimes))
        )
      : "-";

    return (
      <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] transition cursor-pointer">
        <td className="p-4 font-medium">
          <Link href={`?resultId=${exam.id}&page=${p}`} className="hover:underline">
            {exam.title}
          </Link>
        </td>
        <td>{exam.course.title}</td>
        <td>{exam.teacher.user.firstName} {exam.teacher.user.lastName}</td>
        <td>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(exam.scheduledAt)}</td>
        <td>{publishedOn}</td>
        <td>{studentCount}</td>
        <td>{highestMarks}</td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">
          {role === "student"
            ? "My Results"
            : role === "teacher"
            ? "Published Results"
            : "All Results"}
        </h1>

        <div className="flex items-center gap-4">
          <TableSearch />
          {(role === "admin" || role === "teacher") && <FormModal table="result" type="create" />}
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={exams} />
      <Pagination page={p} count={count} />

      {selectedResult && (
        <ResultsDetailsModal result={selectedResult} onCloseUrl={`/list/results?page=${p}`} />
      )}
    </div>
  );
}
