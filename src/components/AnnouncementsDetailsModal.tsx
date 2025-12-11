import Image from "next/image";
import Link from "next/link";
import { Announcement, Class, Institute } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "./FormContainer";

type AnnouncementWithRelations = Announcement & {
  class: Class | null;
  institute: Institute | null;
};

export default async function AnnouncementsDetailsModal({
  announcement,
  onCloseUrl,
}: {
  announcement: AnnouncementWithRelations;
  onCloseUrl: string;
}) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === "admin";

  const formattedDate = new Date(announcement.publishedAt).toLocaleDateString();
  const formattedExpiry = announcement.expiresAt
    ? new Date(announcement.expiresAt).toLocaleDateString()
    : "No Expiry";

  const targetDisplay =
    announcement.target === "SPECIFIC_CLASS"
      ? announcement.class?.name || "Unknown Class"
      : announcement.target === "INSTITUTE_WIDE"
      ? announcement.institute?.name || "Unknown Institute"
      : announcement.target.replace(/_/g, " ");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">

        {/* HEADER */}
        <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-4">
            <Image
              src="/announcement.png"
              alt="Announcement"
              width={70}
              height={70}
              className="rounded-lg border-4 border-white shadow-lg"
            />

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{announcement.title}</h2>
              <p className="text-white/90 text-sm mt-1">
                Target: <strong>{targetDisplay}</strong>
              </p>
              <p className="text-white/80 text-xs mt-1">
                Published on: {formattedDate}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <FormContainer table="announcement" type="update" data={announcement} id={announcement.id} />
                <FormContainer table="announcement" type="delete" id={announcement.id} />
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

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* CONTENT */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Content</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {announcement.content}
            </p>
          </div>

          {/* DETAILS GRID */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Announcement Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Target", value: targetDisplay },
                { label: "Published At", value: formattedDate },
                { label: "Expires At", value: formattedExpiry },
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
        </div>

        {/* FOOTER */}
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
