"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { CourseSchema, courseSchema } from "@/lib/formValidationSchema";
import { createCourse, updateCourse } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { 
  BookOpen, CheckCircle, GraduationCap, DollarSign, 
  Clock, Layout, Tags, Globe, Users, 
  Target
} from "lucide-react";
import InputField from "../InputField";

const STUDENT_GOALS = [
  { value: "JEE_PREPARATION", label: "JEE Preparation" },
  { value: "NEET_PREPARATION", label: "NEET Preparation" },
  { value: "CAT_PREPARATION", label: "CAT Preparation" },
  { value: "ENGINEERING", label: "Engineering" },
  { value: "MEDICAL", label: "Medical" },
  { value: "GATE_PREPARATION", label: "GATE Preparation" },
  { value: "UPSC_PREPARATION", label: "UPSC Preparation" },
  { value: "SKILL_DEVELOPMENT", label: "Skill Development" },
  { value: "SCHOOL_CURRICULUM", label: "School Curriculum" },
  { value: "OTHER", label: "Other" },
];

export default function CourseForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { classes: any[] }; // Expecting list of available classes here
}) {
  const router = useRouter();
  const [state, setState] = useState({ success: false, error: false });

  // If updating, we need to pre-fill the classIds from the existing data
  // Assuming data.classes is an array of ClassCourse objects or similar
  const existingClassIds = data?.classes 
    ? data.classes.map((c: any) => c.classId || c.id) 
    : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data?.title || "",
      code: data?.code || "",
      description: data?.description || "",
      thumbnail: data?.thumbnail || "",
      type: data?.type || "INSTITUTE_SPECIFIC",
      level: data?.level || "BEGINNER",
      status: data?.status || "DRAFT",
      price: data?.price || 0,
      currency: data?.currency || "INR",
      discountPrice: data?.discountPrice || 0,
      duration: data?.duration || 0,
      language: data?.language || "English",
      category: data?.category || "",
      tags: data?.tags || [],
      prerequisites: data?.prerequisites || [],
      isPublic: data?.isPublic || false,
      classIds: existingClassIds, // Pre-select classes
      id: data?.id,

      targetAudience: data?.targetAudience || [],
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setState({ success: false, error: false });

    if (type === "update" && data?.id) {
        formData.id = data.id;
    }

    startTransition(async () => {
      const result = await (type === "create" ? createCourse : updateCourse)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Course ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
        toast.error("Something went wrong!");
    }
  }, [state, type, setOpen, router]);

  return (
    <form className="flex flex-col gap-8 h-full overflow-y-auto p-2 custom-scrollbar" onSubmit={onSubmit}>
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          {type === "create" ? "Create New Course" : "Update Course"}
        </h1>
        <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-semibold border border-blue-100">
            {type === "create" ? "Draft Mode" : "Edit Mode"}
        </span>
      </div>

      {/* --- SECTION 1: ESSENTIAL INFO --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2">
            Essential Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Course Title"
            name="title"
            register={register}
            error={errors.title}
            placeholder="e.g. Advanced React Patterns"
          />

          <InputField
            label="Course Code"
            name="code"
            register={register}
            error={errors.code}
            placeholder="e.g. CS-101"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Category"
            name="category"
            register={register}
            error={errors.category}
            placeholder="e.g. Computer Science"
          />

           <InputField
            label="Language"
            name="language"
            register={register}
            error={errors.language}
            placeholder="e.g. English"
          />

          <InputField
            label="Level"
            name="level"
            as="select"
            register={register}
            error={errors.level}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </InputField>
        </div>

        <InputField
          label="Description"
          name="description"
          as="textarea"
          register={register}
          error={errors.description}
          placeholder="Detailed description of the course content..."
          rows={3}
        />
      </section>

      {/* --- SECTION 2: CONFIGURATION & PRICING --- */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-2">
            Settings & Pricing
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            
            <InputField
                label="Type"
                name="type"
                as="select"
                register={register}
                error={errors.type}
            >
                <option value="INSTITUTE_SPECIFIC">Institute Specific</option>
                <option value="PUBLIC">Public</option>
                <option value="PREMIUM">Premium</option>
                <option value="FREE">Free</option>
            </InputField>

            <InputField
                label="Status"
                name="status"
                as="select"
                register={register}
                error={errors.status}
            >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
                <option value="UNDER_REVIEW">Under Review</option>
            </InputField>

            <div className="relative">
                <InputField
                    label="Price (INR)"
                    name="price"
                    type="number"
                    register={register}
                    error={errors.price}
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>

            <div className="relative">
                <InputField
                    label="Discount Price"
                    name="discountPrice"
                    type="number"
                    register={register}
                    error={errors.discountPrice}
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
                <InputField
                    label="Duration (Hours)"
                    name="duration"
                    type="number"
                    register={register}
                    error={errors.duration}
                />
                <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>

             <div className="flex flex-col gap-2 justify-center">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Visibility
                </label>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md">
                    <input 
                        type="checkbox" 
                        {...register("isPublic")} 
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Make Publicly Visible</span>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 3: TARGET AUDIENCE (Multi-Select) --- */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-teal-500 pl-2 flex items-center gap-2">
            <Target className="w-4 h-4" /> Target Audience
        </h2>
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
            <div className="grid grid-cols-2 gap-3">
                {STUDENT_GOALS.map((goal) => (
                    <label key={goal.value} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-teal-100/50 rounded-md transition-colors">
                        <input 
                            type="checkbox" 
                            value={goal.value} 
                            {...register("targetAudience")} 
                            className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" 
                        />
                        <span className="text-xs font-medium text-gray-700">{goal.label}</span>
                    </label>
                ))}
            </div>
            <p className="text-[10px] text-teal-600 mt-2 italic">
                Specify who this course is designed for. This helps in recommending the course to relevant students.
            </p>
        </div>
      </section>

      {/* --- SECTION 4: ATTRIBUTES (Arrays) --- */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
         <h2 className="text-sm font-bold text-gray-900 border-l-4 border-orange-500 pl-2">
            Attributes & Tags
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags Input - Comma Separated Logic */}
            <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium uppercase">Tags (Comma separated)</label>
                <Controller
                    control={control}
                    name="tags"
                    render={({ field: { onChange, value } }) => (
                        <textarea
                             className="w-full p-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="React, Frontend, Web Dev"
                            rows={2}
                            value={Array.isArray(value) ? value.join(", ") : ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange(val ? val.split(",").map(s => s.trim()) : []);
                            }}
                        />
                    )}
                />
            </div>

            {/* Prerequisites Input - Comma Separated Logic */}
            <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium uppercase">Prerequisites (Comma separated)</label>
                <Controller
                    control={control}
                    name="prerequisites"
                    render={({ field: { onChange, value } }) => (
                        <textarea
                             className="w-full p-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Basic HTML, JavaScript Knowledge"
                            rows={2}
                            value={Array.isArray(value) ? value.join(", ") : ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange(val ? val.split(",").map(s => s.trim()) : []);
                            }}
                        />
                    )}
                />
            </div>
        </div>
      </section>

      {/* --- SECTION 5: CLASS LINKING (Multi-Select) --- */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
         <h2 className="text-sm font-bold text-gray-900 border-l-4 border-green-500 pl-2 flex items-center gap-2">
            Assign Classes <Users className="w-4 h-4 text-gray-500"/>
        </h2>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Select the classes that should have access to this course.</p>
            
            {(!relatedData?.classes || relatedData.classes.length === 0) ? (
                <div className="text-sm text-gray-500 italic">No classes available.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {relatedData.classes.map((cls) => (
                        <div key={cls.id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-blue-400 transition-colors">
                            <input
                                type="checkbox"
                                value={cls.id}
                                {...register("classIds")}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <label className="text-sm text-gray-700 truncate cursor-pointer select-none flex-1">
                                {cls.name} <span className="text-gray-400 text-xs">({cls.grade || 'N/A'})</span>
                            </label>
                        </div>
                    ))}
                </div>
            )}
            {errors.classIds && <p className="text-xs text-red-500 mt-2">{errors.classIds.message}</p>}
        </div>
      </section>

      {/* --- FOOTER ACTION --- */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 flex justify-end gap-4">
        <button 
            type="button" 
            onClick={() => setOpen(false)}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
            Cancel
        </button>
        <button
            type="submit"
            disabled={state.success} 
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
            {type === "create" ? "Create Course" : "Update Course"}
            <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}