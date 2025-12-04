import React from "react";
import Image from "next/image";
import Link from "next/link";
import FormContainer from "./FormCotainer";
import {
    Announcement,
    Attendance,
    Class,
    ClassCourse,
    ClassStudent,
    ClassTeacher,
    Event,
    Institute,
    Student,
    Teacher,
    User
} from "@prisma/client";

type ClassWithRelations = Class & {
    teachers: (ClassTeacher & { teacher: Teacher & { user: User } })[];
    students: (ClassStudent & { student: Student & { user: User } })[];
    courses: ClassCourse[];
    announcements: Announcement[];
    events: Event[];
    institute: Institute;
    attendance: Attendance[];
};

export default function ClassesDetailsModal({
    details,
    onCloseUrl,
    role,
}: {
    details: ClassWithRelations;
    onCloseUrl: string;
    role?: string;
}) {
    const isAdmin = role === "admin";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">

                {/* HEADER */}
                <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-6 flex items-center gap-4 justify-between">
                    <div className="text-white">
                        <Image src="/class.png" alt="class" width={70} height={70} />
                        <h2 className="text-3xl font-bold">{details.name}</h2>
                        <p className="text-white/90 mt-1">
                            Grade: <strong>{details.grade}</strong> | Academic Year:{" "}
                            <strong>{details.academicYear}</strong>
                        </p>
                        <p className="text-white/80 text-sm">
                            Institute: <strong>{details.institute?.name}</strong>
                        </p>
                    </div>

                    {isAdmin && (
                        <div className="flex gap-2">
                            <FormContainer table="class" type="update" data={details} id={details.id} />
                            <FormContainer table="class" type="delete" id={details.id} />
                        </div>
                    )}

                    <Link
                        href={onCloseUrl}
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold transition-colors"
                    >
                        ✕
                    </Link>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-6">

                    {/* STATS GRID */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{details.students?.length || 0}</p>
                            <p className="text-sm text-gray-600">Students</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">{details.teachers?.length || 0}</p>
                            <p className="text-sm text-gray-600">Teachers</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-purple-600">{details.attendance?.length || 0}</p>
                            <p className="text-sm text-gray-600">Attendance Records</p>
                        </div>
                    </div>

                    {/* RELATIONAL SECTIONS */}
                    <div className="space-y-3">
                        {[
                            { label: "Teachers", items: details.teachers, mapKey: "teacher",icon:"/teacher.png" },
                            { label: "Students", items: details.students, mapKey: "student",icon:"/student.png" },
                            { label: "Courses", items: details.courses,icon:"/course.png"},
                            { label: "Announcements", items: details.announcements,icon:"/announcement.png" },
                            { label: "Events", items: details.events,icon:"/events.png" },
                            { label: "Attendance Records", items: details.attendance,icon:"/record.png" },
                        ].map((section, i) => (
                            <details key={i} className="bg-gray-100 rounded-xl p-4 shadow-sm">
                                <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
                                    <span>{section.label}</span>
                                    <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                        {section.items?.length || 0}
                                    </span>
                                </summary>

                                <div className="mt-3 space-y-2 text-sm pl-2">
                                    {section.items && section.items.length > 0 ? (
                                        section.items.map((item: any, idx: number) => (
                                            <div key={idx} className="border-b pb-2 text-gray-600 last:border-0">
                                                {item.teacher
                                                    ? `${item.teacher.user.firstName} ${item.teacher.user.lastName}`
                                                    : item.student
                                                        ? `${item.student.user.firstName} ${item.student.user.lastName}`
                                                        : item.title ?? `Item #${idx + 1}`
                                                }
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No data available</p>
                                    )}
                                </div>
                            </details>
                        ))}
                    </div>
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
