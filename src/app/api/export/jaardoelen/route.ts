import { NextRequest } from "next/server";
import { getDoelen } from "@/lib/data";
import { MAAND_NAMEN } from "@/lib/types";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const jaar = Number(req.nextUrl.searchParams.get("jaar")) || new Date().getFullYear();
  const doelen = await getDoelen(jaar);

  const headers = [
    "Maand",
    "Doel",
    "Werkelijk",
    ...(doelen?.categorieen.map((c) => c.naam) ?? []),
  ];

  const rows = MAAND_NAMEN.map((naam, i) => [
    naam,
    doelen?.doelPerMaand[i] ?? 0,
    doelen?.werkelijkPerMaand[i] ?? 0,
    ...(doelen?.categorieen.map((c) => c.bedragenPerMaand[i] ?? 0) ?? []),
  ]);

  return csvResponse(`jaardoelen-${jaar}.csv`, toCsv(headers, rows));
}
