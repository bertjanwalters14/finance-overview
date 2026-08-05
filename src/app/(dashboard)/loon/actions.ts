"use server";

import { revalidatePath } from "next/cache";
import { setLoonontwikkeling } from "@/lib/data";
import type { LoonEntry } from "@/lib/types";

export async function saveLoon(formData: FormData): Promise<void> {
  const jaren = formData.getAll("jaar") as string[];
  const werkgevers = formData.getAll("werkgever") as string[];
  const bedragen = formData.getAll("bedrag") as string[];

  const data: LoonEntry[] = werkgevers
    .map((werkgever, i) => ({
      jaar: Number(jaren[i] || 0),
      werkgever: werkgever.trim(),
      bedrag: Number(bedragen[i] || 0),
    }))
    .filter((e) => e.werkgever.length > 0);

  await setLoonontwikkeling(data);
  revalidatePath("/loon");
}
