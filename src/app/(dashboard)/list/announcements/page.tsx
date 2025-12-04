import AnnouncementsDetailsModal from "@/components/AnnouncementsDetailsModal";
import FormContainer from "@/components/FormCotainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { announcementsData, role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Class, Institute, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type AnnouncementList = Announcement & {
  class: Class | null;
  institute: Institute | null;
};

export default async function AnnouncementListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Target", accessor: "target", className: "hidden md:table-cell" },
    { header: "Class/Institute", accessor: "location", className: "hidden md:table-cell" },
    { header: "Date", accessor: "publishedAt", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "actions" },
  ];

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const { page, announcementId, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  // Search
  const query: Prisma.AnnouncementWhereInput = {};
  if (queryParams?.search) {
    query.OR = [
      { title: { contains: queryParams.search, mode: "insensitive" } },
      { content: { contains: queryParams.search, mode: "insensitive" } },
    ];
  }

  // Fetch announcements + pagination
  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
        institute: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.announcement.count({ where: query }),
  ]) as [AnnouncementList[], number];

  // Selected announcement for modal
  const selectedAnnouncement = announcementId
    ? await prisma.announcement.findUnique({
        where: { id: announcementId },
        include: {
          class: true,
          institute: true,
        },
      })
    : null;

  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer transition-colors"
    >
      <td className="p-4 font-medium">
        <Link href={`?announcementId=${item.id}&page=${p}`} scroll={false} className="hover:underline">
          {item.title}
        </Link>
      </td>

      <td className="hidden md:table-cell">{item.target.replace(/_/g, " ")}</td>

      <td className="hidden md:table-cell">
        {item.target === "SPECIFIC_CLASS"
          ? item.class?.name || "N/A"
          : item.target === "INSTITUTE_WIDE"
          ? item.institute?.name || "N/A"
          : "All"}
      </td>

      <td className="hidden md:table-cell">
        {new Date(item.publishedAt).toLocaleDateString()}
      </td>

      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormContainer table="announcement" type="update" data={item} />
            <FormContainer table="announcement" type="delete" id={item.id} />
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">All Announcements</h1>

        <div className="flex items-center gap-4">
          <TableSearch />

          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="filter" width={14} height={14} />
          </button>

          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="sort" width={14} height={14} />
          </button>

          {role === "admin" && <FormContainer table="announcement" type="create" />}
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>

      {selectedAnnouncement && (
        <AnnouncementsDetailsModal
          announcement={selectedAnnouncement}
          onCloseUrl={`/list/announcements?page=${p}`}
        />
      )}
    </div>
  );
}