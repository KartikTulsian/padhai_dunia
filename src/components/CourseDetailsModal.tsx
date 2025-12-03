import React from 'react'
import Image from 'next/image';
import { Assignment, ClassCourse, Course, CourseEnrollment, CourseModule, CourseReview, CourseTeacher, Exam, Institute, Prisma, Quiz, StudyMaterial } from "@prisma/client";
import { auth } from '@clerk/nextjs/server';
import { role } from '@/lib/data';
import FormContainer from './FormCotainer';

type CourseWithRelations = Course & {
  enrollments: CourseEnrollment[];
  teachers: (CourseTeacher & { teacher?: any })[];
  modules: CourseModule[];
  assignments: Assignment[];
  exams: Exam[];
  quizzes: Quiz[];
  resources: StudyMaterial[];
  reviews: CourseReview[];
  classes: (ClassCourse & { class?: any })[];
  institute: Institute | null;
};

export default async function CourseDetailsModal({
  course,
  onCloseUrl,
}: {
  course: CourseWithRelations;
  onCloseUrl: string;
}) {
  const { userId } = await auth();
  const isAdmin = role === "admin" || role === "INSTITUTE_ADMIN";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-scaleIn">
        
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center gap-4">
          <Image
            src={course.thumbnail || "/avatar.png"}
            alt={course.title}
            width={80}
            height={80}
            className="rounded-full object-cover border-4 border-white shadow-xl"
          />

          <div className="flex justify-between w-full items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">{course.title}</h2>
              <p className="text-white/80 text-sm mt-1">
                Offered by <strong>{course.institute?.name}</strong>
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <FormContainer table="course" type="update" data={course} id={course.id} />
                <FormContainer table="course" type="delete" id={course.id} />
              </div>
            )}
          </div>

          <a
            href={onCloseUrl}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
          >
            ✕
          </a>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 leading-relaxed">{course.description}</p>

          {/* COURSE DETAILS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Course Type", value: course.type },
              { label: "Level", value: course.level },
              { label: "Price", value: `${course.price} ${course.currency}` },
              { label: "Duration", value: `${course.duration} hrs` },
              { label: "Language", value: course.language },
              { label: "Category", value: course.category },
              { label: "Tags", value: course.tags?.join(", ") },
              { label: "Prerequisites", value: course.prerequisites?.join(", ") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Image src="/info.png" alt="" width={22} height={22} />
                <span>
                  <strong>{item.label}:</strong> {item.value ?? "N/A"}
                </span>
              </div>
            ))}

            {isAdmin && (
              <>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                  <Image src="/status.png" alt="" width={22} height={22} />
                  <span>
                    <strong>Status:</strong> {course.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                  <Image src="/visibility.png" alt="" width={22} height={22} />
                  <span>
                    <strong>Public:</strong> {course.isPublic ? "Yes" : "No"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* RELATIONAL DETAILS FOR ADMINS */}
          {isAdmin && (
            <>
              {[
                { label: "Teachers", items: course.teachers, key: "teacher" },
                { label: "Modules", items: course.modules },
                { label: "Assignments", items: course.assignments },
                { label: "Exams", items: course.exams },
                { label: "Quizzes", items: course.quizzes },
                { label: "Resources", items: course.resources },
                { label: "Enrollments", items: course.enrollments },
                { label: "Classes", items: course.classes },
                { label: "Reviews", items: course.reviews },
              ].map((section, i) => (
                <details key={i} className="bg-gray-100 rounded-xl p-4 shadow-sm">
                  <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between">
                    {section.label} <span>({section.items?.length})</span>
                  </summary>
                  <div className="mt-3 space-y-1 text-sm pl-2">
                    {section.items?.length > 0 ? (
                      section.items.map((item: any, idx: number) => (
                        <p key={idx} className="border-b pb-1 text-gray-600">
                          {item.title || item.name || item.teacher?.name || "Unnamed Item"}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500">No data available</p>
                    )}
                  </div>
                </details>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}