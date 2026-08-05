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
import { MAAND_NAMEN, besteedbaarVermogenTotaal } from "@/lib/types";
import type { BesteedbaarVermogen } from "@/lib/types";

export function VermogenChart({ data }: { data: BesteedbaarVermogen[] }) {
  const chartData = data.map((p) => ({
    label: `${MAAND_NAMEN[p.maand - 1].slice(0, 3)} ${p.jaar}`,
    Totaal: besteedbaarVermogenTotaal(p),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            fontSize={11}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
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
            dataKey="Totaal"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
