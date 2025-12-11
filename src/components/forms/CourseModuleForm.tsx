"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CourseModuleSchema, courseModuleSchema } from "@/lib/formValidationSchema";
import { createCourseModule, updateCourseModule } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { Layers, Save, X } from "lucide-react";

export default function CourseModuleForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { courseId: string };
}) {
  const router = useRouter();
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseModuleSchema>({
    resolver: zodResolver(courseModuleSchema),
    defaultValues: {
      id: data?.id,
      courseId: data?.courseId || relatedData?.courseId || "",
      title: data?.title || "",
      description: data?.description || "",
      orderIndex: data?.orderIndex || 0,
    },
  });

  const onSubmit = handleSubmit((formData) => {
    setState({ success: false, error: false });
    startTransition(async () => {
      const result = await (type === "create" ? createCourseModule : updateCourseModule)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(type === "create" ? "Module created successfully! 🎉" : "Module updated successfully! 🎉");
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
          <Layers className="w-6 h-6 text-green-600" />
          {type === "create" ? "Add New Module" : "Edit Module"}
        </h1>
      </div>

      <div className="space-y-4">
         <InputField label="Module Title" name="title" register={register} error={errors.title} placeholder="e.g. Introduction to Algebra" />
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Order Index" name="orderIndex" type="number" register={register} error={errors.orderIndex} placeholder="e.g. 1" />
            {/* Hidden Course ID */}
            <input type="hidden" {...register("courseId")} />
         </div>

         <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Description</label>
            <textarea 
                {...register("description")} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
                rows={3}
                placeholder="Brief description of what this module covers..."
            />
         </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={state.success} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 flex items-center gap-2">
            Save <Save className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}