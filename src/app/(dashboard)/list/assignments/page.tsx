"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { assignmentsData, role } from "@/lib/data";
import Image from "next/image";

type Assignment = {
  id: number;
  subject: string;
  subjectCode: string;
  class: string;
  teacher: string;
  startDate: string;
  dueDate: string;
  submitted: number;
  totalStudents: number;
};

// Mock teacher and student data (replace with real user data later)
const currentTeacher = "Mr. Sharma";
const currentStudentClass = "10A";

// Table columns
const columns = [
  { header: "Subject", accessor: "subject" },
  { header: "Subject Code", accessor: "subjectCode" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Start Date", accessor: "startDate" },
  { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
  { header: "Submitted", accessor: "submitted" },
  { header: "Pending", accessor: "pending" },
  { header: "Actions", accessor: "action" },
];

const AssignmentListPage = () => {
  // Helper: role-based filter
  const getVisibleAssignments = () => {
    if (role === "admin") return assignmentsData;
    if (role === "teacher")
      return assignmentsData.filter((a) => a.teacher === currentTeacher);
    if (role === "student")
      return assignmentsData.filter((a) => a.class === currentStudentClass);
    return [];
  };

  // Filtered assignments
  const visibleAssignments = getVisibleAssignments();

  // Time-based filters
  const isOngoing = (assignment: Assignment) => {
    const today = new Date();
    const start = new Date(assignment.startDate);
    const end = new Date(assignment.dueDate);
    return start <= today && today <= end;
  };

  const isScheduledNextWeek = (assignment: Assignment) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const start = new Date(assignment.startDate);
    return today < start && start <= nextWeek;
  };

  const ongoingAssignments = visibleAssignments.filter(isOngoing);
  const scheduledAssignments = visibleAssignments.filter(isScheduledNextWeek);

  // Table Row Renderer
  const renderRow = (item: Assignment) => {
    const pending = item.totalStudents - item.submitted;

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
      >
        <td className="flex items-center gap-4 p-4">{item.subject}</td>
        <td>{item.subjectCode}</td>
        <td>{item.class}</td>
        <td className="hidden md:table-cell">{item.teacher}</td>
        <td>{item.startDate}</td>
        <td className="hidden md:table-cell">{item.dueDate}</td>
        <td>{item.submitted}</td>
        <td>{pending}</td>
        <td>
          <div className="flex items-center gap-2">
            {/* Only admin and teacher can edit or delete */}
            {(role === "admin" || role === "teacher") && (
              <>
                <FormModal table="assignment" type="update" data={item} />
                <FormModal table="assignment" type="delete" id={item.id} />
              </>
            )}
            {/* Students can only view details */}
            {role === "student" && (
              <FormModal table="assignment" type="view" data={item} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {role === "admin"
            ? "All Assignments"
            : role === "teacher"
            ? "Your Assignments"
            : role === "student"
            ? "Class Assignments"
            : "Assignments"}
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>

            {/* Only admin and teacher can create */}
            {(role === "admin" || role === "teacher") && (
              <FormModal table="assignment" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* ONGOING ASSIGNMENTS */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Ongoing Assignments</h2>
      {ongoingAssignments.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={ongoingAssignments} />
      ) : (
        <p className="text-gray-500 text-sm">No ongoing assignments.</p>
      )}
      <Pagination />

      {/* SCHEDULED ASSIGNMENTS */}
      <h2 className="text-lg font-semibold mt-8 mb-2">
        Scheduled Assignments (Next 7 Days)
      </h2>
      {scheduledAssignments.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={scheduledAssignments} />
      ) : (
        <p className="text-gray-500 text-sm">No upcoming assignments.</p>
      )}
      <Pagination />
    </div>
  );
};

export default AssignmentListPage;
