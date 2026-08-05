"use client";

import { useState } from "react";
import { saveLoon } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import type { LoonEntry } from "@/lib/types";

type RijMetId = LoonEntry & { id: string };

export function LoonForm({ data }: { data: LoonEntry[] }) {
  const [rijen, setRijen] = useState<RijMetId[]>(() =>
    data.map((r) => ({ ...r, id: crypto.randomUUID() }))
  );

  return (
    <form action={saveLoon} className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pr-2 pb-2">Jaar</th>
              <th className="pr-2 pb-2">Werkgever</th>
              <th className="pr-2 pb-2">Bedrag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((r) => (
              <tr key={r.id} className="border-t border-slate-800">
                <td className="py-1 pr-2">
                  <input
                    name="jaar"
                    type="number"
                    defaultValue={r.jaar}
                    className={`${inputClass} w-24 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="werkgever"
                    defaultValue={r.werkgever}
                    className={`${inputClass} w-32 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="bedrag"
                    type="number"
                    step="0.01"
                    defaultValue={r.bedrag}
                    className={`${inputClass} w-28 py-1`}
                  />
                </td>
                <td className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setRijen((prev) => prev.filter((item) => item.id !== r.id))
                    }
                    aria-label="Verwijderen"
                    className="px-2 text-slate-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() =>
          setRijen((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              jaar: new Date().getFullYear(),
              werkgever: "",
              bedrag: 0,
            },
          ])
        }
        className="self-start text-sm text-emerald-400 hover:underline"
      >
        + loon toevoegen
      </button>

      <SubmitButton>Opslaan</SubmitButton>
    </form>
  );
}
