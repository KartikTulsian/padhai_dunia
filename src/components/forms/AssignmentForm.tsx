"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentSchema, assignmentSchema } from "@/lib/formValidationSchema";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import {
  FileText,
  Calendar,
  Award,
  ClipboardList,
  UploadCloud,
  CheckCircle,
} from "lucide-react";

export default function AssignmentForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { courses: any[]; teachers: any[] };
}) {
  const router = useRouter();
  const [attachments, setAttachments] = useState<string[]>(data?.attachments || []);
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      courseId: data?.courseId || "",
      teacherId: data?.teacherId || "",
      dueDate: data?.dueDate ? new Date(data.dueDate).toISOString().slice(0, 10) : "",
      totalMarks: data?.totalMarks || 100,
      passingMarks: data?.passingMarks || 40,
      instructions: data?.instructions || "",
      status: data?.status || "DRAFT",
      allowLateSubmission: data?.allowLateSubmission || false,
      attachments: data?.attachments || [],
      id: data?.id,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setState({ success: false, error: false });

    const payload = {
      ...formData,
      attachments,
      ...(type === "update" && { id: data?.id }),
    };

    startTransition(async () => {
      const result = await (type === "create" ? createAssignment : updateAssignment)(
        { success: false, error: false },
        payload
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Assignment ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, type, setOpen, router]);

  return (
    <form className="flex flex-col gap-8 h-full overflow-y-auto p-2 custom-scrollbar" onSubmit={onSubmit}>
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-yellow-600" />
          {type === "create" ? "Create New Assignment" : "Update Assignment"}
        </h1>
        <span className="text-xs px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-semibold border border-yellow-100">
          {type === "create" ? "Draft Mode" : "Edit Mode"}
        </span>
      </div>

      {/* SECTION 1: BASIC INFORMATION */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-yellow-500 pl-2">
          Basic Information
        </h2>

        <InputField
          label="Assignment Title"
          name="title"
          register={register}
          error={errors.title}
          placeholder="e.g. Physics Numerical Assignment"
        />

        <InputField
          label="Description"
          name="description"
          as="textarea"
          rows={4}
          register={register}
          error={errors.description}
          placeholder="Explain details about assignment..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Course"
            name="courseId"
            as="select"
            register={register}
            error={errors.courseId}
          >
            <option value="">Select Course</option>
            {relatedData?.courses?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.code})
              </option>
            ))}
          </InputField>

          <InputField
            label="Assigned Teacher"
            name="teacherId"
            as="select"
            register={register}
            error={errors.teacherId}
          >
            <option value="">Select Teacher</option>
            {relatedData?.teachers?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.user.firstName} {t.user.lastName}
              </option>
            ))}
          </InputField>
        </div>
      </section>

      {/* SECTION 2: MARKING & DATE */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-bold border-l-4 border-blue-600 pl-2 text-gray-900">
          Evaluation & Dates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="relative">
            <InputField
              label="Due Date"
              name="dueDate"
              type="date"
              register={register}
              error={errors.dueDate}
            />
            <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
          </div>

          <div className="relative">
            <InputField
              label="Total Marks"
              name="totalMarks"
              type="number"
              register={register}
              error={errors.totalMarks}
            />
            <Award className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
          </div>

          <InputField
            label="Minimum Passing Marks"
            name="passingMarks"
            type="number"
            register={register}
            error={errors.passingMarks}
          />
        </div>
      </section>

      {/* INSTRUCTIONS + STATUS */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <InputField
          label="Instructions (Optional)"
          name="instructions"
          as="textarea"
          rows={3}
          register={register}
          placeholder="e.g. Submit PDF only. Use proper formatting."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Status"
            name="status"
            as="select"
            register={register}
            error={errors.status}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </InputField>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <input type="checkbox" {...register("allowLateSubmission")} className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Allow Late Submission</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: ATTACHMENTS */}
      <section className="space-y-4 border-t border-gray-100 pt-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-green-600 pl-2">
          Assignment Files
        </h2>

        <CldUploadWidget
          uploadPreset="padhai_dunia"
          options={{
            resourceType: "raw",
            multiple: true,
            clientAllowedFormats: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "png", "jpg", "jpeg", "webp"],
          }}
          onSuccess={(result: any) => {
            const url = result.info.secure_url;
            setAttachments((prev) => [...prev, url]);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <UploadCloud size={18} /> Upload Files
            </button>
          )}
        </CldUploadWidget>

        <div className="flex flex-wrap gap-4 mt-3">
          {attachments.map((url, idx) => {
            const fileName = url.split("/").pop()?.split("?")[0] ?? "File";
            const isImage = /\.(png|jpe?g|gif|webp)$/i.test(url);

            return (
              <div key={idx} className="relative w-fit">
                {isImage ? (
                  <Image
                    src={url}
                    alt={fileName}
                    width={120}
                    height={120}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    className="w-[120px] h-[120px] flex flex-col justify-center items-center bg-gray-100 rounded-md border"
                  >
                    <FileText className="w-10 h-10 text-red-600" />
                    <span className="text-xs text-gray-600 truncate px-2">{fileName}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                >
                  ❌
                </button>
              </div>
            );
          })}
        </div>


      </section>

      {/* FOOTER ACTIONS */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          {type === "create" ? "Create Assignment" : "Update Assignment"}
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
