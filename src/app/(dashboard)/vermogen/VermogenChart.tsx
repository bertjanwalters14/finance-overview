"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MAAND_NAMEN, besteedbaarVermogenTotaal } from "@/lib/types";
import type { BesteedbaarVermogen, NietBesteedbaarPunt } from "@/lib/types";

function labelVoor(jaar: number, maand: number) {
  return `${MAAND_NAMEN[maand - 1].slice(0, 3)} ${jaar}`;
}

// De twee lijnen hebben elk hun eigen, onafhankelijke tijdlijn (besteedbaar
// vermogen wordt vaak bijgewerkt, niet-besteedbaar alleen bij grote
// gebeurtenissen zoals een huizenverkoop of koerswijziging). Deze functie
// combineert alle voorkomende (jaar,maand)-punten uit beide bronnen tot één
// chronologische as, zodat elke lijn alleen tekent waar hij echt data heeft.
export function VermogenChart({
  besteedbaar,
  nietBesteedbaar,
}: {
  besteedbaar: BesteedbaarVermogen[];
  nietBesteedbaar: NietBesteedbaarPunt[];
}) {
  const punten = new Map<string, { jaar: number; maand: number }>();
  for (const p of besteedbaar) punten.set(`${p.jaar}-${p.maand}`, p);
  for (const p of nietBesteedbaar) punten.set(`${p.jaar}-${p.maand}`, p);

  const chronologisch = Array.from(punten.values()).sort(
    (a, b) => a.jaar - b.jaar || a.maand - b.maand
  );

  const chartData = chronologisch.map(({ jaar, maand }) => {
    const besteedbaarPunt = besteedbaar.find(
      (p) => p.jaar === jaar && p.maand === maand
    );
    const nietBesteedbaarPunt = nietBesteedbaar.find(
      (p) => p.jaar === jaar && p.maand === maand
    );
    return {
      label: labelVoor(jaar, maand),
      Besteedbaar: besteedbaarPunt
        ? besteedbaarVermogenTotaal(besteedbaarPunt)
        : undefined,
      "Niet-besteedbaar": nietBesteedbaarPunt?.waarde,
    };
  });

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
          <YAxis
            yAxisId="besteedbaar"
            stroke="#10b981"
            fontSize={12}
            width={70}
          />
          <YAxis
            yAxisId="nietBesteedbaar"
            orientation="right"
            stroke="#818cf8"
            fontSize={12}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
            }}
          />
          <Legend />
          <Line
            yAxisId="besteedbaar"
            type="monotone"
            dataKey="Besteedbaar"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls={false}
          />
          <Line
            yAxisId="nietBesteedbaar"
            type="monotone"
            dataKey="Niet-besteedbaar"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
