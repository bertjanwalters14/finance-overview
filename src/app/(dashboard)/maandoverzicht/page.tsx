import Link from "next/link";
import { listMaandenVanJaar, getMaand } from "@/lib/data";
import { MAAND_NAMEN } from "@/lib/types";
import { Card } from "@/components/Card";
import { YearSwitcher } from "@/components/YearSwitcher";
import { formatEURPrecies } from "@/lib/format";
import { MaandForm } from "./MaandForm";

const HUIDIG_JAAR = new Date().getFullYear();
const JAREN = Array.from({ length: HUIDIG_JAAR - 2019 }, (_, i) => 2020 + i);

export default async function MaandoverzichtPage({
  searchParams,
}: {
  searchParams: Promise<{ jaar?: string; maand?: string }>;
}) {
  const sp = await searchParams;
  const nu = new Date();
  const jaar = Number(sp.jaar) || nu.getFullYear();
  const maandNr = Number(sp.maand) || nu.getMonth() + 1;

  const [maanden, huidigeMaand] = await Promise.all([
    listMaandenVanJaar(jaar),
    getMaand(jaar, maandNr),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Maandoverzicht</h1>
        <YearSwitcher jaar={jaar} jaren={JAREN} basePath="/maandoverzicht" />
      </div>

      <Card title={`${MAAND_NAMEN[maandNr - 1]} ${jaar} bewerken`}>
        <MaandForm jaar={jaar} maand={maandNr} data={huidigeMaand} />
      </Card>

      <Card title={`Overzicht ${jaar}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Maand</th>
                <th className="pb-2 text-right">Loon</th>
                <th className="pb-2 text-right">Vaste lasten</th>
                <th className="pb-2 text-right">Doel</th>
                <th className="pb-2 text-right">Werkelijk</th>
                <th className="pb-2 text-right">Belegging</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {maanden.map((m) => (
                <tr key={m.maand} className="border-t border-slate-800">
                  <td className="py-2 text-slate-200">
                    {MAAND_NAMEN[m.maand - 1]}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {formatEURPrecies(m.loon)}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {formatEURPrecies(
                      m.vasteLasten.reduce((s, v) => s + v.bedrag, 0)
                    )}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {formatEURPrecies(m.doelSparen)}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {formatEURPrecies(m.werkelijkGespaard)}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {formatEURPrecies(m.beleggingInleg)}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/maandoverzicht?jaar=${jaar}&maand=${m.maand}`}
                      className="text-emerald-400 hover:underline"
                    >
                      Bewerken
                    </Link>
                  </td>
                </tr>
              ))}
              {maanden.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-slate-500">
                    Nog geen maanden ingevuld voor {jaar}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
