"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StudentSchema, studentSchema } from "@/lib/formValidationSchema";
import { createStudent, updateStudent } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { User, School, BookOpen, Save, X, Target, UploadCloud } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

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

export default function StudentForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { institutes: any[]; classes: any[] };
}) {
  const router = useRouter();
  const [img, setImg] = useState<any>(data?.avatar || "");
  const [state, setState] = useState({ success: false, error: false });

  // Pre-process class IDs for update mode
  const existingClassIds = data?.classStudents
    ? data.classStudents.map((cs: any) => cs.classId)
    : [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id: data?.id,
      // User Data (Flattened)
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || "",
      phoneNumber: data?.user?.phoneNumber || "",
      password: "", // Empty for update

      avatar: data?.user?.avatar || "",

      // Student Data
      studentId: data?.studentId || "",
      instituteId: data?.instituteId || "",
      dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
      enrollmentDate: data?.enrollmentDate ? new Date(data.enrollmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      address: data?.address || "",

      goals: data?.goals || [],

      // Guardian
      guardianName: data?.guardianName || "",
      guardianPhone: data?.guardianPhone || "",
      guardianEmail: data?.guardianEmail || "",

      // Classes
      classIds: existingClassIds,
    },
  });

  useEffect(() => {
    setValue("avatar", img?.secure_url || img); // Handle both Cloudinary object and string URL
  }, [img, setValue]);

  const onSubmit = handleSubmit((formData) => {
    setState({ success: false, error: false });

    // For Update: Pass the User ID to link the update correctly
    if (type === "update" && data?.userId) {
      (formData as any).userId = data.userId;
    }

    startTransition(async () => {
      const result = await (type === "create" ? createStudent : updateStudent)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Profile ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, setOpen, router]);

  return (
    <form className="flex flex-col gap-6 h-full overflow-y-auto p-2 custom-scrollbar" onSubmit={onSubmit}>
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {type === "create" ? "Add New Student" : "Update Student Profile"}
        </h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type === 'create' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {type === 'create' ? 'Creation Mode' : 'Edit Mode'}
        </span>
      </div>

      {/* --- 1. PERSONAL INFORMATION (User Model) --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2 flex items-center gap-2">
          <User className="w-4 h-4" /> Personal Information
        </h2>
        {/* AVATAR UPLOAD */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 relative rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50">
            <Image
              src={img?.secure_url || img || "/avatar.png"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <CldUploadWidget
            uploadPreset="padhai_dunia"
            onSuccess={(result) => setImg(result.info)}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-semibold"
              >
                <UploadCloud className="w-3 h-3" /> Change Photo
              </button>
            )}
          </CldUploadWidget>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name" name="firstName" register={register} error={errors.firstName} />
          <InputField label="Last Name" name="lastName" register={register} error={errors.lastName} />

          <InputField
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
          // Read only in update mode usually to prevent ID sync issues, but can be editable
          // inputProps={{ readOnly: type === "update" }} 
          />
          <InputField label="Phone" name="phoneNumber" register={register} error={errors.phoneNumber} />

          {type === "create" && (
            <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
          )}

          <div className="md:col-span-2">
            <InputField label="Date of Birth" name="dateOfBirth" type="date" register={register} error={errors.dateOfBirth} />
          </div>
        </div>
      </section>

      {/* --- 2. ACADEMIC DETAILS (Student Model) --- */}
      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-indigo-500 pl-2 flex items-center gap-2">
          <School className="w-4 h-4" /> Academic Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Student ID / Roll No" name="studentId" register={register} error={errors.studentId} />
          <InputField label="Enrollment Date" name="enrollmentDate" type="date" register={register} error={errors.enrollmentDate} />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Institute</label>
            <select {...register("instituteId")} className="p-2 border rounded-md text-sm">
              <option value="">Select Institute</option>
              {relatedData?.institutes?.map((inst: any) => (
                <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
              ))}
            </select>
            {errors.instituteId && <span className="text-xs text-red-500">{errors.instituteId.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Assign Classes</label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50">
              {relatedData?.classes?.map((cls: any) => (
                <label key={cls.id} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" value={cls.id} {...register("classIds")} />
                  <span className="truncate">{cls.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-2 flex items-center gap-2">
          <Target className="w-4 h-4" /> Learning Goals & Interests
        </h2>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="grid grid-cols-2 gap-3">
            {STUDENT_GOALS.map((goal) => (
              <label key={goal.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={goal.value}
                  {...register("goals")}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs font-medium text-gray-700">{goal.label}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-purple-500 mt-2 italic">
            Select areas of interest to get personalized course recommendations.
          </p>
        </div>
      </section>

      {/* --- 3. GUARDIAN & CONTACT --- */}
      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-green-500 pl-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Guardian & Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Guardian Name" name="guardianName" register={register} error={errors.guardianName} />
          <InputField label="Guardian Phone" name="guardianPhone" register={register} error={errors.guardianPhone} />
          <InputField label="Guardian Email" name="guardianEmail" register={register} error={errors.guardianEmail} />
        </div>
        <InputField label="Address" name="address" as="textarea" register={register} error={errors.address} rows={2} />
      </section>

      {/* --- FOOTER --- */}
      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          type="submit"
          disabled={state.success}
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          {type === "create" ? "Create Student" : "Save Changes"}
          <Save className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}