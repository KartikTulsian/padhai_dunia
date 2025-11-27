"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { role, subjectsData } from "@/lib/data";

const columns = [
  { header: "Subject", accessor: "name" },
  { header: "Subject Code", accessor: "subjectCode" },
  { header: "Class", accessor: "className" },
  { header: "Modules", accessor: "modules" },
  { header: "Assignments", accessor: "assignments" },
  { header: "Students", accessor: "studentsEnrolled" },
  { header: "Actions", accessor: "action" },
];

//mock data
const currentTeacher = "Mr. Sharma";
const currentStudentSubjects = ["CS101", "CS102"]; // subject codes student enrolled in

const SubjectListPage = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Toggle expanded syllabus view
  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Role-based filtering
  const getVisibleSubjects = () => {
    if (role === "admin") return subjectsData;

    if (role === "teacher") {
      return subjectsData.filter((subject) =>
        subject.teachers?.includes(currentTeacher)
      );
    }

    if (role === "student") {
      return subjectsData.filter((subject) =>
        currentStudentSubjects.includes(subject.subjectCode)
      );
    }

    return [];
  };

  const visibleSubjects = getVisibleSubjects();

  // Row renderer
  const renderRow = (item: any) => (
    <>
      {/* MAIN ROW */}
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer"
        onClick={() => toggleExpand(item.id)}
      >
        <td className="p-4 font-medium">{item.name}</td>
        <td>{item.subjectCode}</td>
        <td>{item.className}</td>
        <td>{item.modules.length}</td>
        <td>{item.assignments}</td>
        <td>{item.studentsEnrolled}</td>
        <td>
          <div className="flex items-center gap-2">
            {/* Admin and Teacher can edit/delete */}
            {(role === "admin" || role === "teacher") && (
              <>
                <FormModal table="subject" type="update" data={item} />
                <FormModal table="subject" type="delete" id={item.id} />
              </>
            )}
            {/* Student can only view */}
            {role === "student" && (
              <FormModal table="subject" type="view" data={item} />
            )}
          </div>
        </td>
      </tr>

      {/* EXPANDED SYLLABUS ROW */}
      {expanded === item.id && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-[#CFCEFF] text-base">
                Detailed Syllabus
              </h3>
              {item.modules.map((mod: any, i: number) => (
                <div
                  key={i}
                  className="border-l-4 border-[#FAE27C] pl-3 py-1"
                >
                  <p className="font-medium">{mod.title}</p>
                  <p className="text-xs text-gray-600 mb-1">
                    Session: {mod.session}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {mod.chapters.map((ch: string, j: number) => (
                      <li key={j}>{ch}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">
          {role === "admin"
            ? "All Courses"
            : role === "teacher"
              ? "Your Courses"
              : "My Courses"}
        </h1>

        <div className="flex items-center gap-4">
          <TableSearch />

          {/* FILTER & SORT BUTTONS */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="filter" width={14} height={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="sort" width={14} height={14} />
          </button>

          {/* Only admin and teacher can create new subjects */}
          {(role === "admin" || role === "teacher") && (
            <FormModal table="subject" type="create" />
          )}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F1F0FF] text-gray-700 text-sm">
              {columns.map((col) => (
                <th key={col.accessor} className="p-3 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleSubjects.length > 0 ? (
              visibleSubjects.map(renderRow)
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default SubjectListPage;

