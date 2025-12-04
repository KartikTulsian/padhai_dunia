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
import {
  resultSchema,
  ResultSchema,
} from "@/lib/formValidationSchema"; // use your schema path
import { createResult, updateResult } from "@/lib/actions"; // use your actions path
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

type Props = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?:any;
};

export default function ResultForm({ type, data, setOpen, relatedData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      ...data,
      examDate: data?.examDate ? data.examDate.substring(0, 10) : "",
      resultDate: data?.resultDate ? data.resultDate.substring(0, 10) : "",
    },
  });

  const [media, setMedia] = useState<any>(data?.media_url || null);
  const router = useRouter();

  const [state, formAction] = useActionState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false }
  );

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
      media_url: media?.secure_url || media || data?.media_url || null,
      ...(type === "update" && { id: data?.id }),
    };

    setHasShownSuccessToast(false);

    startTransition(() => {
      formAction(payload);
    });
  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast(
        `Result has been ${
          type === "create" ? "created" : "updated"
        } successfully!`
      );

      setHasShownSuccessToast(true);

      if (type === "create") {
        reset();
        setMedia(null);
      }

      setOpen(false);
      router.refresh();
    }
  }, [state, hasShownSuccessToast, reset, setOpen, router, type]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Result" : "Update Result"}
      </h1>

      {/* STUDENT ID */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Student ID</label>
        <input
          {...register("studentId")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Enter Student ID"
        />
        {errors.studentId && (
          <p className="text-xs text-red-400">{errors.studentId.message}</p>
        )}
      </div>

      {/* COURSE / EXAM / ASSIGNMENT IDs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Course ID (optional)</label>
          <input
            {...register("courseId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            placeholder="Course ID"
          />
          {errors.courseId && (
            <p className="text-xs text-red-400">{errors.courseId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Exam ID (optional)</label>
          <input
            {...register("examId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            placeholder="Exam ID"
          />
          {errors.examId && (
            <p className="text-xs text-red-400">{errors.examId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Assignment ID (optional)</label>
          <input
            {...register("assignmentId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            placeholder="Assignment ID"
          />
          {errors.assignmentId && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message}
            </p>
          )}
        </div>
      </div>

      {/* SUBJECT NAME */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Subject Name</label>
        <input
          {...register("subjectName")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Subject Name"
        />
        {errors.subjectName && (
          <p className="text-xs text-red-400">{errors.subjectName.message}</p>
        )}
      </div>

      {/* SUBJECT CODE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Subject Code</label>
        <input
          {...register("subjectCode")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Subject Code"
        />
        {errors.subjectCode && (
          <p className="text-xs text-red-400">{errors.subjectCode.message}</p>
        )}
      </div>

      {/* MARKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Marks Obtained</label>
          <input
            type="number"
            {...register("marksObtained")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            placeholder="e.g., 45"
          />
          {errors.marksObtained && (
            <p className="text-xs text-red-400">
              {errors.marksObtained.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Total Marks</label>
          <input
            type="number"
            {...register("totalMarks")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            placeholder="e.g., 50"
          />
          {errors.totalMarks && (
            <p className="text-xs text-red-400">{errors.totalMarks.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Percentage</label>
          <input
            type="number"
            step="0.01"
            {...register("percentage")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            placeholder="e.g., 90"
          />
          {errors.percentage && (
            <p className="text-xs text-red-400">{errors.percentage.message}</p>
          )}
        </div>
      </div>

      {/* GRADE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Grade (optional)</label>
        <input
          {...register("grade")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., A+"
        />
        {errors.grade && (
          <p className="text-xs text-red-400">{errors.grade.message}</p>
        )}
      </div>

      {/* EXAM DATE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Exam Date</label>
        <input
          type="date"
          {...register("examDate")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        />
        {errors.examDate && (
          <p className="text-xs text-red-400">{errors.examDate.message}</p>
        )}
      </div>

      {/* RESULT DATE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Result Date</label>
        <input
          type="date"
          {...register("resultDate")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        />
        {errors.resultDate && (
          <p className="text-xs text-red-400">
            {errors.resultDate.message}
          </p>
        )}
      </div>

      {/* REMARKS */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Remarks (optional)</label>
        <textarea
          {...register("remarks")}
          rows={4}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm resize-none"
          placeholder="Any additional remarks"
        />
        {errors.remarks && (
          <p className="text-xs text-red-400">{errors.remarks.message}</p>
        )}
      </div>

      {/* MEDIA UPLOAD */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">
          Media (optional)
        </label>

        <CldUploadWidget
          uploadPreset="padhai_dunia"
          onSuccess={(result, { widget }) => {
            setMedia(result.info);
            widget.close();
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <UploadCloud size={18} /> Upload Media
            </button>
          )}
        </CldUploadWidget>

        {(media?.secure_url || media) && (
          <div className="relative w-fit mt-2">
            <Image
              src={media?.secure_url || media}
              alt="Media Preview"
              width={150}
              height={150}
              className="rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => setMedia(null)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
            >
              ❌
            </button>
          </div>
        )}
      </div>

      {state.error && (
        <span className="text-red-500 text-sm">Something went wrong!</span>
      )}

      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === "create" ? "Create Result" : "Update Result"}
      </button>
    </form>
  );
}
