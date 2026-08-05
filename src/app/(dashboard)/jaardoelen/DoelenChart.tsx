"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { MAAND_NAMEN } from "@/lib/types";

export function DoelenChart({
  doelPerMaand,
  werkelijkPerMaand,
}: {
  doelPerMaand: number[];
  werkelijkPerMaand: number[];
}) {
  const data = MAAND_NAMEN.map((naam, i) => ({
    maand: naam.slice(0, 3),
    Doel: doelPerMaand[i] ?? 0,
    Werkelijk: werkelijkPerMaand[i] ?? 0,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="maand" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
            }}
          />
          <Legend />
          <Bar dataKey="Doel" fill="#475569" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Werkelijk" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
