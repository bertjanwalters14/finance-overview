"use server";

import { revalidatePath } from "next/cache";
import { getDoelen, setDoelen } from "@/lib/data";
import type { JaarDoelen, DoelCategorie } from "@/lib/types";

export async function saveDoelen(formData: FormData): Promise<void> {
  const jaar = Number(formData.get("jaar"));
  const doelMaandRaw = formData.getAll("doelMaand") as string[];
  const werkelijkMaandRaw = formData.getAll("werkelijkMaand") as string[];

  const catCount = Number(formData.get("catCount") || 0);
  const nieuweCategorieen: DoelCategorie[] = [];
  for (let i = 0; i < catCount; i++) {
    const naam = String(formData.get(`catNaam_${i}`) || "").trim();
    if (!naam) continue;
    const bedragenPerMaand = (formData.getAll(`catBedrag_${i}`) as string[]).map(
      Number
    );
    nieuweCategorieen.push({ naam, bedragenPerMaand });
  }

  // Voor een jaar met maandoverzicht-data staan Doel/Werkelijk (en de
  // afgeleide "Belegging"-categorie) niet in het formulier — die moeten dan
  // ongewijzigd blijven i.p.v. overschreven te worden met een leeg array.
  const bestaand = doelMaandRaw.length === 0 ? await getDoelen(jaar) : null;

  const doelPerMaand =
    doelMaandRaw.length > 0
      ? doelMaandRaw.map(Number)
      : bestaand?.doelPerMaand ?? Array(12).fill(0);
  const werkelijkPerMaand =
    werkelijkMaandRaw.length > 0
      ? werkelijkMaandRaw.map(Number)
      : bestaand?.werkelijkPerMaand ?? Array(12).fill(0);

  const bestaandeBelegging = bestaand?.categorieen.find(
    (c) => c.naam.trim().toLowerCase() === "belegging"
  );
  const categorieen = bestaandeBelegging
    ? [bestaandeBelegging, ...nieuweCategorieen]
    : nieuweCategorieen;

  const data: JaarDoelen = { jaar, doelPerMaand, werkelijkPerMaand, categorieen };
  await setDoelen(data);
  revalidatePath("/jaaroverzicht");
}
