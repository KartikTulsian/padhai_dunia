"use client";

import { useState } from "react";
import { role, loggedInUser, attendanceData } from "@/lib/data";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Define attendance record type
type AttendanceRecord = {
  id: number;
  date: string;
  subject: string;
  class: string;
  topic: string;
  status: "Present" | "Absent";
};

// Table columns
const columns = [
  { header: "Date", accessor: "date" },
  { header: "Subject", accessor: "subject" },
  { header: "Class", accessor: "class" },
  { header: "Topic Covered", accessor: "topic" },
  { header: "Status", accessor: "status" },
];

const AttendancePage = () => {
  // Filter only the logged-in student’s records
  const studentName = loggedInUser?.name;
  const filteredData =
    role === "student"
      ? attendanceData.filter((rec) => rec.student === studentName)
      : attendanceData;

  // Compute attendance percentage per subject for the graph
  const attendanceBySubject = Object.values(
    filteredData.reduce((acc: any, record) => {
      if (!acc[record.subject]) {
        acc[record.subject] = { subject: record.subject, Present: 0, Total: 0 };
      }
      acc[record.subject].Total += 1;
      if (record.status === "Present") acc[record.subject].Present += 1;
      return acc;
    }, {})
  ).map((item: any) => ({
    subject: item.subject,
    percentage: Math.round((item.Present / item.Total) * 100),
  }));

  const renderRow = (record: AttendanceRecord) => (
    <tr
      key={record.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm"
    >
      <td className="p-3">{record.date}</td>
      <td>{record.subject}</td>
      <td>{record.class}</td>
      <td>{record.topic}</td>
      <td
        className={`font-medium ${
          record.status === "Present" ? "text-green-600" : "text-red-500"
        }`}
      >
        {record.status}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">
          {role === "student" ? "My Attendance Record" : "All Attendance Records"}
        </h1>

        <div className="flex items-center gap-4">
          <TableSearch />
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="filter" width={14} height={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="sort" width={14} height={14} />
          </button>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="my-8">
        <h2 className="text-base font-semibold text-gray-700 mb-3">
          Attendance Summary by Subject
        </h2>
        {attendanceBySubject.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceBySubject}>
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="percentage" fill="#8B5CF6" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No attendance data available.</p>
        )}
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
            {filteredData.length > 0 ? (
              filteredData.map(renderRow)
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No attendance records found.
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

export default AttendancePage;
