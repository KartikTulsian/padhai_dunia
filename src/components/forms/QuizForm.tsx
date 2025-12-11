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
import { quizSchema, QuizSchema } from "@/lib/formValidationSchema";
import { createQuiz, updateQuiz } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function QuizForm({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizSchema>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      ...data,
    },
  });

  const router = useRouter();

  const [state, formAction] = useActionState(
    type === "create" ? createQuiz : updateQuiz,
    { success: false, error: false }
  );

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
      ...(type === "update" && { quiz_id: data?.quiz_id }),
    };

    setHasShownSuccessToast(false);

    startTransition(() => {
      formAction(payload);
    });
  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast(
        `Quiz ${
          type === "create" ? "created" : "updated"
        } successfully!`
      );

      setHasShownSuccessToast(true);
      setOpen(false);
      router.refresh();
    }
  }, [state, hasShownSuccessToast, setOpen, router, type]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Quiz" : "Update Quiz"}
      </h1>

      {/* TITLE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Title</label>
        <input
          {...register("title")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Quiz title"
        />
        {errors.title && (
          <p className="text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Description (optional)</label>
        <textarea
          {...register("description")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* COURSE ID */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Course ID</label>
        <input
          {...register("courseId")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Course ID"
        />
        {errors.courseId && (
          <p className="text-xs text-red-400">{errors.courseId.message}</p>
        )}
      </div>

      {/* TEACHER ID */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Teacher ID</label>
        <input
          {...register("teacherId")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Teacher ID"
        />
        {errors.teacherId && (
          <p className="text-xs text-red-400">{errors.teacherId.message}</p>
        )}
      </div>

      {/* QUIZ TYPE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Quiz Type</label>
        <select
          {...register("type")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">Select Quiz Type</option>
          <option value="DAILY_TRIVIA">Daily Trivia</option>
          <option value="WEEKLY_PROGRESS">Weekly Progress</option>
          <option value="TOPIC_QUIZ">Topic Quiz</option>
          <option value="PRACTICE_QUIZ">Practice Quiz</option>
        </select>
        {errors.type && (
          <p className="text-xs text-red-400">{errors.type.message}</p>
        )}
      </div>

      {/* DURATION (optional) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          Duration (Minutes) — optional
        </label>
        <input
          type="number"
          {...register("duration", { valueAsNumber: true })}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., 30"
        />
        {errors.duration && (
          <p className="text-xs text-red-400">{errors.duration.message}</p>
        )}
      </div>

      {/* TOTAL MARKS */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Total Marks</label>
        <input
          type="number"
          {...register("totalMarks", { valueAsNumber: true })}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., 20"
        />
        {errors.totalMarks && (
          <p className="text-xs text-red-400">{errors.totalMarks.message}</p>
        )}
      </div>

      {/* PASSING MARKS (optional) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Passing Marks (optional)</label>
        <input
          type="number"
          {...register("passingMarks", { valueAsNumber: true })}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., 8"
        />
        {errors.passingMarks && (
          <p className="text-xs text-red-400">
            {errors.passingMarks.message}
          </p>
        )}
      </div>

      {/* SCHEDULED AT (optional) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          Scheduled Date (optional)
        </label>
        <input
          type="datetime-local"
          {...register("scheduledAt")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        />
        {errors.scheduledAt && (
          <p className="text-xs text-red-400">{errors.scheduledAt.message}</p>
        )}
      </div>

      {/* PUBLISH STATUS */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isPublished")} />
        <label className="text-sm">Publish Quiz</label>
      </div>

      {/* ERROR */}
      {state.error && (
        <span className="text-red-500 text-sm">Something went wrong!</span>
      )}

      {/* SUBMIT BUTTON */}
      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === "create" ? "Create Quiz" : "Update Quiz"}
      </button>
    </form>
  );
}
