"use server";

import { revalidatePath } from "next/cache";
import {
  setBesteedbaarVermogen,
  setOverigVermogen,
  getOverigVermogen,
  getAandelenPayt,
} from "@/lib/data";
import type { BesteedbaarVermogen, OverigVermogen } from "@/lib/types";
import { berekenOverwaardeAandeel, berekenEigenAandelenWaarde } from "@/lib/types";

export async function saveBesteedbaarVermogen(
  formData: FormData
): Promise<void> {
  const nu = new Date();

  const [overig, aandelen] = await Promise.all([
    getOverigVermogen(),
    getAandelenPayt(),
  ]);

  const nietBesteedbaarVermogen = overig
    ? berekenOverwaardeAandeel(overig) +
      berekenEigenAandelenWaarde(aandelen) -
      overig.schuld
    : undefined;

  const data: BesteedbaarVermogen = {
    jaar: nu.getFullYear(),
    maand: nu.getMonth() + 1,
    spaarrekening: Number(formData.get("spaarrekening") || 0),
    belegging: Number(formData.get("belegging") || 0),
    nietBesteedbaarVermogen,
  };

  await setBesteedbaarVermogen(data);
  revalidatePath("/vermogen");
  revalidatePath("/");
}

export async function saveOverigVermogen(formData: FormData): Promise<void> {
  const data: OverigVermogen = {
    huisWaarde: Number(formData.get("huisWaarde") || 0),
    hypotheek: Number(formData.get("hypotheek") || 0),
    overwaardePercentage: Number(formData.get("overwaardePercentage") || 0),
    schuld: Number(formData.get("schuld") || 0),
    bijgewerktOp: new Date().toISOString().slice(0, 10),
  };

  await setOverigVermogen(data);
  revalidatePath("/vermogen");
  revalidatePath("/");
}
