"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  Dispatch,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { EventSchema, eventSchema } from "@/lib/formValidationSchema";
import { createEvent, updateEvent } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EventForm({
  type,
  data,
  setOpen,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      instituteId: data?.instituteId || "",
      classId: data?.classId || "",
      startTime: data?.startTime
        ? new Date(data.startTime).toISOString().slice(0, 16)
        : "",
      endTime: data?.endTime
        ? new Date(data.endTime).toISOString().slice(0, 16)
        : "",
      location: data?.location || "",
      isVirtual: Boolean(data?.isVirtual) ?? false,
      meetingLink: data?.meetingLink || "",
      event_id: data?.id || "",
    },
  });

  //  const [state, formAction] = useActionState(
  //   type === "create" ? createEvent : updateEvent,
  //   {
  //     success: false,
  //     error: false,
  //   }
  // );

  const [state, setState] = useState({ success: false, error: false });
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const isVirtual = watch("isVirtual");

  const router = useRouter();

  // const onSubmit = handleSubmit((formData) => {
  //   const payload = {
  //     ...formData,
  //     ...(type === "update" && data?.event_id
  //       ? { event_id: data.event_id }
  //       : {}),
  //   };

  //   setHasShownSuccessToast(false);

  //   startTransition(() => {
  //     formAction(payload);
  //   });
  // });

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
      ...(type === "update" && data?.event_id ? { event_id: data.event_id } : {}),
    };

    setHasShownSuccessToast(false);

    startTransition(async () => {
      const result = await (type === "create" ? createEvent : updateEvent)(
        { success: false, error: false },
        payload
      );

      setState(result);
    });
  });


  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast(
        `Event has been ${type === "create" ? "created" : "updated"}!`
      );
      setHasShownSuccessToast(true);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen, hasShownSuccessToast]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create New Event" : "Update Event"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event Title"
          name="title"
          register={register}
          error={errors.title}
        />

        <InputField
          label="Description"
          name="description"
          register={register}
          error={errors.description}
        />

        {/* Institute Dropdown */}
        <div className="flex flex-col w-full md:w-1/4 gap-2">
          <label className="text-xs text-gray-500">Institute</label>
          <select {...register("instituteId")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm">
            <option value="">Select Institute</option>
            {relatedData?.institutes?.map((inst: any) => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
        </div>

        {/* Class Dropdown */}
        <div className="flex flex-col w-full md:w-1/4 gap-2">
          <label className="text-xs text-gray-500">Class</label>
          <select {...register("classId")} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm">
            <option value="">Select Class</option>
            {relatedData?.classes?.map((cls: any) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Start Time</label>
          <input
            type="datetime-local"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("startTime")}
          />
          {errors.startTime?.message && (
            <p className="text-xs text-red-400">{errors.startTime.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">End Time</label>
          <input
            type="datetime-local"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("endTime")}
          />
          {errors.endTime?.message && (
            <p className="text-xs text-red-400">{errors.endTime.message}</p>
          )}
        </div>

        <InputField
          label="Location"
          name="location"
          register={register}
          error={errors.location}
        />

        {/* Virtual Event Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Is Virtual?</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("isVirtual")}
            defaultValue={data?.isVirtual || false}
          >
            <option value="false">No (Physical Event)</option>
            <option value="true">Yes (Virtual Event)</option>
          </select>
          {errors.isVirtual?.message && (
            <p className="text-xs text-red-400">{errors.isVirtual.message.toString()}</p>
          )}
        </div>

        {/* Meeting Link only if Virtual */}
        {isVirtual && (
          <InputField
            label="Meeting Link"
            name="meetingLink"
            register={register}
            error={errors.meetingLink}
          />
        )}

        {/* Hidden ID for updates */}
        {type === "update" && data?.event_id && (
          <InputField
            label="Event ID"
            name="event_id"
            defaultValue={data.event_id}
            register={register}
            error={errors.event_id}
          />
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
