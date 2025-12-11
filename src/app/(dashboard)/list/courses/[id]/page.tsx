import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Assignment, ClassCourse, Course, CourseEnrollment, CourseModule, CourseReview, CourseTeacher, Exam, Institute, Quiz, StudyMaterial, Teacher, User } from "@prisma/client";
import { auth } from '@clerk/nextjs/server';
import StudentChatButton from '@/components/StudentChatButton';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FormContainer from '@/components/FormContainer';
import CourseEnrollmentForm from '@/components/forms/CourseEnrollmentForm';
import { Book, Download, ExternalLink, File, FileText, LinkIcon, MonitorPlay, Presentation, Radio, Target, Video } from 'lucide-react';
import AppLink from '@/components/AppLink';

type CourseWithRelations = Course & {
    enrollments: CourseEnrollment[];
    teachers: (CourseTeacher & { teacher?: Teacher & { user: User } })[];
    modules: CourseModule[];
    assignments: Assignment[];
    exams: Exam[];
    quizzes: Quiz[];
    resources: StudyMaterial[];
    reviews: CourseReview[];
    classes: (ClassCourse & { class?: any })[];
    institute: Institute | null;
};

export default async function SingleCoursePage(props: { params: { id: string } }) {
    const { id } = await props.params;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const isAdmin = role === "admin";
    const isStudent = role === "student";
    const isTeacher = role === "teacher";
    const isInstitute = role === "institute";
    const canEdit = isAdmin || isInstitute || isTeacher;
    const canManageTeachers = isAdmin || isInstitute;

    // 1. Fetch Student ID if role is student (Needed for Enrollment Check)
    let currentStudentId = null;
    if (isStudent && userId) {
        const student = await prisma.student.findUnique({
            where: { userId: userId },
            select: { id: true }
        });
        currentStudentId = student?.id;
    }

    // 2. Fetch course with all related data
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            enrollments: true,
            institute: true,
            teachers: {
                include: {
                    teacher: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
            modules: {
                include: {
                    lessons: {
                        orderBy: { orderIndex: 'asc' } // Ensure lessons are ordered
                    }
                },
                orderBy: { orderIndex: 'asc' } // Ensure modules are ordered
            },
            assignments: true,
            exams: true,
            quizzes: true,
            resources: { orderBy: { uploadedAt: 'desc' } },
            reviews: true,
            classes: {
                include: {
                    class: true,
                },
            },
        },
    });

    if (!course) {
        return notFound();
    }

    // 3. Check Enrollment Status
    const isEnrolled = isStudent && currentStudentId 
        ? course.enrollments.some(e => e.studentId === currentStudentId) 
        : false;
    
    const getMaterialIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
            case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
            case 'DOCUMENT': return <File className="w-5 h-5 text-blue-600" />;
            case 'PRESENTATION': return <Presentation className="w-5 h-5 text-orange-500" />;
            case 'EBOOK': return <Book className="w-5 h-5 text-green-600" />;
            case 'LINK': return <LinkIcon className="w-5 h-5 text-gray-500" />;
            default: return <File className="w-5 h-5 text-gray-400" />;
        }
    };
    
    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="w-4 h-4 text-blue-500" />;
            case 'DOCUMENT': return <FileText className="w-4 h-4 text-orange-500" />;
            case 'INTERACTIVE': return <MonitorPlay className="w-4 h-4 text-green-500" />;
            case 'PRESENTATION': return <Presentation className="w-4 h-4 text-purple-500" />;
            case 'LIVE_CLASS': return <Radio className="w-4 h-4 text-red-500 animate-pulse" />;
            default: return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatGoal = (goal: string) => {
        return goal.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const itemRenderers: Record<string, (item: any) => string> = {
        Teachers: (i) => `${i.teacher?.user?.firstName} ${i.teacher?.user?.lastName}`,
        Modules: (i) => i.title,
        Assignments: (i) => i.title,
        Exams: (i) => i.title,
        Quizzes: (i) => i.title,
        Resources: (i) => i.name || i.title,
        Classes: (i) => i.class?.name,
        Reviews: (i) => i.title,
    };

    const IconSpan = ({ children, className = "text-blue-500" }: { children: React.ReactNode, className?: string }) => (
        <span className={`w-5 h-5 flex items-center justify-center ${className}`}>
            {children}
        </span>
    );

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-6 bg-gray-50 min-h-screen">

            {/* HEADER SECTION */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center gap-4 flex-wrap">
                    <Image
                        src={course.thumbnail || "/course.png"}
                        alt={course.title}
                        width={100}
                        height={100}
                        className="rounded-full object-cover border-4 border-white shadow-xl"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                                <p className="text-white/80 text-sm mt-1">
                                    Offered by <strong>{course.institute?.name || "Unknown Institute"}</strong>
                                </p>
                                <p className="text-white/70 text-xs mt-1">
                                    Code: {course.code}
                                </p>
                            </div>

                            {isAdmin && (
                                <div className="flex gap-2">
                                    <FormContainer table="course" type="update" data={course} />
                                    <FormContainer table="course" type="delete" id={course.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT COLUMN - Main Content */}
                <div className="xl:col-span-2 space-y-6">

                    {/* DESCRIPTION */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            📝 Course Overview
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {course.description || "No description provided."}
                        </p>
                    </div>

                    {/* --- TARGET AUDIENCE SECTION --- */}
                    {course.targetAudience && course.targetAudience.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-teal-600" /> Target Audience
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {course.targetAudience.map((goal, index) => (
                                    <span 
                                        key={index}
                                        className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 text-sm font-semibold border border-teal-100 shadow-sm"
                                    >
                                        🎯 {formatGoal(goal)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* STUDY MATERIALS SECTION */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                📂 Study Materials ({course.resources.length})
                            </h2>
                            {canEdit && (
                                <FormContainer table="studyMaterial" type="create" id={course.id} />
                            )}
                        </div>

                        {course.resources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.resources.map((resource) => {
                                    // Check visibility logic
                                    const isVisible = resource.isPublic || isEnrolled || canEdit;
                                    
                                    return (
                                        <div key={resource.id} className={`flex items-start gap-4 p-4 rounded-xl border border-gray-200 transition-all ${isVisible ? 'hover:shadow-md hover:border-blue-200 bg-white' : 'bg-gray-50 opacity-75'}`}>
                                            <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                                                {getMaterialIcon(resource.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-gray-800 truncate pr-2" title={resource.title}>
                                                        {resource.title}
                                                    </h3>
                                                    {/* Edit/Delete Actions */}
                                                    {canEdit && (
                                                        <div className="flex gap-1 shrink-0">
                                                            <FormContainer table="studyMaterial" type="update" data={resource} />
                                                            <FormContainer table="studyMaterial" type="delete" id={resource.id} />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {resource.description || "No description."}
                                                </p>
                                                
                                                <div className="flex items-center gap-3 mt-3">
                                                    {isVisible ? (
                                                        <a 
                                                            href={resource.fileUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            {resource.type === 'LINK' ? 'Open Link' : 'Download'} 
                                                            {resource.type === 'LINK' ? <ExternalLink className="w-3 h-3"/> : <Download className="w-3 h-3"/>}
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">🔒 Enrolled Only</span>
                                                    )}
                                                    
                                                    {resource.fileSize && (
                                                        <span className="text-[10px] text-gray-400">
                                                            {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 italic border-2 border-dashed border-gray-100 rounded-xl">
                                No study materials uploaded yet.
                                {canEdit && <p className="text-sm mt-2 text-blue-500">Click + to add resources.</p>}
                            </div>
                        )}
                    </div>

                    {/* MODULES SECTION */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                📚 Curriculum ({course.modules.length} Modules)
                            </h2>
                            {canEdit && (
                                <FormContainer table="courseModule" type="create" id={course.id} />
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            {course.modules.length > 0 ? (
                                course.modules.map((module) => (
                                    <details key={module.id} className="group border border-gray-200 rounded-xl overflow-hidden transition-all open:shadow-md bg-gray-50">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 font-semibold text-gray-700">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-white border border-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-gray-500">
                                                    {module.orderIndex}
                                                </span>
                                                <span>{module.title}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {canEdit && (
                                                    <div className="flex gap-2"> 
                                                        {/* Prevent details toggle when clicking actions */}
                                                        <FormContainer table="courseModule" type="update" data={module} />
                                                        <FormContainer table="courseModule" type="delete" id={module.id} />
                                                    </div>
                                                )}
                                                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                            </div>
                                        </summary>
                                        
                                        <div className="p-4 bg-white text-gray-600 text-sm border-t border-gray-100">
                                            {module.description && <p className="mb-4 italic text-gray-500">{module.description}</p>}
                                            
                                            <div className="flex flex-col gap-2 pl-2">
                                                {module.lessons.length > 0 ? (
                                                    module.lessons.map((lesson) => (
                                                        <AppLink 
                                                            href={isEnrolled || lesson.isFree ? `/list/lessons?lessonId=${lesson.id}` : '#'}
                                                            key={lesson.id} 
                                                            className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors ${!isEnrolled && !canEdit && !lesson.isFree ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-gray-100 rounded-md">
                                                                    {getLessonIcon(lesson.type)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-gray-800">{lesson.title}</span>
                                                                    <span className="text-xs text-gray-400 flex items-center gap-2">
                                                                        {lesson.duration ? `${lesson.duration} min` : 'Self-paced'}
                                                                        {lesson.isFree && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">FREE PREVIEW</span>}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/* Only show play button if accessible */}
                                                            {(isEnrolled || canEdit || lesson.isFree) && (
                                                                <div className="text-blue-500 text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                                                                    Start
                                                                </div>
                                                            )}
                                                            {/* Show Lock if not accessible */}
                                                            {!isEnrolled && !canEdit && !lesson.isFree && (
                                                                <div className="text-gray-400">🔒</div>
                                                            )}
                                                        </AppLink>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic pl-2">No lessons added to this module yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </details>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 italic">
                                    No modules created yet. 
                                    {canEdit && " Click '+' to add the first module."}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COURSE DETAILS GRID */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Course Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {[
                                { label: "Course Type", value: course.type, icon: "/course.png" },
                                { label: "Level", value: course.level, icon: "/volume-control.png" },
                                { label: "Price", value: course.price ? `${course.currency || "$"}${course.price}` : "Free", icon: "/money-back.png" },
                                { label: "Duration", value: course.duration ? `${course.duration} hrs` : "N/A", icon: "/hourglass.png" },
                                { label: "Language", value: course.language, icon: "/earth.png" },
                                { label: "Category", value: course.category, icon: "/category.png" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                                    <Image src={item.icon} alt="" width={20} height={20} />
                                    <span>
                                        <strong className="text-gray-700">{item.label}:</strong>{" "}
                                        <span className="text-gray-600">{item.value || "N/A"}</span>
                                    </span>
                                </div>
                            ))}

                            {course.tags && course.tags.length > 0 && (
                                <div className="col-span-full flex items-start gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                                    <Image src="/info.png" alt="" width={20} height={20} />
                                    <span>
                                        <strong className="text-gray-700">Tags:</strong>{" "}
                                        <span className="text-gray-600">{course.tags.join(", ")}</span>
                                    </span>
                                </div>
                            )}

                            {course.prerequisites && course.prerequisites.length > 0 && (
                                <div className="col-span-full flex items-start gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                                    <Image src="/info.png" alt="" width={20} height={20} />
                                    <span>
                                        <strong className="text-gray-700">Prerequisites:</strong>{" "}
                                        <span className="text-gray-600">{course.prerequisites.join(", ")}</span>
                                    </span>
                                </div>
                            )}

                            {isAdmin && (
                                <>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                                        <Image src="/info.png" alt="" width={20} height={20} />
                                        <span>
                                            <strong className="text-gray-700">Status:</strong>{" "}
                                            <span className={`font-medium ${course.status === "PUBLISHED" ? "text-green-600" : "text-yellow-600"
                                                }`}>
                                                {course.status}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                                        <Image src="/info.png" alt="" width={20} height={20} />
                                        <span>
                                            <strong className="text-gray-700">Public:</strong>{" "}
                                            <span className="text-gray-600">{course.isPublic ? "Yes" : "No"}</span>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RELATIONAL DETAILS FOR ADMINS */}
                    {isAdmin && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Additional Details</h2>

                            <div className="space-y-3">
                                {[
                                    { label: "Teachers", items: course.teachers, key: "teacher" },
                                    { label: "Modules", items: course.modules },
                                    { label: "Assignments", items: course.assignments },
                                    { label: "Exams", items: course.exams },
                                    { label: "Quizzes", items: course.quizzes },
                                    { label: "Resources", items: course.resources },
                                    { label: "Classes", items: course.classes },
                                    { label: "Reviews", items: course.reviews },
                                ].map((section, i) => (
                                    <details key={i} className="bg-gray-100 rounded-xl p-4 shadow-sm">
                                        <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
                                            <span>{section.label}</span>
                                            <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                                {section.items?.length || 0}
                                            </span>
                                        </summary>
                                        <div className="mt-3 space-y-2 text-sm pl-2">
                                            {section.items && section.items.length > 0 ? (
                                                section.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="border-b pb-2 text-gray-600 last:border-0">
                                                        {itemRenderers[section.label]?.(item) ?? `Item #${idx + 1}`}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 italic">No data available</p>
                                            )}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - Statistics & Quick Info */}
                <div className="space-y-6">

                    {/* --- ENROLLMENT CARD (Only for Students) --- */}
                    {isStudent && currentStudentId && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
                            <div className="text-center mb-6">
                                <p className="text-gray-500 text-sm uppercase tracking-wide font-bold mb-1">Current Price</p>
                                <h3 className="text-4xl font-extrabold text-gray-900">
                                    {course.price === 0 ? "Free" : `${course.currency} ${course.price}`}
                                </h3>
                            </div>
                            
                            <CourseEnrollmentForm
                                courseId={course.id} 
                                studentId={currentStudentId} 
                                isEnrolled={isEnrolled} 
                            />
                            
                            <p className="text-xs text-center text-gray-400 mt-4 px-4">
                                {isEnrolled 
                                    ? "✅ You have full access to this course material." 
                                    : "🚀 Enroll now to access lessons, quizzes, and assignments."}
                            </p>
                        </div>
                    )}

                    {/* STATISTICS */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Statistics</h2>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center border-b-4 border-blue-500 transition-transform hover:scale-[1.02]">
                                <IconSpan className="text-blue-500 mx-auto text-3xl mb-2">👥</IconSpan>
                                <p className="text-3xl font-bold text-blue-600">{course.enrollments?.length || 0}</p>
                                <p className="text-sm text-gray-600">Enrollments</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-b-4 border-green-500 transition-transform hover:scale-[1.02]">
                                <IconSpan className="text-green-500 mx-auto text-3xl mb-2">📚</IconSpan>
                                <p className="text-3xl font-bold text-green-600">{course.modules?.length || 0}</p>
                                <p className="text-sm text-gray-600">Modules</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center border-b-4 border-purple-500 transition-transform hover:scale-[1.02]">
                                <IconSpan className="text-purple-500 mx-auto text-3xl mb-2">👨‍🏫</IconSpan>
                                <p className="text-3xl font-bold text-purple-600">{course.teachers?.length || 0}</p>
                                <p className="text-sm text-gray-600">Teachers</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center border-b-4 border-orange-500 transition-transform hover:scale-[1.02]">
                                <IconSpan className="text-orange-500 mx-auto text-3xl mb-2">📝</IconSpan>
                                <p className="text-3xl font-bold text-orange-600">
                                    {(course.assignments?.length || 0) + (course.exams?.length || 0) + (course.quizzes?.length || 0)}
                                </p>
                                <p className="text-sm text-gray-600">Assessments</p>
                            </div>
                        </div>
                    </div>

                    {/* INSTRUCTORS LIST */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                            <h2 className="text-xl font-bold text-gray-800">Instructors</h2>
                            {canManageTeachers && (
                                <FormContainer table="courseTeacher" type="create" id={course.id} />
                            )}
                        </div>

                        <div className="space-y-3">
                            {course.teachers.length > 0 ? (
                                course.teachers.map((courseTeacher) => (
                                    <div
                                        key={courseTeacher.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-indigo-50 transition duration-200 rounded-lg border border-gray-200 group"
                                    >
                                        <Image
                                            src={courseTeacher.teacher?.user?.avatar || '/avatar.png'}
                                            alt={courseTeacher.teacher?.user?.firstName || 'Teacher'}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover ring-1 ring-gray-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 text-sm truncate">
                                                {courseTeacher.teacher?.user?.firstName} {courseTeacher.teacher?.user?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {courseTeacher.role}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {!isAdmin && isStudent && (
                                                <StudentChatButton
                                                    courseId={course.id}
                                                    teacherId={courseTeacher.teacher?.user?.id || ""} 
                                                    teacherName={courseTeacher.teacher?.user?.firstName || "Teacher"}
                                                />
                                            )}

                                            {/* Remove Teacher Button */}
                                            {canManageTeachers && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FormContainer 
                                                        table="courseTeacher" 
                                                        type="delete" 
                                                        id={courseTeacher.id} // Pass the relationship ID
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-2">No instructors assigned yet.</p>
                            )}
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="flex flex-col gap-2 text-sm">
                            {[
                                { label: "View Enrollments", href: `/list/students?courseId=${course.id}`, bgColor: "bg-blue-50", textColor: "text-blue-700" },
                                // { label: "View Modules", href: `/list/modules?courseId=${course.id}`, bgColor: "bg-green-50", textColor: "text-green-700" },
                                { label: "View Assignments", href: `/list/assignments?courseId=${course.id}`, bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
                                { label: "View Exams", href: `/list/exams?courseId=${course.id}`, bgColor: "bg-pink-50", textColor: "text-pink-700" },
                                { label: "View Quizzes", href: `/list/quizzes?courseId=${course.id}`, bgColor: "bg-purple-50", textColor: "text-purple-700" },
                                { label: "Back to Courses", href: `/list/courses`, bgColor: "bg-gray-50", textColor: "text-gray-700" },
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    className={`p-3 rounded-lg ${item.bgColor} ${item.textColor} font-semibold transition hover:opacity-80 shadow-sm text-center`}
                                    href={item.href}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}