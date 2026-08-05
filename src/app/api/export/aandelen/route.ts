import { getAandelenPayt } from "@/lib/data";
import { berekenAandelenWaarde, berekenRendement } from "@/lib/types";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const data = await getAandelenPayt();

  const headers = [
    "Naam",
    "Aantal",
    "Inleg",
    "Waarde",
    "Rendement",
    "Dividend",
  ];

  const rows = data.aandeelhouders.map((a) => [
    a.naam,
    a.aantal,
    a.inleg,
    berekenAandelenWaarde(a, data.koersPerAandeel),
    berekenRendement(a, data.koersPerAandeel).toFixed(4),
    a.dividend,
  ]);

  const csv =
    toCsv(["Koers per aandeel"], [[data.koersPerAandeel]]) +
    "\r\n\r\n" +
    toCsv(headers, rows, { bom: false });

  return csvResponse("aandelen-payt.csv", csv);
}
