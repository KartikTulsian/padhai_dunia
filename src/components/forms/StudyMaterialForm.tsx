"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StudyMaterialSchema, studyMaterialSchema } from "@/lib/formValidationSchema";
import { createStudyMaterial, updateStudyMaterial } from "@/lib/actions";
import { Dispatch, startTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { CldUploadWidget } from "next-cloudinary";
import { 
  FileText, UploadCloud, Save, X, File, Video, Link as LinkIcon, CheckCircle 
} from "lucide-react";

export default function StudyMaterialForm({
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
  const [fileUrl, setFileUrl] = useState<string>(data?.fileUrl || "");
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudyMaterialSchema>({
    resolver: zodResolver(studyMaterialSchema),
    defaultValues: {
      material_id: data?.id,
      courseId: data?.courseId || relatedData?.courseId || "",
      title: data?.title || "",
      description: data?.description || "",
      type: data?.type || "PDF",
      fileUrl: data?.fileUrl || "",
      fileSize: data?.fileSize || undefined,
      isPublic: data?.isPublic || false,
    },
  });

  // Update form value when fileUrl state changes from upload widget
  useEffect(() => {
    if (fileUrl) {
        setValue("fileUrl", fileUrl);
    }
  }, [fileUrl, setValue]);

  const onSubmit = handleSubmit((formData) => {
    setState({ success: false, error: false });
    
    // Ensure file URL is present
    if (!formData.fileUrl) {
        toast.error("Please upload a file or provide a link.");
        return;
    }

    startTransition(async () => {
      const result = await (type === "create" ? createStudyMaterial : updateStudyMaterial)(
        { success: false, error: false },
        formData
      );
      setState(result);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Study Material ${type === "create" ? "added" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, setOpen, router]);

  return (
    <form className="flex flex-col gap-6 p-4 h-full overflow-y-auto custom-scrollbar" onSubmit={onSubmit}>
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          {type === "create" ? "Add Study Material" : "Edit Material"}
        </h1>
      </div>

      <div className="space-y-4">
        
        {/* Hidden Course ID */}
        <input type="hidden" {...register("courseId")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title" name="title" register={register} error={errors.title} placeholder="e.g. Chapter 1 Notes" />
            
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Type</label>
                <select {...register("type")} className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video</option>
                    <option value="DOCUMENT">Word Document</option>
                    <option value="PRESENTATION">Presentation (PPT)</option>
                    <option value="EBOOK">E-Book</option>
                    <option value="LINK">External Link</option>
                </select>
                {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
            </div>
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Description</label>
            <textarea 
                {...register("description")} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                placeholder="Brief description of this resource..."
            />
        </div>

        {/* FILE UPLOAD SECTION */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="text-xs text-gray-500 font-medium mb-2 block">Resource Content</label>
            
            <div className="flex flex-col gap-3">
                {/* Cloudinary Widget */}
                <CldUploadWidget
                    uploadPreset="padhai_dunia"
                    options={{
                        resourceType: "auto",
                        clientAllowedFormats: ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "jpg", "png"],
                        maxFileSize: 100000000, // 100MB
                    }}
                    onSuccess={(result: any) => {
                        setFileUrl(result.info.secure_url);
                        setValue("fileSize", result.info.bytes); // Optional: Capture size
                        // toast.success("File uploaded successfully!");
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-blue-400 transition-all text-sm text-gray-600 w-full"
                        >
                            <UploadCloud className="w-5 h-5 text-blue-500" />
                            <span>Upload File (PDF, Video, Doc)</span>
                        </button>
                    )}
                </CldUploadWidget>

                <div className="text-center text-xs text-gray-400 font-medium">- OR -</div>

                {/* Direct Link Input */}
                <div className="relative">
                    <InputField 
                        label="Direct Link URL (if not uploading)" 
                        name="fileUrl" 
                        register={register} 
                        error={errors.fileUrl} 
                        placeholder="https://drive.google.com/..." 
                        // Note: If using uncontrolled input via InputField, ensure it syncs with React Hook Form
                    />
                    <LinkIcon className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
                </div>

                {/* Preview of selected file */}
                {fileUrl && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100 flex items-center gap-2 text-xs text-blue-700 break-all">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Selected: <span className="font-mono">{fileUrl}</span>
                    </div>
                )}
            </div>
        </div>

        {/* VISIBILITY */}
        <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("isPublic")} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label className="text-sm text-gray-700">Make Public (Visible to non-enrolled students)</label>
        </div>

      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 mt-auto">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
        <button type="submit" disabled={state.success} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all">
            {type === "create" ? "Add Material" : "Save Changes"}
            <Save className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}