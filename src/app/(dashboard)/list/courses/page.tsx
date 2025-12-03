"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { Assignment, ClassCourse, Course, CourseEnrollment, CourseModule, CourseReview, CourseTeacher, Exam, Institute, Prisma, Quiz, StudyMaterial } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Table from "@/components/Table";
import CourseDetailsModal from "@/components/CourseDetailsModal";

type CourseList = Course & {
  enrollments: CourseEnrollment[];
  teachers: CourseTeacher[];
  modules: CourseModule[];
  assignments: Assignment[];
  exams: Exam[];
  quizzes: Quiz[];
  resources: StudyMaterial[];
  reviews: CourseReview[];
  classes: ClassCourse[];
  institute: Institute;
}

export default async function SubjectListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  const columns = [
    { header: "Course Name", accessor: "title" },
    { header: "Cource Code", accessor: "code" },
    { header: "Type", accessor: "type" },
    { header: "Intitute", accessor: "institute" },
    { header: "Level", accessor: "level" },
    { header: "Price", accessor: "price" },
  ];


  const [expanded, setExpanded] = useState<number | null>(null);

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  // Row renderer
  const renderRow = (item: CourseList) => {
    return (
    <>
      {/* MAIN ROW */}
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer"
        // onClick={() => toggleExpand(item.id)}
      >
        <td className="p-4 font-medium">{item.title}</td>
        <td>{item.code}</td>
        <td>{item.type}</td>
        <td>{item.institute?.name}</td>
        <td>{item.level}</td>
        <td>{item.price}</td>
      </tr>
    </>
    );
  };

  const { page, courseId, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.CourseWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "title":
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.course.findMany({
      where: query,
      include: {
        enrollments: true,
        institute: true,
        teachers: true,
        modules: true,
        assignments: true,
        exams: true,
        quizzes: true,
        resources: true,
        reviews: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { code: 'desc' },
    }),
    prisma.course.count({ where: query }),
  ]) as [CourseList[], number];

  const selectedCourse = courseId
    ? await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        enrollments: true,
        institute: true,
        teachers: true,
        modules: true,
        assignments: true,
        exams: true,
        quizzes: true,
        resources: true,
        reviews: true,
        classes: true,
      },
    })
    : null;

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
            <FormModal table="course" type="create" />
          )}
        </div>
      </div>

      {/* TABLE SECTION */}
      {data.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={data} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xl font-medium text-gray-600">No students found.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search filters.</p>
        </div>
      )}


      {/* --- PAGINATION --- */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>

      {selectedCourse && selectedCourse.institute && (
        <CourseDetailsModal
          course={selectedCourse as CourseList & { institute: NonNullable<Institute> }}
          onCloseUrl={`/list/course?page=${p}`}
        />
      )}
    </div>
  );
};

