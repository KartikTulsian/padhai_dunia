import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import AppLink from "./AppLink";

export default async function Announcements() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  // Fetch logged-in user with relations
  const dbUser = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      studentProfile: {
        include: {
          classStudents: true,
        },
      },
      teacherProfile: {
        include: {
          classes: true,
        },
      },
      instituteAdmin: true,
    },
  });

  if (!dbUser) return <div>User not found</div>;

  let whereCondition: any = {};

  // =========== ROLE FILTERING WITHOUT COURSE-BASED LOGIC ===========
  if (role === "admin") {
    // Admin: see all announcements
    whereCondition = {};
  } else if (role === "institute") {
    // Institute admin: platform-wide + institute-specific
    whereCondition = {
      OR: [
        { target: "PLATFORM_WIDE" },
        {
          target: "INSTITUTE_WIDE",
          instituteId: dbUser.instituteAdmin?.instituteId,
        },
      ],
    };
  } else if (role === "teacher") {
    // Teacher: platform-wide + institute + class-wise
    const classIds =
      dbUser.teacherProfile?.classes.map((c: any) => c.classId) ?? [];

    whereCondition = {
      OR: [
        { target: "PLATFORM_WIDE" },
        {
          target: "INSTITUTE_WIDE",
          instituteId: dbUser.teacherProfile?.instituteId,
        },
        {
          target: "SPECIFIC_CLASS",
          classId: { in: classIds },
        },
      ],
    };
  } else if (role === "student") {
    // Student: platform-wide + institute + class-wise
    const classIds =
      dbUser.studentProfile?.classStudents.map((c: any) => c.classId) ?? [];

    whereCondition = {
      OR: [
        { target: "PLATFORM_WIDE" },
        {
          target: "INSTITUTE_WIDE",
          instituteId: dbUser.studentProfile?.instituteId,
        },
        {
          target: "SPECIFIC_CLASS",
          classId: { in: classIds },
        },
      ],
    };
  } else {
    // Fallback: show only platform-wide
    whereCondition = { target: "PLATFORM_WIDE" };
  }

  // QUERY FINAL ANNOUNCEMENTS
  const announcements = await prisma.announcement.findMany({
    where: whereCondition,
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Announcements</h1>
        <AppLink href="/list/announcements">
          <span className="text-xs text-blue-600 hover:underline cursor-pointer">
            View All
          </span>
        </AppLink>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {announcements.map((a, i) => (
          <AppLink
            key={a.id}
            href={`/list/announcements?announcementId=${a.id}`}
            className={`rounded-lg p-4 block shadow border
              ${i === 0 ? "bg-yellow-50" : i === 1 ? "bg-purple-50" : "bg-blue-50"}
              hover:bg-gray-100 transition`}
          >
            <div className="flex justify-between mb-1">
              <h2 className="font-semibold text-gray-800">{a.title}</h2>
              <span className="text-[11px] bg-white border px-2 rounded text-gray-600">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                }).format(a.publishedAt)}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{a.content}</p>
          </AppLink>
        ))}

        {announcements.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">
            No announcements available
          </p>
        )}
      </div>
    </div>
  );
}
