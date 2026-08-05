"use client";

import { saveBesteedbaarVermogen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import type { BesteedbaarVermogen } from "@/lib/types";

export function BesteedbaarVermogenForm({
  data,
}: {
  data: BesteedbaarVermogen | null;
}) {
  return (
    <form action={saveBesteedbaarVermogen} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Spaarrekening"
          name="spaarrekening"
          defaultValue={data?.spaarrekening}
        />
        <Field
          label="Belegging"
          name="belegging"
          defaultValue={data?.belegging}
        />
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
