import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth, currentUser } from "@clerk/nextjs/server";
import Table from "@/components/Table";
import Link from "next/link";
import { Prisma, Assignment, Teacher, User, Course, AssignmentSubmission, Student } from "@prisma/client";
import AssignmentsDetailsModal from "@/components/AssignmentsDetailsModal";
import FormContainer from "@/components/FormContainer";

type AssignmentList = Assignment & {
  teacher: Teacher & { user: User };
  course: Course;
  submissions: AssignmentSubmission[];
};

export default async function AssignmentListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Course", accessor: "course" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
    { header: "Submitted", accessor: "submitted" },
    { header: "Pending", accessor: "pending" },
    { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  ];

  const { page, assignmentId, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  // MAIN QUERY BUILDER
  const query: Prisma.AssignmentWhereInput = {};

  if (queryParams.search) {
    query.title = { contains: queryParams.search, mode: "insensitive" };
  }

  // ROLE-BASED FILTERING
  // ROLE-BASED FILTERING
  if (role === "teacher" && userId) {
    query.teacherId = userId;
  }

  if (role === "student" && userId) {
    const studentEnrollments = await prisma.courseEnrollment.findMany({
      where: { studentId: userId },
      select: { courseId: true },
    });

    const enrolledCourseIds = studentEnrollments.map(e => e.courseId);

    if (enrolledCourseIds.length > 0) {
      query.courseId = { in: enrolledCourseIds };
    }
  }


  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        course: true,
        teacher: { include: { user: true } },
        submissions: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { dueDate: "asc" },
    }),
    prisma.assignment.count({ where: query }),
  ]) as [AssignmentList[], number];

  const selectedAssignment = assignmentId
    ? await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
        teacher: { include: { user: true } },
        submissions: { include: { student: { include: { user: true } } } },
      },
    })
    : null;

  // const today = new Date();

  // Filter lists based on status
  const ongoingAssignments = data.filter(
    a => a.status === "PUBLISHED" || a.status === "CLOSED"
  );

  const upcomingAssignments = data.filter(
    a => a.status === "DRAFT" && (role === "admin" || role === "teacher" || role === "institute")
  );


  const renderRow = (item: AssignmentList) => {
    const submitted = item.submissions?.filter(s => s.status === "SUBMITTED" || s.status === "GRADED").length ?? 0;
    const pending = item.submissions?.filter(s => s.status === "PENDING").length ?? 0;

    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] transition">
        <td className="p-4 font-medium">
          <Link href={`?assignmentId=${item.id}&page=${p}`} className="hover:underline">
            {item.title}
          </Link>
        </td>
        <td>{item.course.title}</td>
        <td className="hidden md:table-cell">
          {item.teacher.user.firstName} {item.teacher.user.lastName}
        </td>
        <td className="hidden md:table-cell">
          {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(item.dueDate)}
        </td>
        <td>{submitted}</td>
        <td>{pending}</td>
        <td className="hidden md:table-cell">{item.status}</td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">Assignments</h1>
        <div className="flex items-center gap-4">
          <TableSearch />
          {(role === "admin" || role === "teacher") && (
            <FormContainer table="assignment" type="create" />
          )}
        </div>
      </div>

      {/* ONGOING */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Ongoing Assignments</h2>
      <Table columns={columns} renderRow={renderRow} data={ongoingAssignments} />
      <Pagination page={p} count={count} />

      {/* UPCOMING */}
      {(role === "admin" || role === "teacher" || role === "institute") && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-2">Upcoming Assignments (Drafts)</h2>
          <Table columns={columns} renderRow={renderRow} data={upcomingAssignments} />
          <Pagination page={p} count={count} />
        </>
      )}


      {selectedAssignment && (
        <AssignmentsDetailsModal
          assignment={selectedAssignment}
          onCloseUrl={`/list/assignments?page=${p}`}
        />
      )}
    </div>
  );
}
