"use client";

import { useState } from "react";
import { saveDoelen } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { inputClass } from "@/components/formStyles";
import { MAAND_NAMEN } from "@/lib/types";
import type { JaarDoelen, DoelCategorie } from "@/lib/types";

type CategorieMetId = DoelCategorie & { id: string };

export function DoelenForm({
  jaar,
  data,
}: {
  jaar: number;
  data: JaarDoelen | null;
}) {
  const [categorieen, setCategorieen] = useState<CategorieMetId[]>(() =>
    (data?.categorieen ?? []).map((c) => ({ ...c, id: crypto.randomUUID() }))
  );

  return (
    <form action={saveDoelen} className="flex flex-col gap-4">
      <input type="hidden" name="jaar" value={jaar} />
      <input type="hidden" name="catCount" value={categorieen.length} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pr-2 pb-2">Maand</th>
              <th className="pr-2 pb-2">Doel</th>
              <th className="pr-2 pb-2">Werkelijk</th>
              {categorieen.map((c, ci) => (
                <th key={c.id} className="pr-2 pb-2">
                  <div className="flex items-center gap-1">
                    <input
                      name={`catNaam_${ci}`}
                      defaultValue={c.naam}
                      className={`${inputClass} w-28 py-1`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCategorieen((prev) =>
                          prev.filter((cat) => cat.id !== c.id)
                        )
                      }
                      aria-label="Categorie verwijderen"
                      className="text-slate-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MAAND_NAMEN.map((naam, mi) => (
              <tr key={naam} className="border-t border-slate-800">
                <td className="py-1 pr-2 whitespace-nowrap text-slate-300">
                  {naam}
                </td>
                <td className="py-1 pr-2">
                  <input
                    type="number"
                    step="0.01"
                    name="doelMaand"
                    defaultValue={data?.doelPerMaand[mi] ?? 0}
                    className={`${inputClass} w-24 py-1`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    type="number"
                    step="0.01"
                    name="werkelijkMaand"
                    defaultValue={data?.werkelijkPerMaand[mi] ?? 0}
                    className={`${inputClass} w-24 py-1`}
                  />
                </td>
                {categorieen.map((c, ci) => (
                  <td key={c.id} className="py-1 pr-2">
                    <input
                      type="number"
                      step="0.01"
                      name={`catBedrag_${ci}`}
                      defaultValue={c.bedragenPerMaand[mi] ?? 0}
                      className={`${inputClass} w-24 py-1`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() =>
          setCategorieen((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              naam: "Nieuwe categorie",
              bedragenPerMaand: Array(12).fill(0),
            },
          ])
        }
        className="self-start text-sm text-emerald-400 hover:underline"
      >
        + categorie toevoegen
      </button>

      <SubmitButton>Opslaan</SubmitButton>
    </form>
  );
}
