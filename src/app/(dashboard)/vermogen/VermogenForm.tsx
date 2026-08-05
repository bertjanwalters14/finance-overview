"use client";

import { saveVermogen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import type { Vermogen } from "@/lib/types";

export function VermogenForm({ data }: { data: Vermogen | null }) {
  return (
    <form action={saveVermogen} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Spaarrekening"
          name="spaarrekening"
          defaultValue={data?.spaarrekening}
        />
        <Field label="Belegging" name="belegging" defaultValue={data?.belegging} />
        <Field
          label="Payt aandelen waarde"
          name="aandelenPaytWaarde"
          defaultValue={data?.aandelenPaytWaarde}
        />
        <Field
          label="Overwaarde (jouw deel)"
          name="overwaardeAandeel"
          defaultValue={data?.overwaardeAandeel}
        />
        <Field label="Huiswaarde" name="huisWaarde" defaultValue={data?.huisWaarde} />
        <Field label="Hypotheek" name="hypotheek" defaultValue={data?.hypotheek} />
        <Field label="Schuld" name="schuld" defaultValue={data?.schuld} />
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
