import {
  listDoelenJaren,
  getDoelen,
  listMaandenVanJaar,
  listBesteedbaarVermogenGeschiedenis,
} from "@/lib/data";
import {
  besteedbaarVermogenTotaal,
  vasteLastenTotaal,
  afgeleideDoelenUitMaanden,
} from "@/lib/types";
import type { JaarDoelen } from "@/lib/types";
import { Card } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { YearSwitcher } from "@/components/YearSwitcher";
import { ExportLink } from "@/components/ExportLink";
import { formatEUR } from "@/lib/format";
import { DoelenChart } from "./DoelenChart";
import { DoelenForm } from "./DoelenForm";

interface JaarRij {
  jaar: number;
  doelTotaal: number;
  werkelijkTotaal: number;
  inkomstenTotaal: number | null;
  vasteLastenTotaal: number | null;
  vermogensgroei: number | null;
}

export default async function JaaroverzichtPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; jaar?: string }>;
}) {
  const sp = await searchParams;
  const tab = sp.tab === "maanden" ? "maanden" : "jaren";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Jaaroverzicht</h1>

      <Tabs
        basePath="/jaaroverzicht"
        actief={tab}
        tabs={[
          { value: "jaren", label: "Jaren vergelijken" },
          { value: "maanden", label: "Per maand" },
        ]}
      />

      {tab === "jaren" ? <JarenVergelekenTab /> : <PerMaandTab jaarParam={sp.jaar} />}
    </div>
  );
}

async function JarenVergelekenTab() {
  const jaren = (await listDoelenJaren()).sort((a, b) => a - b);
  const besteedbaarHistorie = await listBesteedbaarVermogenGeschiedenis();

  const rijen: JaarRij[] = await Promise.all(
    jaren.map(async (jaar) => {
      const [doelen, maanden] = await Promise.all([
        getDoelen(jaar),
        listMaandenVanJaar(jaar),
      ]);

      const heeftMaandData = maanden.length > 0;
      // Voor jaren met maandoverzicht-data zijn Doel/Werkelijk al bekend uit
      // de Maand-records (zie /maandoverzicht) — die zijn dan leidend, niet
      // de (mogelijk verouderde) los opgeslagen JaarDoelen-cijfers.
      const afgeleid = heeftMaandData
        ? afgeleideDoelenUitMaanden(maanden)
        : null;

      const doelTotaal = afgeleid
        ? afgeleid.doelPerMaand.reduce((a, b) => a + b, 0)
        : doelen?.doelPerMaand.reduce((a, b) => a + b, 0) ?? 0;

      const inkomstenTotaal = heeftMaandData
        ? maanden.reduce((s, m) => s + m.loon + m.overigeInkomsten, 0)
        : null;

      const sparenTotaal = afgeleid
        ? afgeleid.werkelijkPerMaand.reduce((a, b) => a + b, 0)
        : doelen?.werkelijkPerMaand.reduce((a, b) => a + b, 0) ?? 0;

      // "Werkelijk gespaard" is sparen + alle categorieën samen (belegging,
      // vakantie, etc.), behalve voor jaren MET maandoverzicht-data: daar
      // komt "Belegging" uit dezelfde pot als het sparen-doel (bv.
      // automatisch beleggen vanuit je spaarrekening bij Trade Republic),
      // dus die telt dan niet nog eens los mee. Overige categorieën
      // (bv. Vakantie) tellen wél altijd mee, ook in maandoverzicht-jaren.
      const categorieenOverigTotaal = (doelen?.categorieen ?? [])
        .filter((c) => c.naam.trim().toLowerCase() !== "belegging")
        .reduce((s, c) => s + c.bedragenPerMaand.reduce((a, b) => a + b, 0), 0);
      const beleggingTotaal = heeftMaandData
        ? 0
        : doelen?.categorieen
            .find((c) => c.naam.trim().toLowerCase() === "belegging")
            ?.bedragenPerMaand.reduce((a, b) => a + b, 0) ?? 0;
      const werkelijkTotaal =
        sparenTotaal + categorieenOverigTotaal + beleggingTotaal;
      const vasteLastenSom =
        maanden.length > 0
          ? maanden.reduce((s, m) => s + vasteLastenTotaal(m), 0)
          : null;

      // Alleen tonen als we hem echt gemeten hebben (eerste vs. laatste
      // besteedbaar-vermogen-punt dat jaar) — geen schatting, dat gaf een
      // vertekend beeld.
      const puntenDitJaar = besteedbaarHistorie.filter((p) => p.jaar === jaar);
      const vermogensgroei =
        puntenDitJaar.length >= 2
          ? besteedbaarVermogenTotaal(puntenDitJaar[puntenDitJaar.length - 1]) -
            besteedbaarVermogenTotaal(puntenDitJaar[0])
          : null;

      return {
        jaar,
        doelTotaal,
        werkelijkTotaal,
        inkomstenTotaal,
        vasteLastenTotaal: vasteLastenSom,
        vermogensgroei,
      };
    })
  );

  return (
    <Card title="Jaren vergeleken">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pr-4 pb-2">Jaar</th>
              <th className="pr-4 pb-2 text-right">Doel gespaard</th>
              <th className="pr-4 pb-2 text-right">Werkelijk gespaard</th>
              <th className="pr-4 pb-2 text-right">Inkomsten</th>
              <th className="pr-4 pb-2 text-right">Vaste lasten</th>
              <th className="pr-4 pb-2 text-right">Vermogensgroei</th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((r, i) => {
              const vorige = i > 0 ? rijen[i - 1] : null;
              return (
                <tr key={r.jaar} className="border-t border-slate-800">
                  <td className="py-2 font-medium text-slate-200">{r.jaar}</td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {formatEUR(r.doelTotaal)}
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {formatEUR(r.werkelijkTotaal)}
                    <Delta
                      huidig={r.werkelijkTotaal}
                      vorig={vorige?.werkelijkTotaal ?? null}
                    />
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {r.inkomstenTotaal !== null
                      ? formatEUR(r.inkomstenTotaal)
                      : "—"}
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {r.vasteLastenTotaal !== null
                      ? formatEUR(r.vasteLastenTotaal)
                      : "—"}
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">
                    {r.vermogensgroei !== null
                      ? formatEUR(r.vermogensgroei)
                      : "—"}
                    <Delta
                      huidig={r.vermogensgroei}
                      vorig={vorige?.vermogensgroei ?? null}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Werkelijk gespaard is sparen + alle categorieën samen (belegging,
        vakantie, etc.). Inkomsten/vaste lasten zijn alleen bekend vanaf het
        jaar waarin je het maandoverzicht bent gaan bijhouden. Vermogensgroei
        toont alleen een waarde als er minstens 2
        besteedbaar-vermogen-punten in dat jaar bekend zijn.
      </p>
    </Card>
  );
}

async function PerMaandTab({ jaarParam }: { jaarParam?: string }) {
  const nu = new Date();
  const jaar = Number(jaarParam) || nu.getFullYear();

  const [doelen, beschikbareJaren, maanden] = await Promise.all([
    getDoelen(jaar),
    listDoelenJaren(),
    listMaandenVanJaar(jaar),
  ]);

  const jaren = Array.from(
    new Set([...beschikbareJaren, nu.getFullYear(), nu.getFullYear() + 1])
  ).sort((a, b) => b - a);

  const heeftMaandData = maanden.length > 0;
  const afgeleid = heeftMaandData ? afgeleideDoelenUitMaanden(maanden) : null;

  const doelenEffectief: JaarDoelen = {
    jaar,
    doelPerMaand: afgeleid?.doelPerMaand ?? doelen?.doelPerMaand ?? Array(12).fill(0),
    werkelijkPerMaand:
      afgeleid?.werkelijkPerMaand ?? doelen?.werkelijkPerMaand ?? Array(12).fill(0),
    categorieen: heeftMaandData
      ? (doelen?.categorieen ?? []).filter(
          (c) => c.naam.trim().toLowerCase() !== "belegging"
        )
      : doelen?.categorieen ?? [],
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-4">
          <ExportLink href={`/api/export/jaardoelen?jaar=${jaar}`} />
        </div>
        <YearSwitcher
          jaar={jaar}
          jaren={jaren}
          basePath="/jaaroverzicht"
          extraParams={{ tab: "maanden" }}
        />
      </div>

      <Card title={`Doel vs werkelijk ${jaar}`}>
        <DoelenChart
          doelPerMaand={doelenEffectief.doelPerMaand}
          werkelijkPerMaand={doelenEffectief.werkelijkPerMaand}
        />
      </Card>

      <Card title={`Doelen ${jaar} bewerken`}>
        <DoelenForm
          jaar={jaar}
          data={doelenEffectief}
          alleenLezenKolommen={heeftMaandData}
          beleggingPerMaand={afgeleid?.beleggingPerMaand}
        />
      </Card>
    </div>
  );
}

function Delta({
  huidig,
  vorig,
}: {
  huidig: number | null;
  vorig: number | null;
}) {
  if (huidig === null || vorig === null || vorig === 0) return null;
  const verschil = huidig - vorig;
  const percentage = (verschil / Math.abs(vorig)) * 100;
  const positief = verschil >= 0;

  return (
    <span
      className={`ml-2 text-xs ${positief ? "text-emerald-400" : "text-red-400"}`}
    >
      {positief ? "+" : ""}
      {percentage.toFixed(0)}%
    </span>
  );
}
