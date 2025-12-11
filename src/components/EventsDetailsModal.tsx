import Image from "next/image";
import Link from "next/link";
import { Event, Institute, Class } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "./FormContainer";

type EventWithRelations = Event & {
  institute: Institute | null;
  class: Class | null;
};

export default async function EventsDetailsModal({
  event,
  onCloseUrl,
  role,
}: {
  event: EventWithRelations;
  onCloseUrl: string;
  role?: string;
}) {
  const { sessionClaims } = await auth();
  const userRole = role || (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = userRole === "admin";

  const formattedDate = new Date(event.startTime).toLocaleDateString();
  const formattedStart = event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedEnd = event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">

        {/* ----- HEADER ----- */}
        <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-4">
            <Image
              src="/events.png"
              alt="Event"
              width={70}
              height={70}
              className="rounded-lg border-4 border-white shadow-lg"
            />

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{event.title}</h2>
              <p className="text-white/90 text-sm mt-1">
                {event.class?.name ? `Class: ${event.class.name}` : "All Classes"}
              </p>
              <p className="text-white/80 text-xs mt-1">
                {event.institute?.name || "No Institute Linked"}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <FormContainer table="event" type="update" data={event} id={event.id} />
                <FormContainer table="event" type="delete" id={event.id} />
              </div>
            )}
          </div>

          <Link
            href={onCloseUrl}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold transition-colors"
          >
            ✕
          </Link>
        </div>

        {/* ----- BODY ----- */}
        <div className="p-6 space-y-6">

          {/* DESCRIPTION */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* DETAILS GRID */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Institute", value: event.institute?.name || "N/A",icon:"/institutes.png" },
                { label: "Class", value: event.class?.name || "All Classes",icon:"/class.png" },
                { label: "Event Date", value: formattedDate,icon:"/calender.png" },
                { label: "Start Time", value: formattedStart,icon:"/timer.png" },
                { label: "End Time", value: formattedEnd ,icon:"/full-time.png"},
                { label: "Location", value: event.location || "Not Specified" ,icon:"/loacation.png"},
                { label: "Virtual Event", value: event.isVirtual ? "Yes" : "No",icon:"/video-call.png" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <Image src="/info.png" alt="" width={18} height={18} />
                  <span>
                    <strong className="text-gray-700">{item.label}:</strong>{" "}
                    <span className="text-gray-600">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MEETING LINK */}
          {event.isVirtual && event.meetingLink && (
            <div className="mt-4">
              <Link
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Join Meeting
              </Link>
            </div>
          )}
        </div>

        {/* ----- FOOTER ----- */}
        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <Link
            href={onCloseUrl}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}
