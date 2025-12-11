import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { Prisma, Event, Institute, Class } from "@prisma/client";
import EventsDetailsModal from "@/components/EventsDetailsModal";
import FormContainer from "@/components/FormContainer";

type EventList = Event & {
  institute: Institute | null;
  class: Class | null;
};

export default async function EventListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class", className: "hidden md:table-cell" },
    { header: "Institute", accessor: "institute", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Start", accessor: "startTime", className: "hidden md:table-cell" },
    { header: "End", accessor: "endTime", className: "hidden md:table-cell" },
  ];

  const { page, eventId, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        switch (key) {
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ];
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        institute: true,
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
      orderBy: { startTime: "desc" },
    }),
    prisma.event.count({ where: query }),
  ]) as [EventList[], number];

  const selectedEvent = eventId
    ? await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          institute: true,
          class: true,
        },
      })
    : null;

  // Row Renderer
  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF] cursor-pointer transition-colors"
    >
      <td className="p-4 font-medium">
        <Link href={`?eventId=${item.id}&page=${p}`} scroll={false} className="hover:underline">
          {item.title}
        </Link>
      </td>

      <td className="hidden md:table-cell">{item.class?.name || "All Classes"}</td>
      <td className="hidden md:table-cell">{item.institute?.name || "N/A"}</td>

      <td className="hidden md:table-cell">
        {item.startTime.toLocaleDateString()}
      </td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">All Events</h1>

        <div className="flex items-center gap-4">
          <TableSearch />
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/filter.png" alt="filter" width={14} height={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            <Image src="/sort.png" alt="sort" width={14} height={14} />
          </button>

          {role === "admin" && <FormContainer table="event" type="create" />}
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />

      <div className="mt-6">
        <Pagination page={p} count={count} />
      </div>

      {selectedEvent && (
        <EventsDetailsModal
          event={selectedEvent}
          onCloseUrl={`/list/events?page=${p}`}
          role={role}
        />
      )}
    </div>
  );
}
