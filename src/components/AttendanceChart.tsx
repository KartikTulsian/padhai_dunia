"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy data: attendance per course
const data = [
  {
    course: "Mathematics",
    present: 42,
    absent: 8,
  },
  {
    course: "Physics",
    present: 38,
    absent: 12,
  },
  {
    course: "Chemistry",
    present: 45,
    absent: 5,
  },
  {
    course: "Computer Science",
    present: 48,
    absent: 2,
  },
  {
    course: "English",
    present: 40,
    absent: 10,
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Course-wise Attendance</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      {/* BAR CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barSize={20}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="course"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
            }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "20px" }}
          />
          <Bar
            dataKey="present"
            name="Present Days"
            fill="#FAE27C"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            name="Absent Days"
            fill="#C3EBFA"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
