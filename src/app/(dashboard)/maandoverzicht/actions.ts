"use server";

import { revalidatePath } from "next/cache";
import { setMaand } from "@/lib/data";
import type { Maand, VasteLast } from "@/lib/types";

export async function saveMaand(formData: FormData): Promise<void> {
  const jaar = Number(formData.get("jaar"));
  const maand = Number(formData.get("maand"));
  const loon = Number(formData.get("loon") || 0);
  const overigeInkomsten = Number(formData.get("overigeInkomsten") || 0);
  const doelSparen = Number(formData.get("doelSparen") || 0);
  const werkelijkGespaard = Number(formData.get("werkelijkGespaard") || 0);
  const beleggingInleg = Number(formData.get("beleggingInleg") || 0);

  const namen = formData.getAll("vasteLastNaam") as string[];
  const bedragen = formData.getAll("vasteLastBedrag") as string[];
  const vasteLasten: VasteLast[] = namen
    .map((naam, i) => ({ naam: naam.trim(), bedrag: Number(bedragen[i] || 0) }))
    .filter((v) => v.naam.length > 0);

  const data: Maand = {
    jaar,
    maand,
    loon,
    overigeInkomsten,
    vasteLasten,
    doelSparen,
    werkelijkGespaard,
    beleggingInleg,
  };

  await setMaand(data);
  revalidatePath("/maandoverzicht");
  revalidatePath("/");
}
