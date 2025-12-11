import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Exam, Course, Teacher, User, ExamQuestion, ExamAttempt } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "./FormContainer";

type ExamWithRelations = Exam & {
  course: Course;
  teacher: Teacher & { user: User };
  questions: ExamQuestion[];
  attempts: ExamAttempt[];
};

export default async function ExamDetailsModal({
  exam,
  onCloseUrl,
}: {
  exam: ExamWithRelations;
  onCloseUrl: string;
}) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === "admin" || role === "teacher";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">

        {/* HEADER */}
        <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-4">
            <Image
              src="/exam.png"
              alt="exam icon"
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-white shadow-xl"
            />

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{exam.title}</h2>
              <p className="text-white/80 text-sm mt-1">
                Course: <strong>{exam.course.title}</strong>
              </p>
              <p className="text-white/70 text-xs mt-1">
                Teacher: {exam.teacher.user.firstName} {exam.teacher.user.lastName}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <FormContainer table="exam" type="update" data={exam} id={exam.id} />
                <FormContainer table="exam" type="delete" id={exam.id} />
              </div>
            )}
          </div>

          <Link
            href={onCloseUrl}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold transition-colors"
          >
            ✕
          </Link>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {exam.description || "No description available"}
            </p>
          </div>

          {/* INFO GRID */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Exam Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Exam Type", value: exam.type.replace("_", " "), icon: "/exam.png" },
                { label: "Scheduled At", value: new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(exam.scheduledAt), icon: "/calendar.png" },
                { label: "Duration", value: `${exam.duration} mins`, icon: "/hourglass.png" },
                { label: "Total Marks", value: exam.totalMarks, icon: "/score.png" },
                { label: "Passing Marks", value: exam.passingMarks, icon: "/pass.png" },
                { label: "Published", value: exam.isPublished ? "Yes" : "No", icon: "/check.png" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span>
                    <strong className="text-gray-700">{item.label}:</strong>{" "}
                    <span className="text-gray-600">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STATISTICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{exam.questions.length}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{exam.attempts.length}</p>
              <p className="text-sm text-gray-600">Attempts</p>
            </div>
          </div>

          {/* DETAILS LISTS */}
          {isAdmin && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Additional Details</h3>

              {/* QUESTIONS LIST */}
              <details className="bg-gray-100 rounded-xl p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
                  <span>Questions</span>
                  <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {exam.questions.length}
                  </span>
                </summary>
                <div className="mt-3 space-y-2 text-sm pl-2">
                  {exam.questions.length ? exam.questions.map((q, i) => (
                    <div key={i} className="border-b pb-2 text-gray-600">
                      <strong>Q{i + 1}:</strong> {q.questionText} <br />
                      <span className="text-xs text-gray-500">Type: {q.questionType} • Marks: {q.marks}</span>
                    </div>
                  )) : <p className="text-gray-500 italic">No questions available</p>}
                </div>
              </details>

              {/* ATTEMPTS LIST */}
              <details className="bg-gray-100 rounded-xl p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
                  <span>Attempts</span>
                  <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {exam.attempts.length}
                  </span>
                </summary>
                <div className="mt-3 space-y-2 text-sm pl-2">
                  {exam.attempts.length ? exam.attempts.map((a, i) => (
                    <div key={i} className="border-b pb-2 text-gray-600">
                      Student ID: {a.studentId} <br />
                      Started: {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(a.startedAt)}
                    </div>
                  )) : <p className="text-gray-500 italic">No attempts available</p>}
                </div>
              </details>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <Link
            href={onCloseUrl}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}
