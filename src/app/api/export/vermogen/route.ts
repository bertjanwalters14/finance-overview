import {
  listBesteedbaarVermogenGeschiedenis,
  getOverigVermogen,
  getAandelenPayt,
} from "@/lib/data";
import {
  MAAND_NAMEN,
  besteedbaarVermogenTotaal,
  berekenEigenAandelenWaarde,
} from "@/lib/types";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const [geschiedenis, overig, aandelen] = await Promise.all([
    listBesteedbaarVermogenGeschiedenis(),
    getOverigVermogen(),
    getAandelenPayt(),
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
          ["Payt aandelen waarde", berekenEigenAandelenWaarde(aandelen)],
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
