import {
  listBesteedbaarVermogenGeschiedenis,
  getOverigVermogen,
} from "@/lib/data";
import { MAAND_NAMEN, besteedbaarVermogenTotaal } from "@/lib/types";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const [geschiedenis, overig] = await Promise.all([
    listBesteedbaarVermogenGeschiedenis(),
    getOverigVermogen(),
  ]);

  const headers = [
    "Jaar",
    "Maand",
    "Spaarrekening",
    "Belegging",
    "Besteedbaar vermogen totaal",
  ];

  const rows = geschiedenis.map((p) => [
    p.jaar,
    MAAND_NAMEN[p.maand - 1],
    p.spaarrekening,
    p.belegging,
    besteedbaarVermogenTotaal(p),
  ]);

  let csv = toCsv(headers, rows);

  if (overig) {
    csv +=
      "\r\n\r\n" +
      toCsv(
        ["Overig vermogen (huidige stand)", "Bedrag"],
        [
          ["Payt aandelen waarde", overig.aandelenPaytWaarde],
          ["Huiswaarde", overig.huisWaarde],
          ["Hypotheek", overig.hypotheek],
          ["Overwaarde (jouw deel)", overig.overwaardeAandeel],
          ["Schuld", overig.schuld],
          ["Bijgewerkt op", overig.bijgewerktOp],
        ],
        { bom: false }
      );
  }

  return csvResponse("vermogen.csv", csv);
}
