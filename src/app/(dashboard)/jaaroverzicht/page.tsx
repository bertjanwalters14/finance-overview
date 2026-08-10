import {
  listDoelenJaren,
  getDoelen,
  listMaandenVanJaar,
  listBesteedbaarVermogenGeschiedenis,
} from "@/lib/data";
import { besteedbaarVermogenTotaal } from "@/lib/types";
import { Card } from "@/components/Card";
import { formatEUR } from "@/lib/format";

interface JaarRij {
  jaar: number;
  doelTotaal: number;
  werkelijkTotaal: number;
  inkomstenTotaal: number | null;
  vasteLastenTotaal: number | null;
  vermogensgroei: number | null;
  vermogensgroeiGeschat: boolean;
}

export default async function JaaroverzichtPage() {
  const jaren = (await listDoelenJaren()).sort((a, b) => a - b);
  const besteedbaarHistorie = await listBesteedbaarVermogenGeschiedenis();

  const rijen: JaarRij[] = await Promise.all(
    jaren.map(async (jaar) => {
      const [doelen, maanden] = await Promise.all([
        getDoelen(jaar),
        listMaandenVanJaar(jaar),
      ]);

      const doelTotaal = doelen?.doelPerMaand.reduce((a, b) => a + b, 0) ?? 0;
      // "Werkelijk gespaard" is sparen + alle categorieën samen (belegging,
      // vakantie, etc.) — dat is wat je dat jaar in totaal hebt weggezet,
      // niet alleen de losse "Werkelijk"-kolom uit de doelen-tabel.
      const categorieenTotaal =
        doelen?.categorieen.reduce(
          (s, c) => s + c.bedragenPerMaand.reduce((a, b) => a + b, 0),
          0
        ) ?? 0;
      const werkelijkTotaal =
        (doelen?.werkelijkPerMaand.reduce((a, b) => a + b, 0) ?? 0) +
        categorieenTotaal;

      const inkomstenTotaal =
        maanden.length > 0
          ? maanden.reduce((s, m) => s + m.loon + m.overigeInkomsten, 0)
          : null;
      const vasteLastenTotaal =
        maanden.length > 0
          ? maanden.reduce(
              (s, m) => s + m.vasteLasten.reduce((s2, v) => s2 + v.bedrag, 0),
              0
            )
          : null;

      // Bij voorkeur de echt gemeten groei (uit besteedbaar-vermogen-
      // punten dat jaar). Zonder minstens 2 punten: schatting = werkelijk
      // gespaard (dat zelf al sparen + categorieën samen is, zie boven).
      const puntenDitJaar = besteedbaarHistorie.filter((p) => p.jaar === jaar);
      const vermogensgroeiGemeten =
        puntenDitJaar.length >= 2
          ? besteedbaarVermogenTotaal(puntenDitJaar[puntenDitJaar.length - 1]) -
            besteedbaarVermogenTotaal(puntenDitJaar[0])
          : null;

      const vermogensgroei = vermogensgroeiGemeten ?? werkelijkTotaal;

      return {
        jaar,
        doelTotaal,
        werkelijkTotaal,
        inkomstenTotaal,
        vasteLastenTotaal,
        vermogensgroei,
        vermogensgroeiGeschat: vermogensgroeiGemeten === null,
      };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Jaaroverzicht</h1>

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
                    <td className="py-2 font-medium text-slate-200">
                      {r.jaar}
                    </td>
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
                      {r.vermogensgroeiGeschat && (
                        <span
                          className="ml-1 text-slate-500"
                          title="Geschat als werkelijk gespaard (geen 2 vermogens-meetpunten dat jaar)"
                        >
                          *
                        </span>
                      )}
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
          vakantie, etc.). Inkomsten/vaste lasten zijn alleen bekend vanaf
          het jaar waarin je het maandoverzicht bent gaan bijhouden.
          Vermogensgroei is gemeten (eerste vs. laatste
          besteedbaar-vermogen-punt dat jaar) waar mogelijk, anders* gelijk
          aan werkelijk gespaard.
        </p>
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
