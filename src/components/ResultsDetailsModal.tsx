import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Exam, Course, Teacher, User, ExamAttempt, Student, Institute } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "./FormContainer";

type ExamWithResults = Exam & {
  course: Course & { institute: Institute | null };
  teacher: Teacher & { user: User };
  attempts: (ExamAttempt & { student: Student & { user: User } })[];
};

export default async function ResultsDetailsModal({
  result,
  onCloseUrl,
}: {
  result: ExamWithResults;
  onCloseUrl: string;
}) {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === "admin" || role === "teacher";

  // Calculate statistics
  const gradedAttempts = result.attempts.filter((a) => a.isGraded);
  const allMarks = gradedAttempts.map((a) => a.marksObtained ?? 0);
  
  const highestMarks = allMarks.length ? Math.max(...allMarks) : 0;
  const lowestMarks = allMarks.length ? Math.min(...allMarks) : 0;
  const averageMarks = allMarks.length ? (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(2) : 0;
  const passedCount = gradedAttempts.filter((a) => (a.marksObtained ?? 0) >= result.passingMarks).length;
  const failedCount = gradedAttempts.length - passedCount;
  const passPercentage = gradedAttempts.length ? ((passedCount / gradedAttempts.length) * 100).toFixed(1) : 0;

  const publishTimes = gradedAttempts
    .map((a) => a.submittedAt?.getTime())
    .filter(Boolean) as number[];
  const publishedOn = publishTimes.length ? new Date(Math.max(...publishTimes)) : null;

  // Get current student's attempt if role is student
  const myAttempt = role === "student" 
    ? gradedAttempts.find((a) => a.student.userId === userId)
    : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">

        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
          <div className="flex items-center gap-4">
            <Image
              src="/result.png"
              alt="result icon"
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-white shadow-xl"
            />

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{result.title}</h2>
              <p className="text-white/90 text-sm mt-1">
                Course: <strong>{result.course.title}</strong>
              </p>
              <p className="text-white/80 text-xs mt-1">
                Teacher: {result.teacher.user.firstName} {result.teacher.user.lastName}
              </p>
              {result.course.institute && (
                <p className="text-white/70 text-xs mt-1">
                  Institute: {result.course.institute.name}
                </p>
              )}
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <FormContainer table="result" type="update" data={result} id={result.id} />
                <FormContainer table="result" type="delete" id={result.id} />
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

          {/* MY RESULT - Only for Students */}
          {role === "student" && myAttempt && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Result</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {myAttempt.marksObtained ?? 0} / {result.totalMarks}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Percentage</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {((((myAttempt.marksObtained ?? 0) / result.totalMarks) * 100)).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Status</p>
                  <p className={`text-lg font-bold ${(myAttempt.marksObtained ?? 0) >= result.passingMarks ? 'text-green-600' : 'text-red-600'}`}>
                    {(myAttempt.marksObtained ?? 0) >= result.passingMarks ? 'PASSED' : 'FAILED'}
                  </p>
                </div>
              </div>
              {myAttempt.submittedAt && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Submitted: {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(myAttempt.submittedAt)}
                </p>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          {result.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {result.description}
              </p>
            </div>
          )}

          {/* EXAM INFORMATION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Exam Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Exam Type", value: result.type.replace(/_/g, " "), icon: "/exam.png" },
                { label: "Scheduled At", value: new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(result.scheduledAt), icon: "/calendar.png" },
                { label: "Duration", value: `${result.duration} mins`, icon: "/hourglass.png" },
                { label: "Total Marks", value: result.totalMarks.toString(), icon: "/score.png" },
                { label: "Passing Marks", value: result.passingMarks.toString(), icon: "/pass.png" },
                { label: "Published On", value: publishedOn ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(publishedOn) : "Not Published", icon: "/check.png" },
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

          {/* STATISTICS - Only for Admin/Teacher */}
          {isAdmin && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">{gradedAttempts.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Students</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                    <p className="text-2xl font-bold text-green-600">{passedCount}</p>
                    <p className="text-xs text-gray-600 mt-1">Passed</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
                    <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                    <p className="text-xs text-gray-600 mt-1">Failed</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">{highestMarks}</p>
                    <p className="text-xs text-gray-600 mt-1">Highest</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-100">
                    <p className="text-2xl font-bold text-orange-600">{lowestMarks}</p>
                    <p className="text-xs text-gray-600 mt-1">Lowest</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg text-center border border-indigo-100">
                    <p className="text-2xl font-bold text-indigo-600">{averageMarks}</p>
                    <p className="text-xs text-gray-600 mt-1">Average</p>
                  </div>
                </div>

                {/* Pass Rate Progress Bar */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Pass Rate</span>
                    <span className="text-lg font-bold text-green-600">{passPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${passPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* STUDENT RESULTS LIST */}
              {gradedAttempts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Student Results</h3>

                  <details className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
                    <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
                      <span>All Students ({gradedAttempts.length})</span>
                      <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        View Details
                      </span>
                    </summary>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Rank</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Student Name</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Marks</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Percentage</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {gradedAttempts
                            .sort((a, b) => (b.marksObtained ?? 0) - (a.marksObtained ?? 0))
                            .map((attempt, i) => {
                              const percentage = ((attempt.marksObtained ?? 0) / result.totalMarks * 100).toFixed(1);
                              const isPassed = (attempt.marksObtained ?? 0) >= result.passingMarks;
                              
                              return (
                                <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-3 py-3 text-sm font-medium text-gray-700">#{i + 1}</td>
                                  <td className="px-3 py-3 text-sm font-medium text-gray-800">
                                    {attempt.student.user.firstName} {attempt.student.user.lastName}
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <span className="text-sm font-semibold text-gray-700">
                                      {attempt.marksObtained ?? 0} / {result.totalMarks}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                                    {percentage}%
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                      isPassed 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {isPassed ? 'PASSED' : 'FAILED'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center text-xs text-gray-600">
                                    {attempt.submittedAt 
                                      ? new Intl.DateTimeFormat("en-IN", { dateStyle: "short" }).format(attempt.submittedAt)
                                      : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <Link
            href={onCloseUrl}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}