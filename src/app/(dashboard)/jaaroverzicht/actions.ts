"use server";

import { revalidatePath } from "next/cache";
import { setDoelen } from "@/lib/data";
import type { JaarDoelen, DoelCategorie } from "@/lib/types";

export async function saveDoelen(formData: FormData): Promise<void> {
  const jaar = Number(formData.get("jaar"));
  const doelPerMaand = (formData.getAll("doelMaand") as string[]).map(Number);
  const werkelijkPerMaand = (formData.getAll("werkelijkMaand") as string[]).map(
    Number
  );

  const catCount = Number(formData.get("catCount") || 0);
  const categorieen: DoelCategorie[] = [];
  for (let i = 0; i < catCount; i++) {
    const naam = String(formData.get(`catNaam_${i}`) || "").trim();
    if (!naam) continue;
    const bedragenPerMaand = (formData.getAll(`catBedrag_${i}`) as string[]).map(
      Number
    );
    categorieen.push({ naam, bedragenPerMaand });
  }

  const data: JaarDoelen = { jaar, doelPerMaand, werkelijkPerMaand, categorieen };
  await setDoelen(data);
  revalidatePath("/jaaroverzicht");
}
