"use server";

import { revalidatePath } from "next/cache";
import { setVermogen } from "@/lib/data";
import type { Vermogen } from "@/lib/types";

export async function saveVermogen(formData: FormData): Promise<void> {
  const data: Vermogen = {
    spaarrekening: Number(formData.get("spaarrekening") || 0),
    belegging: Number(formData.get("belegging") || 0),
    aandelenPaytWaarde: Number(formData.get("aandelenPaytWaarde") || 0),
    huisWaarde: Number(formData.get("huisWaarde") || 0),
    hypotheek: Number(formData.get("hypotheek") || 0),
    overwaardeAandeel: Number(formData.get("overwaardeAandeel") || 0),
    schuld: Number(formData.get("schuld") || 0),
    bijgewerktOp: new Date().toISOString().slice(0, 10),
  };

  await setVermogen(data);
  revalidatePath("/vermogen");
  revalidatePath("/");
}
