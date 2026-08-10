"use client";

import { useState } from "react";
import { saveOverigVermogen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import { formatEURPrecies } from "@/lib/format";
import type { OverigVermogen } from "@/lib/types";

export function OverigVermogenForm({ data }: { data: OverigVermogen | null }) {
  const [huisWaarde, setHuisWaarde] = useState(data?.huisWaarde ?? 0);
  const [hypotheek, setHypotheek] = useState(data?.hypotheek ?? 0);
  const [percentage, setPercentage] = useState(data?.overwaardePercentage ?? 0);

  const overwaarde = huisWaarde - hypotheek;
  const overwaardeAandeel = overwaarde * (percentage / 100);

  return (
    <form action={saveOverigVermogen} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-400">
          Huiswaarde
          <input
            name="huisWaarde"
            type="number"
            step="0.01"
            defaultValue={huisWaarde}
            onChange={(e) => setHuisWaarde(Number(e.target.value) || 0)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-400">
          Hypotheek
          <input
            name="hypotheek"
            type="number"
            step="0.01"
            defaultValue={hypotheek}
            onChange={(e) => setHypotheek(Number(e.target.value) || 0)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-400">
          Jouw aandeel in overwaarde (%)
          <input
            name="overwaardePercentage"
            type="number"
            step="0.01"
            defaultValue={percentage}
            onChange={(e) => setPercentage(Number(e.target.value) || 0)}
            className={inputClass}
          />
        </label>
        <Field label="Schuld" name="schuld" defaultValue={data?.schuld} />
      </div>

      <div className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Overwaarde totaal (huiswaarde − hypotheek)</span>
          <span className="text-slate-200">{formatEURPrecies(overwaarde)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Jouw aandeel ({percentage}%)</span>
          <span className="font-semibold text-white">
            {formatEURPrecies(overwaardeAandeel)}
          </span>
        </div>
      </div>

      <SubmitButton>Opslaan</SubmitButton>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-400">
      {label}
      <input
        name={name}
        type="number"
        step="0.01"
        defaultValue={defaultValue ?? 0}
        className={inputClass}
      />
    </label>
  );
}
