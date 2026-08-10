"use client";

import { saveOverigVermogen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import type { OverigVermogen } from "@/lib/types";

export function OverigVermogenForm({ data }: { data: OverigVermogen | null }) {
  return (
    <form action={saveOverigVermogen} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
