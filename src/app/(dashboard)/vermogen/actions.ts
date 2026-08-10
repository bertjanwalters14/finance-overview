"use server";

import { revalidatePath } from "next/cache";
import { setBesteedbaarVermogen, setOverigVermogen } from "@/lib/data";
import type { BesteedbaarVermogen, OverigVermogen } from "@/lib/types";

export async function saveBesteedbaarVermogen(
  formData: FormData
): Promise<void> {
  const nu = new Date();

  const data: BesteedbaarVermogen = {
    jaar: nu.getFullYear(),
    maand: nu.getMonth() + 1,
    spaarrekening: Number(formData.get("spaarrekening") || 0),
    belegging: Number(formData.get("belegging") || 0),
  };

  await setBesteedbaarVermogen(data);
  revalidatePath("/vermogen");
  revalidatePath("/");
}

export async function saveOverigVermogen(formData: FormData): Promise<void> {
  const data: OverigVermogen = {
    huisWaarde: Number(formData.get("huisWaarde") || 0),
    hypotheek: Number(formData.get("hypotheek") || 0),
    overwaardeAandeel: Number(formData.get("overwaardeAandeel") || 0),
    schuld: Number(formData.get("schuld") || 0),
    bijgewerktOp: new Date().toISOString().slice(0, 10),
  };

  await setOverigVermogen(data);
  revalidatePath("/vermogen");
  revalidatePath("/");
}
