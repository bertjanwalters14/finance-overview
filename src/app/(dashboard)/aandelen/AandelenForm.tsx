"use client";

import { useState } from "react";
import { saveAandelen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import type { AandeelhouderPayt } from "@/lib/types";

type RijMetId = AandeelhouderPayt & { id: string };

export function AandelenForm({ data }: { data: AandeelhouderPayt[] }) {
  const [rijen, setRijen] = useState<RijMetId[]>(() =>
    data.map((r) => ({ ...r, id: crypto.randomUUID() }))
  );

  return (
    <form action={saveAandelen} className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pr-2 pb-2">Naam</th>
              <th className="pr-2 pb-2">Aantal</th>
              <th className="pr-2 pb-2">Inleg</th>
              <th className="pr-2 pb-2">Waarde</th>
              <th className="pr-2 pb-2">Rendement</th>
              <th className="pr-2 pb-2">Dividend</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((r) => (
              <tr key={r.id} className="border-t border-slate-800">
                <td className="py-1 pr-2">
                  <input
                    name="naam"
                    defaultValue={r.naam}
                    className={`${inputClass} w-32 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="aantal"
                    type="number"
                    step="0.01"
                    defaultValue={r.aantal}
                    className={`${inputClass} w-24 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="inleg"
                    type="number"
                    step="0.01"
                    defaultValue={r.inleg}
                    className={`${inputClass} w-28 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="waarde"
                    type="number"
                    step="0.01"
                    defaultValue={r.waarde}
                    className={`${inputClass} w-28 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="rendement"
                    type="number"
                    step="0.01"
                    defaultValue={r.rendement}
                    className={`${inputClass} w-24 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    name="dividend"
                    type="number"
                    step="0.01"
                    defaultValue={r.dividend}
                    className={`${inputClass} w-24 py-1`}
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
              naam: "",
              aantal: 0,
              inleg: 0,
              waarde: 0,
              rendement: 0,
              dividend: 0,
            },
          ])
        }
        className="self-start text-sm text-emerald-400 hover:underline"
      >
        + aandeelhouder toevoegen
      </button>

      <SubmitButton>Opslaan</SubmitButton>
    </form>
  );
}
