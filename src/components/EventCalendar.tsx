"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { role } from "@/lib/data";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// ---- Dummy data for demonstration ----
const adminEvents = [
  {
    id: 1,
    title: "Management Meeting",
    date: new Date(2025, 9, 5),
    time: "10:00 AM - 11:00 AM",
    description: "Monthly strategy meeting with department heads.",
  },
  {
    id: 2,
    title: "Budget Review",
    date: new Date(2025, 9, 10),
    time: "3:00 PM - 4:00 PM",
    description: "Financial review for the upcoming semester.",
  },
];

const teacherEvents = [
  {
    id: 1,
    title: "Assignment Submission - CS101",
    date: new Date(2025, 9, 6),
    time: "5:00 PM",
    description: "Students to submit Module 2 assignments.",
  },
  {
    id: 2,
    title: "Midterm Exam - Math101",
    date: new Date(2025, 9, 12),
    time: "10:00 AM",
    description: "Midterm exam for Mathematics 101.",
  },
];

const studentEvents = [
  {
    id: 1,
    title: "Submit English Assignment",
    date: new Date(2025, 9, 6),
    time: "11:59 PM",
    description: "Last date for English literature assignment submission.",
  },
  {
    id: 2,
    title: "Math Exam",
    date: new Date(2025, 9, 12),
    time: "9:00 AM",
    description: "Mathematics midterm exam in Hall 2.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  // Role-based events
  const roleEvents =
    role === "admin"
      ? adminEvents
      : role === "teacher"
      ? teacherEvents
      : studentEvents;

  // Highlight event dates
  const tileClassName = ({ date }: { date: Date }) => {
    const hasEvent = roleEvents.some(
      (event) => event.date.toDateString() === date.toDateString()
    );

    if (hasEvent) {
      return "event-highlight"; // apply a custom CSS class
    }

    return "";
  };

  // Events for selected date
  const selectedDateEvents = roleEvents.filter(
    (event) => event.date.toDateString() === (value as Date).toDateString()
  );

  return (
    <div className="bg-white p-4 rounded-md">
      {/* Calendar */}
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        className="custom-calendar"
      />

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">
          {role === "admin"
            ? "Important Meetings"
            : role === "teacher"
            ? "Assignment & Exam Dates"
            : "My Exam & Assignment Dates"}
        </h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-4">
        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-[#C3EBFA] even:border-t-[#CFCEFF]"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-400 text-xs">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No events on this day.</p>
        )}
      </div>

      {/* Inline CSS for highlighting event dates */}
      <style jsx global>{`
        .react-calendar {
          border: none;
          width: 100%;
        }
        .react-calendar__tile.event-highlight {
          background-color: #facc15 !important; /* [#FAE27C] */
          color: white !important;
          border-radius: 50%;
          font-weight: bold;
          transition: 0.3s;
        }
        .react-calendar__tile.event-highlight:hover {
          background-color: #eab308 !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
