"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TeacherSchema, teacherSchema } from "@/lib/formValidationSchema";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { User, Briefcase, GraduationCap, Save, X, UploadCloud } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

export default function TeacherForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { institutes: any[] };
}) {
  const router = useRouter();
  const [img, setImg] = useState<any>(data?.avatar || "");
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      id: data?.id,
      // User Data
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || "",
      phoneNumber: data?.user?.phoneNumber || "",
      password: "", // Empty for update

      avatar: data?.user?.avatar || "",

      // Teacher Data
      teacherId: data?.teacherId || "",
      instituteId: data?.instituteId || "",
      // Join array to string for display in input
      subjects: data?.subjects ? data.subjects.join(", ") : "",
      qualification: data?.qualification || "",
      experience: data?.experience || 0,
      specialization: data?.specialization || "",
      bio: data?.bio || "",
      isVerified: data?.isVerified || false,
      joinDate: data?.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
      const result = await (type === "create" ? createTeacher : updateTeacher)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Teacher ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, type, setOpen, router]);

  return (
    <form className="flex flex-col gap-6 h-full overflow-y-auto p-2 custom-scrollbar" onSubmit={onSubmit}>
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {type === "create" ? "Add New Teacher" : "Update Teacher Profile"}
        </h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type === 'create' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {type === 'create' ? 'Creation Mode' : 'Edit Mode'}
        </span>
      </div>

      {/* --- 1. PERSONAL INFORMATION --- */}
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

          <InputField label="Email" name="email" type="email" register={register} error={errors.email} />
          <InputField label="Phone" name="phoneNumber" register={register} error={errors.phoneNumber} />

          {type === "create" && (
            <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
          )}

          <InputField label="Join Date" name="joinDate" type="date" register={register} error={errors.joinDate} />
        </div>
      </section>

      {/* --- 2. PROFESSIONAL DETAILS --- */}
      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Professional Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Teacher ID / Emp ID" name="teacherId" register={register} error={errors.teacherId} />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Institute</label>
            <select {...register("instituteId")} className="p-2 border rounded-md text-sm">
              <option value="">Select Institute</option>
              {relatedData?.institutes?.map((inst: any) => (
                <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400">Leave empty if independent/platform teacher</p>
            {errors.instituteId && <span className="text-xs text-red-500">{errors.instituteId.message}</span>}
          </div>

          <div className="md:col-span-2">
            <InputField label="Subjects (Comma Separated)" name="subjects" register={register} error={errors.subjects} placeholder="Maths, Physics, Chemistry" />
          </div>
        </div>
      </section>

      {/* --- 3. QUALIFICATION & BIO --- */}
      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-orange-500 pl-2 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Qualification & Bio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Qualification" name="qualification" register={register} error={errors.qualification} placeholder="e.g. M.Sc, B.Ed" />
          <InputField label="Specialization" name="specialization" register={register} error={errors.specialization} placeholder="e.g. Quantum Mechanics" />
          <InputField label="Experience (Years)" name="experience" type="number" register={register} error={errors.experience} />
        </div>
        <InputField label="Bio" name="bio" as="textarea" register={register} error={errors.bio} rows={3} placeholder="Brief introduction..." />

        <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded border">
          <input type="checkbox" {...register("isVerified")} className="w-4 h-4 text-blue-600 rounded" />
          <label className="text-sm text-gray-700 font-medium">Verify this teacher profile manually</label>
        </div>
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
          {type === "create" ? "Create Teacher" : "Save Changes"}
          <Save className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}