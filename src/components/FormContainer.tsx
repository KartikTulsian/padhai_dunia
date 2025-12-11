import React from 'react'
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export type FormContainerProps = {
    table:
    | "event"
    | "announcement"
    | "exam"
    | "quiz"
    | "result"
    | "course"
    | "lesson"
    | "class"
    | "assignment"
    | "teacher"
    | "student"
    | "institute"
    | "instituteAdmin"
    | "studyMaterial"
    | "user"
    | "courseModule"
    | "courseTeacher";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string;
}

export default async function FormContainer({ table, type, data, id }: FormContainerProps) {
    let relatedData = {}

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    if (type !== "delete") {
        switch (table) {
            case "user":
                break;
            case "institute":
                relatedData = {
                    // Fetch users to populate the "Assign Administrator" dropdown
                    users: await prisma.user.findMany({
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                        },
                    }),
                };
                break;
            case "instituteAdmin":
                relatedData = {
                    institutes: await prisma.institute.findMany({
                        select: { id: true, name: true, code: true }, // Form displays Name + Code
                    }),
                };
                break;
            case "teacher":
                relatedData = {
                    institutes: await prisma.institute.findMany({
                        select: { id: true, name: true, code: true }, // Form displays Name + Code
                    }),
                };
                break;
            case "student":
                relatedData = {
                    institutes: await prisma.institute.findMany({
                        select: { id: true, name: true, code: true }, // Form displays Name + Code
                    }),
                    classes: await prisma.class.findMany({
                        select: { id: true, name: true }, // Form displays Class Name
                    }),
                };
                break;
            case "course":
                relatedData = {
                    classes: await prisma.class.findMany({
                        select: { 
                            id: true, 
                            name: true,
                            grade: true, // The form explicitly checks for cls.grade
                        }, 
                    }),
                };
                break;
            case "class":
                relatedData = {
                    institutes: await prisma.institute.findMany({
                        select: { id: true, name: true },
                    }),
                    teachers: await prisma.teacher.findMany({
                        select: {
                            id: true,
                            instituteId: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    }),
                };
                break;
            case "lesson":
                relatedData = {
                    modules: await prisma.courseModule.findMany({
                        select: { id: true, title: true }
                    }),
                    teachers: await prisma.teacher.findMany({
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    }),
                };
                break;
            case "exam":
                relatedData = {
                    courses: await prisma.course.findMany({
                        select: { id: true, title: true, code: true }
                    }),

                    teachers: await prisma.teacher.findMany({
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    }),
                };
                break;
            case "assignment":
                relatedData = {
                    courses: await prisma.course.findMany({
                        select: { id: true, title: true, code: true }
                    }),

                    teachers: await prisma.teacher.findMany({
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    }),
                };
                break;
            case "announcement":
                relatedData = {
                    institutes: await prisma.institute.findMany({ select: { id: true, name: true } }),
                    classes: await prisma.class.findMany({ select: { id: true, name: true } }),
                };
                break;
            case "event":
                relatedData = {
                    institutes: await prisma.institute.findMany({ select: { id: true, name: true } }),
                    classes: await prisma.class.findMany({ select: { id: true, name: true } }),
                };
                break;
            case "courseModule":
                relatedData = {
                    // courses: await prisma.course.findMany({
                    //     select: { id: true, title: true, code: true }
                    // }),
                    courseId: id
                };
                break;
            case "courseTeacher":
                relatedData = {
                    teachers: await prisma.teacher.findMany({
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    }),
                    courseId: id
                };
                break;
            case "studyMaterial":
                relatedData = {
                    courseId: id
                };
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    )
}
