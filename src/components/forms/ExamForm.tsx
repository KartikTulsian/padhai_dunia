"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ExamSchema, examSchema } from "@/lib/formValidationSchema";
import { createExam, updateExam } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Calendar, Clock, Award, FileText, CheckCircle } from "lucide-react";
import InputField from "../InputField";

export default function ExamForm({
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
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      courseId: data?.courseId || "",
      teacherId: data?.teacherId || "",
      type: data?.type || "MIDTERM",
      // Ensure date format is YYYY-MM-DDTHH:mm for datetime-local input
      scheduledAt: data?.scheduledAt
        ? new Date(data.scheduledAt).toISOString().slice(0, 16)
        : "",
      duration: data?.duration || 60,
      totalMarks: data?.totalMarks || 100,
      passingMarks: data?.passingMarks || 40,
      instructions: data?.instructions || "",
      isPublished: data?.isPublished || false,
      questions: data?.questions?.map((q: any) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        marks: q.marks,
        // Ensure options is an array
        options: Array.isArray(q.options) ? q.options : [], 
        correctAnswer: q.correctAnswer || "",
      })) || [],
      exam_id: data?.id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = handleSubmit(async (formData) => {
    setState({ success: false, error: false });

    // Ensure we are passing the correct ID for updates
    if (type === "update" && data?.id) {
        formData.exam_id = data.id;
    }

    startTransition(async () => {
      const result = await (type === "create" ? createExam : updateExam)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Exam ${type === "create" ? "created" : "updated"} successfully!`);
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
          <FileText className="w-6 h-6 text-blue-600" />
          {type === "create" ? "Create New Exam" : "Update Exam Details"}
        </h1>
        <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-semibold border border-blue-100">
            {type === "create" ? "Draft Mode" : "Edit Mode"}
        </span>
      </div>

      {/* --- SECTION 1: BASIC INFO --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2">
            Basic Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Exam Title"
            name="title"
            register={register}
            error={errors.title}
            placeholder="e.g. Midterm Physics 2025"
          />

          <InputField
            label="Exam Type"
            name="type"
            as="select"
            register={register}
            error={errors.type}
          >
            <option value="MIDTERM">Midterm</option>
            <option value="FINAL">Final</option>
            <option value="UNIT_TEST">Unit Test</option>
            <option value="MOCK_TEST">Mock Test</option>
            <option value="PRACTICE_TEST">Practice Test</option>
          </InputField>
        </div>

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

        <InputField
          label="Description / Abstract"
          name="description"
          as="textarea"
          register={register}
          error={errors.description}
          placeholder="Brief summary of what this exam covers..."
          rows={3}
        />
      </section>

      {/* --- SECTION 2: CONFIGURATION --- */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-2">
            Configuration & Timing
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="relative">
                <InputField
                    label="Scheduled Date"
                    name="scheduledAt"
                    type="datetime-local"
                    register={register}
                    error={errors.scheduledAt}
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
            </div>

            <div className="relative">
                <InputField
                    label="Duration (Min)"
                    name="duration"
                    type="number"
                    register={register}
                    error={errors.duration}
                />
                <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                label="Passing Marks"
                name="passingMarks"
                type="number"
                register={register}
                error={errors.passingMarks}
            />
             <div className="flex flex-col gap-2 justify-center">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Visibility
                </label>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md">
                    <input 
                        type="checkbox" 
                        {...register("isPublished")} 
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                </div>
            </div>
        </div>

        <InputField
          label="Instructions for Students"
          name="instructions"
          as="textarea"
          register={register}
          placeholder="e.g. No calculators allowed. All questions are compulsory."
        />
      </section>

      {/* --- SECTION 3: QUESTIONS BUILDER --- */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 border-l-4 border-green-500 pl-2">
                Questions Builder
            </h2>
            <button
                type="button"
                onClick={() =>
                    append({
                        questionText: "",
                        questionType: "MCQ",
                        marks: 1,
                        options: [],
                        correctAnswer: "",
                    })
                }
                className="flex items-center gap-1 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors border border-green-200"
            >
                <Plus className="w-4 h-4" /> Add Question
            </button>
        </div>

        {fields.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                No questions added yet. Click "Add Question" to start building your exam.
            </div>
        )}

        <div className="space-y-6">
          {fields.map((field, index) => {
            const qType = watch(`questions.${index}.questionType`);
            return (
              <div
                key={field.id}
                className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Header of Question Card */}
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                        Q{index + 1}
                    </span>
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <InputField
                      label="Question Text"
                      name={`questions.${index}.questionText`}
                      register={register}
                      error={errors.questions?.[index]?.questionText}
                      placeholder="Enter the question..."
                    />
                  </div>
                  <div className="md:col-span-1">
                    <InputField
                      label="Marks"
                      name={`questions.${index}.marks`}
                      type="number"
                      register={register}
                      error={errors.questions?.[index]?.marks}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Question Type"
                    name={`questions.${index}.questionType`}
                    as="select"
                    register={register}
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                    <option value="ESSAY">Essay</option>
                  </InputField>

                  {/* Conditional Rendering based on Type */}
                  {(qType === "MCQ") && (
                    <div className="md:col-span-2 space-y-3 p-4 bg-gray-50 rounded-lg">
                        <label className="text-xs text-gray-500 font-medium uppercase">
                            Options (Comma separated)
                        </label>
                        <Controller
                            control={control}
                            name={`questions.${index}.options`}
                            render={({ field: { onChange, value } }) => (
                                <textarea
                                    className="w-full p-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Option A, Option B, Option C, Option D"
                                    rows={2}
                                    // Join array to string for display
                                    value={Array.isArray(value) ? value.join(", ") : ""}
                                    // Split string to array for state
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        onChange(val ? val.split(",").map(s => s.trim()) : []);
                                    }}
                                />
                            )}
                        />
                        <p className="text-[10px] text-gray-400">
                            Example: "Red, Blue, Green, Yellow" will create 4 selectable options.
                        </p>
                    </div>
                  )}

                  {(qType === "MCQ" || qType === "TRUE_FALSE") && (
                    <div className="md:col-span-2">
                        <InputField
                            label="Correct Answer (Exact Match)"
                            name={`questions.${index}.correctAnswer`}
                            register={register}
                            error={errors.questions?.[index]?.correctAnswer}
                            placeholder={qType === "TRUE_FALSE" ? "TRUE or FALSE" : "Enter the correct option text"}
                        />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
            disabled={state.success} // Simplified loading state logic
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
            {type === "create" ? "Create Exam" : "Update Changes"}
            <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}