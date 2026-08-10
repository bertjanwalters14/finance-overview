import { NextRequest } from "next/server";
import { getDoelen, listMaandenVanJaar } from "@/lib/data";
import { MAAND_NAMEN, afgeleideDoelenUitMaanden } from "@/lib/types";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const jaar = Number(req.nextUrl.searchParams.get("jaar")) || new Date().getFullYear();
  const [doelen, maanden] = await Promise.all([
    getDoelen(jaar),
    listMaandenVanJaar(jaar),
  ]);

  const heeftMaandData = maanden.length > 0;
  const afgeleid = heeftMaandData ? afgeleideDoelenUitMaanden(maanden) : null;

  const doelPerMaand = afgeleid?.doelPerMaand ?? doelen?.doelPerMaand ?? Array(12).fill(0);
  const werkelijkPerMaand =
    afgeleid?.werkelijkPerMaand ?? doelen?.werkelijkPerMaand ?? Array(12).fill(0);
  const categorieen = heeftMaandData
    ? (doelen?.categorieen ?? []).filter(
        (c) => c.naam.trim().toLowerCase() !== "belegging"
      )
    : doelen?.categorieen ?? [];

  const headers = [
    "Maand",
    "Doel",
    "Werkelijk",
    ...(heeftMaandData ? ["Belegging"] : []),
    ...categorieen.map((c) => c.naam),
  ];

  const rows = MAAND_NAMEN.map((naam, i) => [
    naam,
    doelPerMaand[i] ?? 0,
    werkelijkPerMaand[i] ?? 0,
    ...(heeftMaandData ? [afgeleid!.beleggingPerMaand[i] ?? 0] : []),
    ...categorieen.map((c) => c.bedragenPerMaand[i] ?? 0),
  ]);

  return csvResponse(`jaardoelen-${jaar}.csv`, toCsv(headers, rows));
}
