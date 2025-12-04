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
    | "studyMaterial"
    | "user"
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
            case "course":
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
