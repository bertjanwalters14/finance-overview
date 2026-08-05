import { NextRequest } from "next/server";
import { listMaandenVanJaar } from "@/lib/data";
import { MAAND_NAMEN } from "@/lib/types";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const jaar = Number(req.nextUrl.searchParams.get("jaar")) || new Date().getFullYear();
  const maanden = await listMaandenVanJaar(jaar);

  const headers = [
    "Maand",
    "Loon",
    "Overige inkomsten",
    "Vaste lasten (naam:bedrag)",
    "Vaste lasten totaal",
    "Doel sparen",
    "Werkelijk gespaard",
    "Belegging inleg",
  ];

  const rows = maanden.map((m) => [
    MAAND_NAMEN[m.maand - 1],
    m.loon,
    m.overigeInkomsten,
    m.vasteLasten.map((v) => `${v.naam}:${v.bedrag}`).join("; "),
    m.vasteLasten.reduce((s, v) => s + v.bedrag, 0),
    m.doelSparen,
    m.werkelijkGespaard,
    m.beleggingInleg,
  ]);

  return csvResponse(`maandoverzicht-${jaar}.csv`, toCsv(headers, rows));
}
