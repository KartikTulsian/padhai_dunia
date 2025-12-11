"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enrollmentSchema, EnrollmentSchema } from "@/lib/formValidationSchema";
import { enrollInCourse } from "@/lib/actions";
import { useState, useTransition, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Loader2 } from "lucide-react";

export default function CourseEnrollmentForm({
  courseId,
  studentId,
  isEnrolled,
}: {
  courseId: string;
  studentId: string;
  isEnrolled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState({ success: false, error: false, message: "" });

  const { handleSubmit } = useForm<EnrollmentSchema>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { courseId, studentId },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await enrollInCourse(
        { success: false, error: false },
        data
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Enrolled successfully! 🎉");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router]);

  if (isEnrolled) {
    return (
      <button 
        disabled 
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-100 text-green-700 font-bold border border-green-200 cursor-default"
      >
        <BookOpenCheck className="w-5 h-5" />
        Already Enrolled
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enrolling...
          </>
        ) : (
          "Enroll Now"
        )}
      </button>
    </form>
  );
}