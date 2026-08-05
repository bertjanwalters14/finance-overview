"use client";

import { useState } from "react";
import { saveMaand } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import type { Maand, VasteLast } from "@/lib/types";

export function MaandForm({
  jaar,
  maand,
  data,
}: {
  jaar: number;
  maand: number;
  data: Maand | null;
}) {
  const [vasteLasten, setVasteLasten] = useState<(VasteLast & { id: string })[]>(
    () => (data?.vasteLasten ?? []).map((v) => ({ ...v, id: crypto.randomUUID() }))
  );

  return (
    <form action={saveMaand} className="flex flex-col gap-6">
      <input type="hidden" name="jaar" value={jaar} />
      <input type="hidden" name="maand" value={maand} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loon" name="loon" defaultValue={data?.loon} />
        <Field
          label="Overige inkomsten"
          name="overigeInkomsten"
          defaultValue={data?.overigeInkomsten}
        />
        <Field
          label="Doel sparen"
          name="doelSparen"
          defaultValue={data?.doelSparen}
        />
        <Field
          label="Werkelijk gespaard"
          name="werkelijkGespaard"
          defaultValue={data?.werkelijkGespaard}
        />
        <Field
          label="Belegging inleg"
          name="beleggingInleg"
          defaultValue={data?.beleggingInleg}
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-slate-400">Vaste lasten</p>
        <div className="flex flex-col gap-2">
          {vasteLasten.map((v) => (
            <div key={v.id} className="flex gap-2">
              <input
                name="vasteLastNaam"
                defaultValue={v.naam}
                placeholder="Naam"
                className={`${inputClass} flex-1`}
              />
              <input
                name="vasteLastBedrag"
                type="number"
                step="0.01"
                defaultValue={v.bedrag}
                placeholder="Bedrag"
                className={`${inputClass} w-32`}
              />
              <button
                type="button"
                onClick={() =>
                  setVasteLasten(vasteLasten.filter((item) => item.id !== v.id))
                }
                aria-label="Verwijderen"
                className="px-2 text-slate-500 hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setVasteLasten([
              ...vasteLasten,
              { id: crypto.randomUUID(), naam: "", bedrag: 0 },
            ])
          }
          className="mt-2 text-sm text-emerald-400 hover:underline"
        >
          + post toevoegen
        </button>
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
