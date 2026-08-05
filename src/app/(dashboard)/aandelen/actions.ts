"use server";

import { revalidatePath } from "next/cache";
import { setAandelenPayt } from "@/lib/data";
import type { AandeelhouderPayt } from "@/lib/types";

export async function saveAandelen(formData: FormData): Promise<void> {
  const namen = formData.getAll("naam") as string[];
  const aantallen = formData.getAll("aantal") as string[];
  const inlegen = formData.getAll("inleg") as string[];
  const waarden = formData.getAll("waarde") as string[];
  const rendementen = formData.getAll("rendement") as string[];
  const dividenden = formData.getAll("dividend") as string[];

  const data: AandeelhouderPayt[] = namen
    .map((naam, i) => ({
      naam: naam.trim(),
      aantal: Number(aantallen[i] || 0),
      inleg: Number(inlegen[i] || 0),
      waarde: Number(waarden[i] || 0),
      rendement: Number(rendementen[i] || 0),
      dividend: Number(dividenden[i] || 0),
    }))
    .filter((a) => a.naam.length > 0);

  await setAandelenPayt(data);
  revalidatePath("/aandelen");
}
