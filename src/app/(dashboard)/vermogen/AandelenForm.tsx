"use client";

import { useState } from "react";
import { saveAandelen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import { formatEURPrecies } from "@/lib/format";
import type { AandeelhouderPayt, AandelenPaytData } from "@/lib/types";

type RijMetId = AandeelhouderPayt & { id: string };

export function AandelenForm({ data }: { data: AandelenPaytData }) {
  const [koers, setKoers] = useState(data.koersPerAandeel);
  const [rijen, setRijen] = useState<RijMetId[]>(() =>
    data.aandeelhouders.map((r) => ({ ...r, id: crypto.randomUUID() }))
  );

  function updateRij(id: string, patch: Partial<AandeelhouderPayt>) {
    setRijen((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <form action={saveAandelen} className="flex flex-col gap-4">
      <label className="flex max-w-xs flex-col gap-1 text-sm text-slate-400">
        Huidige koers per aandeel
        <input
          name="koersPerAandeel"
          type="number"
          step="0.01"
          defaultValue={koers}
          onChange={(e) => setKoers(Number(e.target.value) || 0)}
          className={inputClass}
        />
      </label>

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
              <th className="pr-2 pb-2">Van jou</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((r, i) => {
              const waarde = r.aantal * koers;
              const rendement = r.inleg > 0 ? waarde / r.inleg : 0;
              return (
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
                      onChange={(e) =>
                        updateRij(r.id, { aantal: Number(e.target.value) || 0 })
                      }
                      className={`${inputClass} w-24 py-1`}
                    />
                  </td>
                  <td className="py-1 pr-2">
                    <input
                      name="inleg"
                      type="number"
                      step="0.01"
                      defaultValue={r.inleg}
                      onChange={(e) =>
                        updateRij(r.id, { inleg: Number(e.target.value) || 0 })
                      }
                      className={`${inputClass} w-28 py-1`}
                    />
                  </td>
                  <td className="py-1 pr-2 whitespace-nowrap text-slate-300">
                    {formatEURPrecies(waarde)}
                  </td>
                  <td className="py-1 pr-2 whitespace-nowrap text-slate-300">
                    {rendement.toFixed(2)}x
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
                  <td className="py-1 pr-2 text-center">
                    <input
                      name={`vanJou_${i}`}
                      type="checkbox"
                      defaultChecked={r.vanJou}
                      className="h-4 w-4"
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
              );
            })}
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
              dividend: 0,
              vanJou: false,
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
