"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { universityRegistrationData } from "@/lib/data";

export default function UniversityRegistrationChart() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full h-[450px]">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Registration Trend – Schools, Colleges & Coaching Centers
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={universityRegistrationData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Schools"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Colleges"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Coaching"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
