"use server";

import { revalidatePath } from "next/cache";
import {
  setBesteedbaarVermogen,
  setNietBesteedbaarPunt,
  setOverigVermogen,
  getOverigVermogen,
  getAandelenPayt,
  setAandelenPayt,
  setLoonontwikkeling,
} from "@/lib/data";
import type {
  BesteedbaarVermogen,
  OverigVermogen,
  AandeelhouderPayt,
  AandelenPaytData,
  LoonEntry,
} from "@/lib/types";
import { berekenOverwaardeAandeel, berekenEigenAandelenWaarde } from "@/lib/types";

export async function saveBesteedbaarVermogen(
  formData: FormData
): Promise<void> {
  const nu = new Date();
  const jaar = nu.getFullYear();
  const maand = nu.getMonth() + 1;

  const data: BesteedbaarVermogen = {
    jaar,
    maand,
    spaarrekening: Number(formData.get("spaarrekening") || 0),
    belegging: Number(formData.get("belegging") || 0),
  };

  await setBesteedbaarVermogen(data);

  const [overig, aandelen] = await Promise.all([
    getOverigVermogen(),
    getAandelenPayt(),
  ]);

  if (overig) {
    await setNietBesteedbaarPunt({
      jaar,
      maand,
      waarde:
        berekenOverwaardeAandeel(overig) +
        berekenEigenAandelenWaarde(aandelen) -
        overig.schuld,
    });
  }

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
      vanJou: formData.get(`vanJou_${i}`) === "on",
    }))
    .filter((a) => a.naam.length > 0);

  const data: AandelenPaytData = { koersPerAandeel, aandeelhouders };
  await setAandelenPayt(data);
  revalidatePath("/vermogen");
  revalidatePath("/");
}

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
  revalidatePath("/vermogen");
}
