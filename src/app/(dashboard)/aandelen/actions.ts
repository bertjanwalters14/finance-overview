"use server";

import { revalidatePath } from "next/cache";
import { setAandelenPayt } from "@/lib/data";
import type { AandeelhouderPayt, AandelenPaytData } from "@/lib/types";

export async function saveAandelen(formData: FormData): Promise<void> {
  const koersPerAandeel = Number(formData.get("koersPerAandeel") || 0);
  const namen = formData.getAll("naam") as string[];
  const aantallen = formData.getAll("aantal") as string[];
  const inlegen = formData.getAll("inleg") as string[];
  const dividenden = formData.getAll("dividend") as string[];

  const aandeelhouders: AandeelhouderPayt[] = namen
    .map((naam, i) => ({
      naam: naam.trim(),
      aantal: Number(aantallen[i] || 0),
      inleg: Number(inlegen[i] || 0),
      dividend: Number(dividenden[i] || 0),
    }))
    .filter((a) => a.naam.length > 0);

  const data: AandelenPaytData = { koersPerAandeel, aandeelhouders };
  await setAandelenPayt(data);
  revalidatePath("/aandelen");
  revalidatePath("/");
}
