"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { classSchema, ClassSchema } from "@/lib/formValidationSchema";
import { createClass, updateClass } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { School, CheckCircle } from "lucide-react";

// Reusable Input Component
const InputField = ({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  as = "input",
  children,
  ...props
}: any) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </label>
      {as === "select" ? (
        <select
          {...register(name, { valueAsNumber: type === "number" })}
          className={`ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            error ? "ring-red-400" : ""
          }`}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          {...register(name, { valueAsNumber: type === "number" })}
          className={`ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            error ? "ring-red-400" : ""
          }`}
          placeholder={placeholder}
          {...props}
        />
      )}
      {error?.message && (
        <p className="text-xs text-red-500 mt-1 font-medium">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default function ClassForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { institutes: any[]; teachers: any[] };
}) {
  const router = useRouter();
  const [state, setState] = useState({ success: false, error: false });
  
  // Initialize filtered teachers immediately if data exists to prevent "blank" initial state
  const getInitialTeachers = () => {
    if (data?.instituteId && relatedData?.teachers) {
        return relatedData.teachers.filter((t: any) => t.instituteId === data.instituteId);
    }
    return [];
  };

  const [filteredTeachers, setFilteredTeachers] = useState<any[]>(getInitialTeachers());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name || "",
      grade: data?.grade || "",
      section: data?.section || "",
      capacity: data?.capacity || 30,
      academicYear: data?.academicYear || "",
      instituteId: data?.instituteId || "",
      supervisorId: data?.supervisorId || "",
    },
  });

  const selectedInstituteId = watch("instituteId");

  // Filter teachers whenever institute selection changes
  useEffect(() => {
    if (!selectedInstituteId) {
      setFilteredTeachers([]);
      return;
    }

    const filtered = (relatedData?.teachers ?? []).filter(
      (t: any) => t.instituteId === selectedInstituteId
    );
    setFilteredTeachers(filtered);
    
    // If the institute changed and the current supervisor isn't in the new list, clear the supervisor
    if (data?.instituteId !== selectedInstituteId) {
        // Optional: Reset supervisor if user changes institute manually
        // setValue("supervisorId", ""); 
    }
  }, [selectedInstituteId, relatedData, data?.instituteId, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    setState({ success: false, error: false });

    // Explicitly add ID for updates
    const payload = {
      ...formData,
      id: type === "update" ? data?.id : undefined,
    };

    startTransition(async () => {
      const result = await (type === "create" ? createClass : updateClass)(
        { success: false, error: false },
        payload
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Class ${type === "create" ? "created" : "updated"} successfully!`
      );
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, setOpen, router, type]);

  return (
    <form
      className="flex flex-col gap-8 h-full overflow-y-auto p-2 custom-scrollbar"
      onSubmit={onSubmit}
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <School className="w-6 h-6 text-blue-600" />
          {type === "create" ? "Create New Class" : "Update Class Details"}
        </h1>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
            type === "create" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"
        }`}>
          {type === "create" ? "Draft Mode" : "Edit Mode"}
        </span>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2">
          Basic Information
        </h2>

        <InputField
          label="Class Name"
          name="name"
          register={register}
          error={errors.name}
          placeholder="e.g. 10 A"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Grade" name="grade" as="select" register={register} error={errors.grade}>
            <option value="">Select Grade</option>
            {[
              "GRADE_1", "GRADE_2", "GRADE_3", "GRADE_4", "GRADE_5", "GRADE_6", "GRADE_7",
              "GRADE_8", "GRADE_9", "GRADE_10", "GRADE_11", "GRADE_12",
              "UNDERGRADUATE", "POSTGRADUATE", "OTHER"
            ].map((g) => (
              <option key={g} value={g}>{g.replace("_", " ")}</option>
            ))}
          </InputField>

          <InputField
            label="Section"
            name="section"
            register={register}
            placeholder="e.g. A / B / C"
            error={errors.section}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
            label="Capacity"
            name="capacity"
            type="number"
            register={register}
            error={errors.capacity}
            placeholder="e.g. 50"
            />

            <InputField
            label="Academic Year"
            name="academicYear"
            register={register}
            error={errors.academicYear}
            placeholder="e.g. 2024/25"
            />
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-2">
          Institute & Teacher Assignment
        </h2>

        <InputField
          label="Institute"
          name="instituteId"
          as="select"
          register={register}
          error={errors.instituteId}
        >
          <option value="">Select Institute</option>
          {relatedData?.institutes?.map((inst: any) => (
            <option key={inst.id} value={inst.id}>{inst.name}</option>
          ))}
        </InputField>

        <InputField
          label="Supervisor (Class Teacher)"
          name="supervisorId"
          as="select"
          register={register}
          error={errors.supervisorId}
          disabled={!selectedInstituteId} // Disable if no institute selected
        >
          <option value="">Select Supervisor</option>
          {filteredTeachers.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.user.firstName} {t.user.lastName}
            </option>
          ))}
        </InputField>
      </section>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-4">
        <button type="button" onClick={() => setOpen(false)} className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          {type === "create" ? "Create Class" : "Update Class"}
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}