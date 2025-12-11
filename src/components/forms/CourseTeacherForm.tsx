"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CourseTeacherSchema, courseTeacherSchema } from "@/lib/formValidationSchema";
import { createCourseTeacher } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserPlus, Save, X } from "lucide-react";

export default function CourseTeacherForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update"; // We mostly use 'create' for allocation
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { teachers: any[]; courseId: string };
}) {
  const router = useRouter();
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseTeacherSchema>({
    resolver: zodResolver(courseTeacherSchema),
    defaultValues: {
      courseId: relatedData?.courseId || "",
      teacherId: "",
      role: "Instructor",
    },
  });

  const onSubmit = handleSubmit((formData) => {
    setState({ success: false, error: false });
    startTransition(async () => {
      // We only implement create here (allocating a teacher). 
      // Updates usually aren't needed for the link itself, just delete/re-add.
      const result = await createCourseTeacher(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Teacher assigned successfully! 🎉");
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, setOpen, router]);

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={onSubmit}>
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-purple-600" />
          Assign Teacher
        </h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Select Teacher</label>
            <select 
                {...register("teacherId")} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
                <option value="">-- Choose a Teacher --</option>
                {relatedData?.teachers?.map((t: any) => (
                    <option key={t.id} value={t.id}>
                        {t.user.firstName} {t.user.lastName} ({t.teacherId})
                    </option>
                ))}
            </select>
            {errors.teacherId && <span className="text-red-500 text-xs">{errors.teacherId.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Role</label>
            <select 
                {...register("role")} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
                <option value="Instructor">Instructor</option>
                <option value="Co-Instructor">Co-Instructor</option>
                <option value="Teaching Assistant">Teaching Assistant</option>
            </select>
        </div>

        {/* Hidden Course ID */}
        <input type="hidden" {...register("courseId")} />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={state.success} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
            Assign <Save className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}