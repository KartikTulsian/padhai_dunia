"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, {
    Dispatch,
    startTransition,
    useActionState,
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
    announcementSchema,
    AnnouncementSchema,
} from "@/lib/formValidationSchema";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AnnouncementForm({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    relatedData?: any;
}) {
    const { register, handleSubmit, formState: { errors } } =
        useForm<AnnouncementSchema>({
            resolver: zodResolver(announcementSchema),
            defaultValues: {
                title: data?.title || "",
                content: data?.content || "",
                target: data?.target || "",
                instituteId: data?.instituteId || "",
                classId: data?.classId || "",
                expiresAt: data?.expiresAt ? data.expiresAt.substring(0, 10) : "",
                id: data?.id || "",
            },
        });

    const [state, setState] = useState({ success: false, error: false });
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    const router = useRouter();

    const onSubmit = handleSubmit((formData) => {
        const payload = {
            ...formData,
            ...(type === "update" && data?.id ? { id: data.id } : {}),
        };

        setHasShownSuccessToast(false);

        startTransition(async () => {
            const result = await (type === "create" ? createAnnouncement : updateAnnouncement)(
                { success: false, error: false },
                payload
            );

            setState(result);
        });
    });

    useEffect(() => {
        if (state.success && !hasShownSuccessToast) {
            toast(`Announcement has been ${type === "create" ? "created" : "updated"} successfully!`);
            setHasShownSuccessToast(true);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen, hasShownSuccessToast]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create Announcement" : "Update Announcement"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Title"
                    name="title"
                    register={register}
                    error={errors?.title}
                />

                <div className="flex flex-col gap-2 w-full">
                    <label className="text-xs text-gray-500">Content</label>
                    <textarea
                        {...register("content")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-28"
                    ></textarea>
                    {errors.content?.message && (
                        <p className="text-xs text-red-400">{errors.content.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/3">
                    <label className="text-xs text-gray-500">Target</label>
                    <select
                        {...register("target")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    >
                        <option value="">Select Target</option>
                        <option value="ALL_STUDENTS">All Students</option>
                        <option value="SPECIFIC_CLASS">Specific Class</option>
                        <option value="SPECIFIC_COURSE">Specific Course</option>
                        <option value="INSTITUTE_WIDE">Institute Wide</option>
                        <option value="PLATFORM_WIDE">Platform Wide</option>
                    </select>

                    {errors.target?.message && (
                        <p className="text-xs text-red-400">{errors.target.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col w-full md:w-1/4 gap-2">
                    <label className="text-xs text-gray-500">Institute</label>
                    <select {...register("instituteId")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm">
                        <option value="">Select Institute</option>
                        {relatedData?.institutes?.map((inst: any) => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                </div>

                {/* Class Dropdown */}
                <div className="flex flex-col w-full md:w-1/4 gap-2">
                    <label className="text-xs text-gray-500">Class</label>
                    <select {...register("classId")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm">
                        <option value="">Select Class</option>
                        {relatedData?.classes?.map((cls: any) => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/3">
                    <label className="text-xs text-gray-500">Expiry Date</label>
                    <input
                        type="date"
                        {...register("expiresAt")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    />
                    {errors.expiresAt?.message && (
                        <p className="text-xs text-red-400">{errors.expiresAt.message.toString()}</p>
                    )}
                </div>

                {type === "update" && data?.id && (
                    <InputField
                        label="ID"
                        name="id"
                        register={register}
                        error={errors?.id}
                    />
                )}
            </div>

            {state.error && <span className="text-red-500">Something went wrong!</span>}

            <button className="bg-blue-600 text-white p-2 rounded-md cursor-pointer">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
}