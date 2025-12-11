"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LessonSchema, lessonSchema } from "@/lib/formValidationSchema";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { CldUploadWidget } from "next-cloudinary";

import {
  FileText,
  BookOpen,
  Video,
  UploadCloud,
  CheckCircle,
  ArrowDownAZ,
  Clock,
  User,
} from "lucide-react";

export default function LessonForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { modules: any[]; teachers: any[] };
}) {
  const router = useRouter();
  const [contentUrl, setContentUrl] = useState<string>(data?.content || "");
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      moduleId: data?.moduleId || "",
      title: data?.title || "",
      description: data?.description || "",
      type: data?.type || "",
      content: data?.content || "",
      duration: data?.duration || undefined,
      orderIndex: data?.orderIndex || 1,
      teacherId: data?.teacherId || "",
      isFree: data?.isFree || false,
      isPublished: data?.isPublished || false,
      id: data?.id,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setState({ success: false, error: false });

    const payload = {
      ...formData,
      content: contentUrl,
      ...(type === "update" && { id: data?.id }),
    };

    startTransition(async () => {
      const result = await (type === "create" ? createLesson : updateLesson)(
        { success: false, error: false },
        payload
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Lesson ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, type, setOpen, router]);

  return (
    <form
      className="flex flex-col gap-8 h-full overflow-y-auto p-2 custom-scrollbar"
      onSubmit={onSubmit}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          {type === "create" ? "Create New Lesson" : "Update Lesson"}
        </h1>
        <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold border border-purple-200">
          {type === "create" ? "Draft Mode" : "Edit Mode"}
        </span>
      </div>

      {/* SECTION 1: BASIC INFO */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-600 pl-2">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Module"
            name="moduleId"
            as="select"
            register={register}
            error={errors.moduleId}
          >
            <option value="">Select Module</option>
            {relatedData?.modules?.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </InputField>

          <InputField
            label="Lesson Title"
            name="title"
            register={register}
            error={errors.title}
            placeholder="e.g. Introduction to Algebra"
          />
        </div>

        <InputField
          label="Description"
          name="description"
          as="textarea"
          register={register}
          placeholder="Brief explanation of lesson..."
          rows={3}
        />
      </section>

      {/* SECTION 2: TYPE & ORDER */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-bold border-l-4 border-blue-600 pl-2 text-gray-900">
          Lesson Type & Order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <InputField label="Lesson Type" name="type" as="select" register={register}>
            <option value="">Select Type</option>
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Document</option>
            <option value="PRESENTATION">Presentation</option>
            <option value="INTERACTIVE">Interactive</option>
            <option value="LIVE_CLASS">Live Class</option>
            <option value="QUIZ">Quiz</option>
          </InputField>

          <InputField label="Order Index" name="orderIndex" type="number" register={register} />
          <InputField
            label="Duration (Minutes)"
            name="duration"
            type="number"
            register={register}
            error={errors.duration}
          />
        </div>
      </section>

      {/* SECTION 3: CONTENT UPLOAD */}
      <section className="space-y-4 border-t border-gray-100 pt-4">
        <h2 className="text-sm font-bold border-l-4 border-green-600 pl-2 text-gray-900">
          Lesson File / Video
        </h2>

        <CldUploadWidget
          uploadPreset="padhai_dunia"
          options={{
            resourceType: "auto",
            clientAllowedFormats: ["mp4", "pdf", "ppt", "pptx", "doc", "docx", "txt", "png", "jpg", "jpeg"],
          }}
          onSuccess={(result: any) => setContentUrl(result.info.secure_url)}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <UploadCloud size={18} /> Upload Lesson Content
            </button>
          )}
        </CldUploadWidget>

        {contentUrl && (
          <p className="text-sm text-gray-600 break-all">
            Uploaded File: <span className="font-medium">{contentUrl}</span>
          </p>
        )}
      </section>

      {/* SECTION 4: FLAGS */}
      <section className="space-y-4 border-t border-gray-100 pt-4">
        <h2 className="text-sm font-bold border-l-4 border-orange-500 pl-2">Visibility Settings</h2>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isFree")} />
            Free Lesson
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isPublished")} />
            Publish
          </label>
        </div>
      </section>

      {/* FOOTER */}
      <div className="sticky bottom-0 bg-white pt-4 pb-3 border-t flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          {type === "create" ? "Create Lesson" : "Update Lesson"}
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
