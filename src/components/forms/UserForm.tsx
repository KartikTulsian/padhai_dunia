"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingSchema } from "@/lib/formValidationSchema";
import { completeOnboarding } from "@/lib/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import InputField from "../InputField"; 
import { 
  Building2, 
  GraduationCap, 
  User, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Info,
  Briefcase,
  School,
  Target
} from "lucide-react";

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

export default function UserForm({ institutes }: { institutes: { id: string; name: string; code: string }[] }) {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: user?.primaryEmailAddress?.emailAddress || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: "", 
      role: undefined,
      instituteMode: "join",
      goals: [],
    },
  });

  const selectedRole = watch("role");
  const instituteMode = watch("instituteMode");

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await completeOnboarding({ success: false, error: false }, data);
      
      if (result.success) {
        toast.success("Profile created successfully!");
        router.refresh();
        
        setTimeout(() => {
            if (data.role === "institute") router.push("/institute"); 
            else if (data.role === "teacher") router.push("/teacher");
            else if (data.role === "student") router.push("/student");
        }, 1500);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-t-3xl p-8 pb-6 border-b border-gray-100 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Your Profile</h1>
          <p className="text-gray-500 max-w-md">
            Please provide your details to personalize your experience on Padhai Dunia.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-b-3xl shadow-xl border border-t-0 border-gray-100 overflow-hidden">
        <div className="p-8 space-y-10">
          
          {/* --- SECTION 1: PERSONAL INFO --- */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" name="firstName" register={register} error={errors.firstName} />
              <InputField label="Last Name" name="lastName" register={register} error={errors.lastName} />
              
              <div className="relative group">
                 <label className="text-xs font-semibold text-gray-500 mb-1 block">Email (Read Only)</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                      {...register("email")} 
                      readOnly 
                      className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm focus:outline-none cursor-lock" 
                    />
                 </div>
              </div>

              <div className="relative">
                 <div className="relative">
                    {/* Placeholder for icon if InputField doesn't support it directly, otherwise pass icon prop if available */}
                    <InputField label="Phone Number" name="phoneNumber" register={register} error={errors.phoneNumber} placeholder="+91 98765 43210" />
                 </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* --- SECTION 2: ROLE SELECTION --- */}
          <section>
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-6">I am joining as a...</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Role Card: Institute */}
              <label className={`relative group flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${selectedRole === "institute" ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'}`}>
                <input type="radio" value="institute" {...register("role")} className="hidden" />
                <div className={`p-3 rounded-full mb-3 transition-colors ${selectedRole === "institute" ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <span className={`font-bold text-base ${selectedRole === "institute" ? 'text-indigo-900' : 'text-gray-700'}`}>Institute</span>
                <span className="text-xs text-center text-gray-500 mt-1">Schools, Colleges & Coaching</span>
                {selectedRole === "institute" && <div className="absolute top-3 right-3 text-indigo-600"><CheckCircle2 className="w-5 h-5 fill-indigo-100" /></div>}
              </label>

              {/* Role Card: Teacher */}
              <label className={`relative group flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${selectedRole === "teacher" ? 'border-purple-600 bg-purple-50/50 shadow-md ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'}`}>
                <input type="radio" value="teacher" {...register("role")} className="hidden" />
                <div className={`p-3 rounded-full mb-3 transition-colors ${selectedRole === "teacher" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'}`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className={`font-bold text-base ${selectedRole === "teacher" ? 'text-purple-900' : 'text-gray-700'}`}>Teacher</span>
                <span className="text-xs text-center text-gray-500 mt-1">Educators & Tutors</span>
                {selectedRole === "teacher" && <div className="absolute top-3 right-3 text-purple-600"><CheckCircle2 className="w-5 h-5 fill-purple-100" /></div>}
              </label>

              {/* Role Card: Student */}
              <label className={`relative group flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out ${selectedRole === "student" ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
                <input type="radio" value="student" {...register("role")} className="hidden" />
                <div className={`p-3 rounded-full mb-3 transition-colors ${selectedRole === "student" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className={`font-bold text-base ${selectedRole === "student" ? 'text-blue-900' : 'text-gray-700'}`}>Student</span>
                <span className="text-xs text-center text-gray-500 mt-1">Learners & Scholars</span>
                {selectedRole === "student" && <div className="absolute top-3 right-3 text-blue-500"><CheckCircle2 className="w-5 h-5 fill-blue-100" /></div>}
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-sm text-center mt-2 font-medium bg-red-50 py-1 rounded">{errors.role.message}</p>}
          </section>

          {/* --- SECTION 3: DYNAMIC FORMS --- */}
          <div className="min-h-[200px]"> {/* Height placeholder to reduce layout shift */}
            
            {/* === INSTITUTE FORM === */}
            {selectedRole === "institute" && (
              <div className="bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
                 <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex justify-center">
                    {/* Toggle Switch */}
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                        <label className={`px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all ${instituteMode === 'join' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <input type="radio" value="join" {...register("instituteMode")} className="hidden" />
                            Join Existing
                        </label>
                        <label className={`px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all ${instituteMode === 'create' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <input type="radio" value="create" {...register("instituteMode")} className="hidden" />
                            Create New
                        </label>
                    </div>
                 </div>

                 <div className="p-6 md:p-8 space-y-6">
                   {instituteMode === "create" ? (
                      <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InputField label="Institute Name" name="instituteName" register={register} error={errors.instituteName} placeholder="e.g. Springfield High" />
                              <InputField label="Institute Code (Unique)" name="instituteCode" register={register} error={errors.instituteCode} placeholder="e.g. SPRING-001" />
                              <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                                  <select {...register("instituteType")} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                      <option value="SCHOOL">School</option>
                                      <option value="COLLEGE">College</option>
                                      <option value="COACHING_CENTER">Coaching Center</option>
                                      <option value="UNIVERSITY">University</option>
                                  </select>
                                  {errors.instituteType && <span className="text-red-500 text-xs">{errors.instituteType.message}</span>}
                              </div>
                              <InputField label="Contact Email" name="instituteContactEmail" register={register} error={errors.instituteContactEmail} />
                          </div>
                          
                          {/* Divider */}
                          <div className="relative py-2">
                              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                              <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-gray-400 uppercase tracking-widest">Details</span></div>
                          </div>

                          <InputField label="Description / About" name="instituteDescription" as="textarea" register={register} error={errors.instituteDescription} rows={2} placeholder="Tell us about your institute..." />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InputField label="Website" name="instituteWebsite" register={register} error={errors.instituteWebsite} placeholder="https://..." />
                              <InputField label="Street Address" name="instituteAddress" register={register} error={errors.instituteAddress} />
                              <InputField label="City" name="instituteCity" register={register} error={errors.instituteCity} />
                              <div className="grid grid-cols-2 gap-4">
                                  <InputField label="State" name="instituteState" register={register} error={errors.instituteState} />
                                  <InputField label="Zip Code" name="instituteZip" register={register} error={errors.instituteZip} />
                              </div>
                          </div>
                      </>
                   ) : (
                      <div className="max-w-md mx-auto py-8">
                         <div className="bg-blue-50 p-4 rounded-xl mb-6 flex gap-3 items-start border border-blue-100">
                            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">Select your institute from the list. If you don't see it, ask your administrator for the correct code or create a new one.</p>
                         </div>
                         <div className="flex flex-col gap-2">
                             <label className="text-sm font-bold text-gray-700">Search & Select Institute</label>
                             <select {...register("selectedInstituteId")} className="w-full p-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
                                <option value="">-- Select Institute --</option>
                                {institutes.map((inst) => (
                                  <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                                ))}
                             </select>
                             {errors.selectedInstituteId && <span className="text-red-500 text-xs font-medium">{errors.selectedInstituteId.message}</span>}
                         </div>
                      </div>
                   )}
                 </div>
              </div>
            )}

            {/* === STUDENT FORM === */}
            {selectedRole === "student" && (
              <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                      <School className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900">Student Enrollment</h3>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-1.5">
                             <label className="text-xs font-semibold text-gray-500 uppercase">Select Institute</label>
                             <select {...register("selectedInstituteId")} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <option value="">-- Choose Institute --</option>
                                {institutes.map((inst) => (
                                  <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                                ))}
                             </select>
                             {errors.selectedInstituteId && <span className="text-red-500 text-xs">{errors.selectedInstituteId.message}</span>}
                          </div>
                          <InputField label="Student ID / Roll No" name="studentId" register={register} error={errors.studentId} />
                          <InputField label="Date of Birth" name="dateOfBirth" type="date" register={register} error={errors.dateOfBirth} />
                          <InputField label="Home Address" name="studentAddress" register={register} error={errors.studentAddress} />
                      </div>
                      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                          <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                              <Target className="w-4 h-4 text-indigo-600" /> Learning Goals
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {STUDENT_GOALS.map((goal) => (
                                <label key={goal.value} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors">
                                    <input 
                                      type="checkbox" 
                                      value={goal.value} 
                                      {...register("goals")} 
                                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
                                    />
                                    <span className="text-xs font-medium text-gray-700">{goal.label}</span>
                                </label>
                              ))}
                          </div>
                          <p className="text-[10px] text-indigo-500 mt-2">Select all that apply. This helps us recommend the right courses.</p>
                      </div>

                      {/* Guardian Info Section */}
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" /> Guardian / Parent Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <InputField label="Name" name="guardianName" register={register} error={errors.guardianName} />
                              <InputField label="Phone" name="guardianPhone" register={register} error={errors.guardianPhone} />
                              <InputField label="Email" name="guardianEmail" register={register} error={errors.guardianEmail} />
                          </div>
                      </div>
                  </div>
              </div>
            )}

            {/* === TEACHER FORM === */}
            {selectedRole === "teacher" && (
              <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-purple-50/50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-purple-900">Teacher Professional Profile</h3>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField label="Teacher ID / License" name="teacherId" register={register} error={errors.teacherId} placeholder="Emp-ID or License No." />
                          <div className="flex flex-col gap-1.5">
                             <label className="text-xs font-semibold text-gray-500 uppercase">Affiliated Institute</label>
                             <select {...register("selectedInstituteId")} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                                <option value="">-- Platform Teacher (No Institute) --</option>
                                {institutes.map((inst) => (
                                  <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                                ))}
                             </select>
                             <p className="text-[10px] text-gray-400">Leave empty for independent tutor.</p>
                          </div>
                          
                          <InputField label="Subjects (Comma separated)" name="subjects" register={register} error={errors.subjects} placeholder="Maths, Physics, Chemistry" />
                          <InputField label="Experience (Years)" name="experience" type="number" register={register} error={errors.experience} />
                          <InputField label="Qualification" name="qualification" register={register} error={errors.qualification} placeholder="e.g. M.Sc Physics, B.Ed" />
                          <InputField label="Specialization" name="specialization" register={register} error={errors.specialization} placeholder="e.g. Quantum Mechanics" />
                          
                          <div className="md:col-span-2">
                             <InputField label="Professional Bio" name="bio" as="textarea" register={register} error={errors.bio} rows={3} placeholder="Brief introduction about your teaching style..." />
                          </div>
                      </div>
                  </div>
              </div>
            )}
          </div>

          {/* --- FOOTER ACTION --- */}
          <div className="pt-4">
            <button 
                type="submit" 
                disabled={isPending || !selectedRole} 
                className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Profile...
                    </span>
                ) : (
                    "Complete Registration"
                )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
                By clicking verify, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

        </div>
      </form>
    </div>
  );
}