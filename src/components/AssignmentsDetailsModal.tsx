import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Assignment, AssignmentSubmission, Course, Teacher, User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "./FormContainer";
import { FileText } from "lucide-react";

type AssignmentWithRelations = Assignment & {
  teacher: Teacher & { user: User };
  course: Course;
  submissions: (AssignmentSubmission & { student: { user: User } })[];
};

export default async function AssignmentsDetailsModal({
  assignment,
  onCloseUrl,
}: {
  assignment: AssignmentWithRelations;
  onCloseUrl: string;
}) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === "admin" || role === "teacher";

  const submittedCount = assignment.submissions?.filter(s =>
    s.status === "SUBMITTED" || s.status === "GRADED"
  ).length ?? 0;

  const pendingCount = assignment.submissions?.filter(s =>
    s.status === "PENDING"
  ).length ?? 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn border">

        {/* HEADER */}
        <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">{assignment.title}</h2>

              <p className="text-sm text-white/80">
                {assignment.course.title} • {assignment.teacher.user.firstName} {assignment.teacher.user.lastName}
              </p>

              <p className="text-sm text-white/70 mt-1">
                Due {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(assignment.dueDate)}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <FormContainer table="assignment" type="update" data={assignment} id={assignment.id} />
                <FormContainer table="assignment" type="delete" id={assignment.id} />
              </div>
            )}
          </div>

          <Link
            href={onCloseUrl}
            className="absolute top-4 right-4 text-white hover:text-red-300 text-2xl font-black transition"
          >
            ✖
          </Link>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* STATUS + MARKS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg shadow">
              <p className="text-xl font-bold text-blue-600">{assignment.totalMarks}</p>
              <p className="text-xs text-gray-600">Total Marks</p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg shadow">
              <p className="text-xl font-bold text-green-600">{assignment.passingMarks}</p>
              <p className="text-xs text-gray-600">Passing</p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg shadow">
              <p className="text-xl font-bold text-purple-600">{submittedCount}</p>
              <p className="text-xs text-gray-600">Submitted</p>
            </div>

            <div className="bg-red-50 p-3 rounded-lg shadow">
              <p className="text-xl font-bold text-red-600">{pendingCount}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Description</h3>
            <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
          </div>

          {/* INSTRUCTIONS */}
          {assignment.instructions && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Instructions</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{assignment.instructions}</p>
            </div>
          )}

          {/* ATTACHMENTS */}
          {assignment.attachments.map((file, i) => {
            const fileName = file.split("/").pop()?.split("?")[0] ?? `File ${i + 1}`;
            return (
              <Link
                href={file}
                key={i}
                target="_blank"
                className="bg-gray-100 px-3 py-2 rounded-lg text-sm shadow flex items-center gap-2 hover:bg-gray-200 transition"
              >
                <FileText size={18} className="text-gray-700" />
                {fileName}
              </Link>
            );
          })}


          {/* SUBMISSIONS TABLE */}
          <details className="bg-gray-100 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
              Submissions
              <span className="text-sm bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full">
                {assignment.submissions.length}
              </span>
            </summary>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-2 border">Student</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Submitted At</th>
                    <th className="p-2 border">Marks</th>
                  </tr>
                </thead>

                <tbody>
                  {assignment.submissions.map((s) => (
                    <tr key={s.id} className="even:bg-gray-50 text-center">
                      <td className="p-2 border">{s.student.user.firstName} {s.student.user.lastName}</td>
                      <td className="p-2 border">{s.status}</td>
                      <td className="p-2 border">
                        {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(s.submittedAt)}
                      </td>
                      <td className="p-2 border">{s.marksObtained ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

        </div>

        {/* FOOTER */}
        <div className="p-5 bg-gray-50 border-t rounded-b-2xl flex justify-end">
          <Link
            href={onCloseUrl}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}
