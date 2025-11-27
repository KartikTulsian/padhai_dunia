"use client";

import { students } from "@/lib/data";
import { Edit } from "lucide-react";

export default function StudentsTable() {
  return (
    <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">New Students</h2>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">University/School</th>
            <th className="p-2">Date of Admit</th>
            <th className="p-2">Status</th>
            <th className="p-2">Fees</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.university}</td>
              <td className="p-2">{s.dateOfAdmit}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    s.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : s.status === "checked in"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td className="p-2">${s.fees}</td>
              <td className="p-2">
                <button className="p-1 rounded hover:bg-gray-200">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
