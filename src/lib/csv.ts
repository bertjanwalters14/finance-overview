function escapeCsvField(value: string | number): string {
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(
  headers: string[],
  rows: (string | number)[][],
  options: { bom?: boolean } = {}
): string {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCsvField).join(",")
  );
  const bom = options.bom ?? true;
  return (bom ? "﻿" : "") + lines.join("\r\n");
}

export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
