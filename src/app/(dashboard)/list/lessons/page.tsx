"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { lessonsData, role, loggedInUser } from "@/lib/data";
import Image from "next/image";

type LessonHistory = {
  id: number;
  date: string;
  topic: string;
  progress: string;
  class: string;
};

type Lesson = {
  id: number;
  teacherId: string;
  teacher: string;
  courses: string[];
  currentLesson: string;
  history: LessonHistory[];
};

const columns = [
  { header: "Teacher Name", accessor: "teacher" },
  { header: "Teacher ID", accessor: "teacherId" },
  { header: "Assigned Courses", accessor: "courses" },
  { header: "Current Lesson", accessor: "currentLesson" },
  { header: "Actions", accessor: "actions" },
];

const LessonListPage = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  let filteredLessons = lessonsData as Lesson[];

  // Role-based filtering
  if (role === "teacher") {
    filteredLessons = lessonsData.filter(
      (l) => l.teacher === loggedInUser.name
    );
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderRow = (item: Lesson) => {
    const isExpanded = expandedId === item.id;

    return (
      <>
        <tr
          key={item.id}
          onClick={() => toggleExpand(item.id)}
          className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer"
        >
          <td className="p-4">{item.teacher}</td>
          <td>{item.teacherId}</td>
          <td>{item.courses.join(", ")}</td>
          <td>{item.currentLesson}</td>
          <td>
            <div className="flex items-center gap-2">
              {role === "teacher" && (
                <FormModal table="lesson" type="update" data={item} />
              )}
              {role === "admin" && (
                <>
                  <FormModal table="lesson" type="update" data={item} />
                  <FormModal table="lesson" type="delete" id={item.id} />
                </>
              )}
            </div>
          </td>
        </tr>

        {/* Expanded view - Lesson history (1 month) */}
        {isExpanded && (
          <tr className="bg-slate-50 text-sm">
            <td colSpan={columns.length}>
              <div className="p-4">
                <h3 className="font-semibold mb-2">
                  Lesson History (Last 1 Month) for {item.teacher}
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#CFCEFF] text-white">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Class</th>
                      <th className="p-2 text-left">Topic</th>
                      <th className="p-2 text-left">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.history.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{record.class}</td>
                        <td className="p-2">{record.topic}</td>
                        <td className="p-2">{record.progress}</td>
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
          {role === "teacher" ? "My Lessons" : "All Lessons Overview"}
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
            {role === "admin" && <FormModal table="lesson" type="create" />}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={filteredLessons} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default LessonListPage;
