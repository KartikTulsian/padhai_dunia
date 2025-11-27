"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resultsData, role, loggedInUser } from "@/lib/data";
import Image from "next/image";

type StudentResult = {
  id: number;
  studentId: string;
  studentName: string;
  score: number;
};

type ResultBatch = {
  id: number;
  subjectCode: string;
  subject: string;
  class: string;
  teacher: string;
  examDate: string;
  resultDate: string;
  students: StudentResult[];
};


const getHighestMarks = (students: StudentResult[]) =>
  Math.max(...students.map((s) => s.score));


const columns = [
  { header: "Subject Code", accessor: "subjectCode" },
  { header: "Subject Name", accessor: "subject" },
  { header: "Teacher", accessor: "teacher" },
  { header: "Date of Exam", accessor: "examDate" },
  { header: "Date of Result", accessor: "resultDate" },
  { header: "Class", accessor: "class" },
  { header: "Students", accessor: "studentCount" },
  { header: "Highest Marks", accessor: "highestMarks" },
  { header: "Actions", accessor: "actions" },
];

const ResultListPage = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);


  let filteredResults = resultsData as ResultBatch[];

  if (role === "teacher") {
    filteredResults = resultsData.filter((r) => r.teacher === loggedInUser.name);
  } else if (role === "student") {
    filteredResults = resultsData.filter((r) =>
      r.students.some((s) => s.studentName === loggedInUser.name)
    );
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Render row for main table
  const renderRow = (item: ResultBatch) => {
    const highestMarks = getHighestMarks(item.students);
    const studentCount = item.students.length;
    const isExpanded = expandedId === item.id;

    // For student view — show limited data
    if (role === "student") {
      const studentResult = item.students.find(
        (s) => s.studentName === loggedInUser.name
      );
      return (
        <tr
          key={item.id}
          className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
        >
          <td className="p-4">{item.subject}</td>
          <td>{item.teacher}</td>
          <td>{item.examDate}</td>
          <td>{studentResult?.score ?? "-"}</td>
          <td>{highestMarks}</td>
        </tr>
      );
    }

    // For admin/teacher view
    return (
      <>
        <tr
          key={item.id}
          className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer"
          onClick={() => toggleExpand(item.id)}
        >
          <td className="p-4">{item.subjectCode}</td>
          <td>{item.subject}</td>
          <td>{item.teacher}</td>
          <td>{item.examDate}</td>
          <td>{item.resultDate}</td>
          <td>{item.class}</td>
          <td>{studentCount}</td>
          <td>{highestMarks}</td>
          <td>
            {(role === "admin" || role === "teacher") && (
              <div className="flex items-center gap-2">
                <FormModal table="result" type="update" data={item} />
                <FormModal table="result" type="delete" id={item.id} />
              </div>
            )}
          </td>
        </tr>

        {/* Expanded student-level details */}
        {isExpanded && (
          <tr className="bg-slate-50 text-sm">
            <td colSpan={columns.length}>
              <div className="p-4">
                <h3 className="font-semibold mb-2">
                  Student-wise Marks for {item.subject}
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#CFCEFF] text-white">
                      <th className="p-2 text-left">Student ID</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-2">{student.studentId}</td>
                        <td className="p-2">{student.studentName}</td>
                        <td className="p-2">{student.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {role === "student"
            ? "My Results"
            : role === "teacher"
            ? "My Issued Results"
            : "All Batches Results"}
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
            {(role === "admin" || role === "teacher") && (
              <FormModal table="result" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={filteredResults} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ResultListPage;
