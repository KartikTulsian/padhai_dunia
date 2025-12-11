"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InstituteAdminSchema, instituteAdminSchema } from "@/lib/formValidationSchema";
import { createInstituteAdmin, updateInstituteAdmin } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { UserCog, Building, Save, X } from "lucide-react";

export default function InstituteAdminForm({
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
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstituteAdminSchema>({
    resolver: zodResolver(instituteAdminSchema),
    defaultValues: {
      id: data?.id,
      userId: data?.userId || "", 
      
      // User Details
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || "",
      // Ensure we map User.phoneNumber to the form's phoneNumber field
      phoneNumber: data?.user?.phoneNumber || "", 
      
      password: "", 
      instituteId: data?.instituteId || "",
      isCreator: data?.isCreator || false,
    },
  });

  const onSubmit = handleSubmit((formData) => {
    setState({ success: false, error: false });
    // Pass hidden userId for updates to ensure the User record is found
    if (type === "update" && data?.user?.id) {
        (formData as any).userId = data.user.id;
    }

    startTransition(async () => {
      const result = await (type === "create" ? createInstituteAdmin : updateInstituteAdmin)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Admin ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
        toast.error("Something went wrong!");
    }
  }, [state, type, setOpen, router]);

  return (
    <form className="flex flex-col gap-6 h-full overflow-y-auto p-4 custom-scrollbar bg-gray-50" onSubmit={onSubmit}>
      <div className="flex items-center justify-between border-b pb-4 sticky top-0 bg-white z-10 px-2 rounded-t-xl">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-purple-600" />
          {type === "create" ? "Add Institute Admin" : "Update Admin"}
        </h1>
      </div>

      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-2 mb-4">User Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name" name="firstName" register={register} error={errors.firstName} />
          <InputField label="Last Name" name="lastName" register={register} error={errors.lastName} />
          <InputField label="Email" name="email" type="email" register={register} error={errors.email} />
          <InputField label="Phone" name="phoneNumber" register={register} error={errors.phoneNumber} />
          {type === "create" && (
             <div className="md:col-span-2">
                <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
             </div>
          )}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2 mb-4 flex items-center gap-2"><Building className="w-4 h-4"/> Assignment</h2>
        <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 font-medium">Select Institute</label>
            <select {...register("instituteId")} className="p-2 border rounded-md text-sm w-full">
                <option value="">-- Select Institute --</option>
                {relatedData?.institutes?.map((inst: any) => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                ))}
            </select>
            {errors.instituteId && <span className="text-red-500 text-xs">{errors.instituteId.message}</span>}
        </div>
      </section>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 flex justify-end gap-4 rounded-b-xl">
        <button type="button" onClick={() => setOpen(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={state.success} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2">Save <Save className="w-4 h-4" /></button>
      </div>
    </form>
  );
}