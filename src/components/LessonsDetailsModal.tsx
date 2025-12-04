import React from "react";
import Link from "next/link";
import FormModal from "./FormModal";
import { Course, CourseModule, Lesson, LessonProgress, Student, Teacher, User } from "@prisma/client";
import Image from "next/image";

type LessonWithRelations = Lesson & {
  module: CourseModule & { course: Course };
  teacher: Teacher & { user: User };
  progress: (LessonProgress & { student: Student & { user: User } })[];
};

export default function LessonsDetailsModal({
  details,
  onCloseUrl,
  role,
}: {
  details: LessonWithRelations;
  onCloseUrl: string;
  role?: string;
}) {
  const isAdminOrTeacher = role === "admin" || role === "teacher";

  // Extract unique schedule dates from lesson progress
  const scheduleDates = Array.from(
    new Set(details.progress.map((p) => new Date(p.startedAt).toDateString()))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">

        {/* HEADER */}
        <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="text-white space-y-1">
              <Image src="/lesson.png" alt="lesson" height={70} width={70}/>
            <h2 className="text-3xl font-bold">{details.title}</h2>
            <p className="text-white/90 text-sm">
              Course: <strong>{details.module.course.title}</strong> | Module:{" "}
              <strong>{details.module.title}</strong>
            </p>
            <p className="text-white/80 text-sm">
              Teacher: <strong>{details.teacher?.user?.firstName} {details.teacher?.user?.lastName}</strong>
            </p>
          </div>

          {isAdminOrTeacher && (
            <div className="flex gap-2">
              <FormModal table="lesson" type="update" data={details} id={details.id} />
              {role === "admin" && <FormModal table="lesson" type="delete" id={details.id} />}
            </div>
          )}

          <Link
            href={onCloseUrl}
            className="absolute top-3 right-4 text-white text-2xl font-bold hover:text-gray-200"
          >
            ✕
          </Link>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* OVERVIEW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{details.progress.length}</p>
              <p className="text-sm text-gray-600">Students Attempted</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-xl font-semibold text-green-600">{details.duration ?? "--"} min</p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-xl font-semibold text-purple-600">{details.type}</p>
              <p className="text-sm text-gray-600">Type</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-xl font-semibold text-orange-600">
                {details.isPublished ? "Published" : "Draft"}
              </p>
              <p className="text-sm text-gray-600">Status</p>
            </div>
          </div>

          {/* TEACHER SCHEDULE / CLASS DATES */}
          <details className="bg-gray-100 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between">
              Lesson Schedule Dates
              <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {scheduleDates.length}
              </span>
            </summary>

            <ul className="mt-3 space-y-2 pl-3 text-sm">
              {scheduleDates.map((date, i) => (
                <li key={i} className="border-b pb-1 text-gray-700">
                  {date}
                </li>
              ))}
            </ul>
          </details>

          {/* STUDENT PROGRESS TABLE */}
          <details className="bg-gray-100 rounded-xl p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between">
              Student Progress Report
              <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {details.progress.length}
              </span>
            </summary>

            <div className="mt-3 overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Student</th>
                    <th className="p-2 text-left">Progress</th>
                    <th className="p-2 text-left">Completed</th>
                    <th className="p-2 text-left">Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {details.progress.map((p, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">
                        {p.student.user.firstName} {p.student.user.lastName}
                      </td>
                      <td className="p-2">{p.progress}%</td>
                      <td className="p-2">{p.isCompleted ? "Yes" : "No"}</td>
                      <td className="p-2">{Math.round(p.timeSpent / 60)} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <Link
            href={onCloseUrl}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}
