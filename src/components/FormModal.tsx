// src/components/FormModal.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, JSX, Dispatch } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormCotainer";

import {
  deleteAnnouncement,
  deleteAssignment,
  deleteClass,
  deleteCourse,
  deleteEvent,
  deleteExam,
  deleteLesson,
  deleteQuiz,
  deleteResult,
  deleteStudent,
  deleteStudyMaterial,
  deleteTeacher,
  deleteUser,
} from "@/lib/actions";

// ---------- TYPES FOR DELETE MAP ----------

// This is the state shape your delete actions return
type CurrentState = {
  success: boolean;
  error: boolean;
};

// Every delete action will be adapted to this shape on the client:
type DeleteAction = (data: FormData) => Promise<CurrentState>;

// Tables come from FormContainerProps
type DeleteTable = FormContainerProps["table"];

// Base state passed to server actions that expect (state, FormData)
const baseDeleteState: CurrentState = { success: false, error: false };

// ⚠️ Assumption: all these delete* server actions have signature
// (currentState: CurrentState, data: FormData) => Promise<CurrentState>
// If some differ (e.g. deleteExam(id: string)), adjust wrappers accordingly.
const deleteActionMap: Record<DeleteTable, DeleteAction> = {
  event: (data) => deleteEvent(baseDeleteState, data),
  announcement: (data) => deleteAnnouncement(baseDeleteState, data),
  exam: (data) => deleteExam(baseDeleteState, data),
  quiz: (data) => deleteQuiz(baseDeleteState, data),
  result: (data) => deleteResult(baseDeleteState, data),
  course: (data) => deleteCourse(baseDeleteState, data),
  lesson: (data) => deleteLesson(baseDeleteState, data),
  class: (data) => deleteClass(baseDeleteState, data),
  assignment: (data) => deleteAssignment(baseDeleteState, data),
  teacher: (data) => deleteTeacher(baseDeleteState, data),
  student: (data) => deleteStudent(baseDeleteState, data),
  institute: (data) => deleteStudent(baseDeleteState, data), // TODO: replace with real deleteInstitute when you add it
  studyMaterial: (data) => deleteStudyMaterial(baseDeleteState, data),
  user: (data) => deleteUser(baseDeleteState, data),
};

// ---------- LAZY-LOADED FORMS ----------

const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Add more forms as needed
const forms: {
  [key: string]: (
    setOpen: Dispatch<React.SetStateAction<boolean>>,
    type: "create" | "update",
    data?: unknown,
    relatedData?: unknown
  ) => JSX.Element;
} = {
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

export default function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: unknown }) {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
      ? "bg-[#8286ff]"
      : "bg-[#cb70ff]";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ---------------- DELETE FORM (no useActionState) ----------------
  const DeleteForm = () => {
    const deleteAction = deleteActionMap[table];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!deleteAction || !id) return;

      const formData = new FormData();

      // Map table -> expected field name in your server action
      switch (table) {
        case "event":
          formData.append("id", id);
          break;
        case "announcement":
          formData.append("id", id);
          break;
        default:
          // if others expect "id" in FormData, you can safely default to this:
          formData.append("id", id);
          break;
      }

      setLoading(true);
      try {
        const result = await deleteAction(formData);
        if (result.success) {
          toast(`${table} has been deleted!`);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(`Failed to delete ${table}.`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while deleting.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center cursor-pointer disabled:opacity-60"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </form>
    );
  };

  // ---------------- MAIN CONTENT SELECTOR ----------------
  const Content = () => {
    // DELETE
    if (type === "delete" && id) {
      return <DeleteForm />;
    }

    // CREATE / UPDATE
    if ((type === "create" || type === "update") && forms[table]) {
      return forms[table](setOpen, type, data, relatedData);
    }

    return <p>Form not found!</p>;
  };

  return (
    <div>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={14} height={14} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
        >
          <div className="bg-white rounded-2xl relative w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {type === "create"
                  ? `Create ${table}`
                  : type === "update"
                  ? `Update ${table}`
                  : `Delete ${table}`}
              </h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                <Image src="/close.png" alt="Close" width={20} height={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Content />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
