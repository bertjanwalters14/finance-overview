"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { LoonEntry } from "@/lib/types";

export function LoonChart({ data }: { data: LoonEntry[] }) {
  const chartData = data.map((e, i) => ({
    label: `${e.werkgever} ${e.jaar}`,
    index: i,
    Bedrag: e.bedrag,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} interval={0} angle={-30} textAnchor="end" height={70} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
            }}
          />
          <Line
            type="monotone"
            dataKey="Bedrag"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
