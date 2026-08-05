import { getLoonontwikkeling } from "@/lib/data";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const loonontwikkeling = await getLoonontwikkeling();

  const headers = ["Jaar", "Werkgever", "Bedrag"];
  const rows = loonontwikkeling.map((l) => [l.jaar, l.werkgever, l.bedrag]);

  return csvResponse("loonontwikkeling.csv", toCsv(headers, rows));
}
