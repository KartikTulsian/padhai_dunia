"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InstituteSchema, instituteSchema } from "@/lib/formValidationSchema";
import { createInstitute, updateInstitute } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { Building2, MapPin, Save, X, UserPlus, Settings, UploadCloud } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

export default function InstituteForm({
  type,
  data,
  setOpen,
  relatedData, // Added relatedData here
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: { users?: any[] }; // Defined type for relatedData
}) {
  const router = useRouter();
  const [img, setImg] = useState<any>(data?.avatar || "");
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InstituteSchema>({
    resolver: zodResolver(instituteSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name || "",
      code: data?.code || "",
      type: data?.type || "SCHOOL",
      status: data?.status || "PENDING_APPROVAL",

      logo: data?.logo || "",

      contactEmail: data?.contactEmail || "",
      contactPhone: data?.contactPhone || "",
      website: data?.website || "",
      description: data?.description || "",
      address: data?.address || "",
      city: data?.city || "",
      state: data?.state || "",
      country: data?.country || "India",
      zipCode: data?.zipCode || "",
      settings: data?.settings ? JSON.stringify(data.settings, null, 2) : "{}",
      adminId: "", // Default empty
    },
  });

  useEffect(() => {
    setValue("logo", img?.secure_url || img); // Handle both Cloudinary object and string URL
  }, [img, setValue]);

  const onSubmit = handleSubmit((formData) => {
    setState({ success: false, error: false });
    startTransition(async () => {
      const result = await (type === "create" ? createInstitute : updateInstitute)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Institute ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
        toast.error("Something went wrong!");
    }
  }, [state, type, setOpen, router]);

  return (
    <form className="flex flex-col gap-6 h-full overflow-y-auto p-4 custom-scrollbar bg-gray-50" onSubmit={onSubmit}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 sticky top-0 bg-white z-10 px-2 rounded-t-xl">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          {type === "create" ? "Register Institute" : "Update Institute"}
        </h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${type === 'create' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {type === 'create' ? 'Creation Mode' : 'Edit Mode'}
        </span>
      </div>

      {/* --- SECTION 1: INSTITUTE INFO --- */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2 mb-4">Basic Details</h2>

        {/* AVATAR UPLOAD */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 relative rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50">
            <Image
              src={img?.secure_url || img || "/avatar.png"}
              alt="Logo"
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
          <InputField label="Institute Name" name="name" register={register} error={errors.name} />
          <InputField label="Institute Code" name="code" register={register} error={errors.code} />
          <div className="flex flex-col gap-1">
             <label className="text-xs text-gray-500">Type</label>
             <select {...register("type")} className="p-2 border rounded-md text-sm">
                <option value="SCHOOL">School</option>
                <option value="COLLEGE">College</option>
                <option value="COACHING_CENTER">Coaching Center</option>
                <option value="UNIVERSITY">University</option>
             </select>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-xs text-gray-500">Status</label>
             <select {...register("status")} className="p-2 border rounded-md text-sm">
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
             </select>
          </div>
        </div>
        <div className="mt-4"><InputField label="Description" name="description" as="textarea" register={register} error={errors.description} rows={2} /></div>
      </section>

      {/* --- SECTION 2: CONTACT & ADDRESS --- */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-orange-500 pl-2 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4"/> Contact & Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Email" name="contactEmail" type="email" register={register} error={errors.contactEmail} />
            <InputField label="Phone" name="contactPhone" register={register} error={errors.contactPhone} />
            <div className="md:col-span-2"><InputField label="Website" name="website" register={register} error={errors.website} /></div>
            <div className="md:col-span-2"><InputField label="Address" name="address" register={register} error={errors.address} /></div>
            <InputField label="City" name="city" register={register} error={errors.city} />
            <InputField label="State" name="state" register={register} error={errors.state} />
            <InputField label="Country" name="country" register={register} error={errors.country} defaultValue="India" />
            <InputField label="Zip" name="zipCode" register={register} error={errors.zipCode} />
        </div>
      </section>

      {/* --- SECTION 3: ASSIGN ADMIN (Only visible in Create Mode) --- */}
      {type === "create" && (
        <section className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
            <h2 className="text-sm font-bold text-purple-900 border-l-4 border-purple-500 pl-2 mb-4 flex items-center gap-2">
                <UserPlus className="w-4 h-4"/> Initial Administrator
            </h2>
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-medium">Select a User to manage this Institute</label>
                <select {...register("adminId")} className="p-2 border rounded-md text-sm w-full bg-white focus:ring-2 focus:ring-purple-500">
                    <option value="">-- Select User (Optional) --</option>
                    {relatedData?.users?.map((u: any) => (
                        <option key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} ({u.email})
                        </option>
                    ))}
                </select>
                <p className="text-[10px] text-gray-500">This user will be assigned the 'Institute' role immediately.</p>
            </div>
        </section>
      )}

      {/* --- SECTION 4: SETTINGS --- */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-gray-500 pl-2 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4"/> Settings
        </h2>
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Configuration (JSON)</label>
            <textarea 
                {...register("settings")} 
                className="w-full p-2 border rounded-md text-xs font-mono h-24 bg-gray-50 focus:ring-2 focus:ring-gray-400 outline-none"
                placeholder='{"theme": "light", "allowRegistration": true}'
            />
        </div>
      </section>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 flex justify-end gap-4 rounded-b-xl">
        <button type="button" onClick={() => setOpen(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={state.success} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">Save <Save className="w-4 h-4" /></button>
      </div>
    </form>
  );
}