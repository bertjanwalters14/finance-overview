import {
  getLaatsteBesteedbaarVermogen,
  getOverigVermogen,
  getAandelenPayt,
  getMaand,
  getDoelen,
} from "@/lib/data";
import {
  berekenEigenVermogen,
  berekenEigenAandelenWaarde,
  berekenOverwaardeAandeel,
  berekenInkomstenVerhouding,
  vasteLastenTotaal,
  MAAND_NAMEN,
} from "@/lib/types";
import { formatEUR, formatEURPrecies } from "@/lib/format";
import { Card } from "@/components/Card";

export default async function DashboardPage() {
  const nu = new Date();
  const jaar = nu.getFullYear();
  const maandNr = nu.getMonth() + 1;

  const [besteedbaar, overig, aandelen, maand, doelen] = await Promise.all([
    getLaatsteBesteedbaarVermogen(),
    getOverigVermogen(),
    getAandelenPayt(),
    getMaand(jaar, maandNr),
    getDoelen(jaar),
  ]);

  const aandelenPaytWaarde = berekenEigenAandelenWaarde(aandelen);
  const eigenVermogen =
    besteedbaar && overig
      ? berekenEigenVermogen(besteedbaar, overig, aandelenPaytWaarde)
      : null;

  const vasteLastenBedrag = maand ? vasteLastenTotaal(maand) : 0;
  const inkomstenTotaal = (maand?.loon ?? 0) + (maand?.overigeInkomsten ?? 0);
  const overNaVasteLasten = inkomstenTotaal - vasteLastenBedrag;

  const verhouding = maand ? berekenInkomstenVerhouding(maand) : null;
  const vasteLastenBreedte = verhouding
    ? Math.max(0, Math.min(100, verhouding.vasteLastenPercentage))
    : 0;
  const sparenBreedte = verhouding
    ? Math.max(0, Math.min(100 - vasteLastenBreedte, verhouding.sparenPercentage))
    : 0;

  const doelJaarTotaal = doelen?.doelPerMaand.reduce((a, b) => a + b, 0) ?? 0;
  const werkelijkJaarTotaal =
    doelen?.werkelijkPerMaand.reduce((a, b) => a + b, 0) ?? 0;
  const voortgang = doelJaarTotaal > 0 ? werkelijkJaarTotaal / doelJaarTotaal : 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Eigen vermogen">
          {besteedbaar && overig && eigenVermogen !== null ? (
            <>
              <p className="mb-4 text-3xl font-semibold text-white">
                {formatEUR(eigenVermogen)}
              </p>
              <dl className="space-y-1 text-sm">
                <Row label="Spaarrekening" value={besteedbaar.spaarrekening} />
                <Row label="Belegging" value={besteedbaar.belegging} />
                <Row label="Payt aandelen" value={aandelenPaytWaarde} />
                <Row
                  label="Overwaarde (jouw deel)"
                  value={berekenOverwaardeAandeel(overig)}
                />
                <Row label="Schuld" value={-overig.schuld} />
              </dl>
              <p className="mt-3 text-xs text-slate-500">
                Overig vermogen bijgewerkt op {overig.bijgewerktOp}
              </p>
            </>
          ) : (
            <p className="text-slate-500">Nog geen vermogen ingevuld.</p>
          )}
        </Card>

        <Card title={`${MAAND_NAMEN[maandNr - 1]} ${jaar}`}>
          {maand ? (
            <dl className="space-y-1 text-sm">
              <Row label="Loon" value={maand.loon} />
              <Row label="Overige inkomsten" value={maand.overigeInkomsten} />
              <Row label="Vaste lasten" value={-vasteLastenBedrag} />
              <Row label="Over" value={overNaVasteLasten} bold />
              <div className="my-2 border-t border-slate-800" />
              <Row label="Doel sparen" value={maand.doelSparen} />
              <Row label="Werkelijk gespaard" value={maand.werkelijkGespaard} />
              <Row label="Belegging inleg" value={maand.beleggingInleg} />
            </dl>
          ) : (
            <p className="text-slate-500">Nog geen gegevens voor deze maand.</p>
          )}
        </Card>
      </div>

      <Card title={`Inkomstenverdeling ${MAAND_NAMEN[maandNr - 1]}`}>
        {maand && verhouding ? (
          <>
            <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${vasteLastenBreedte}%` }}
              />
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${sparenBreedte}%` }}
              />
            </div>
            <dl className="space-y-1 text-sm">
              <PercentRow
                color="bg-amber-500"
                label="Vaste lasten"
                percentage={verhouding.vasteLastenPercentage}
              />
              <PercentRow
                color="bg-emerald-500"
                label="Sparen"
                percentage={verhouding.sparenPercentage}
              />
              <PercentRow
                color="bg-slate-600"
                label="Overig"
                percentage={verhouding.overigPercentage}
              />
            </dl>
            {verhouding.overigPercentage < 0 && (
              <p className="mt-3 text-xs text-red-400">
                Vaste lasten en sparen samen zijn deze maand{" "}
                {formatEURPrecies(
                  (-verhouding.overigPercentage / 100) *
                    (maand.loon + maand.overigeInkomsten)
                )}{" "}
                boven je inkomen.
              </p>
            )}
          </>
        ) : (
          <p className="text-slate-500">Nog geen gegevens voor deze maand.</p>
        )}
      </Card>

      <Card title={`Spaardoel ${jaar}`}>
        {doelen ? (
          <>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>
                {formatEUR(werkelijkJaarTotaal)} van {formatEUR(doelJaarTotaal)}
              </span>
              <span>{Math.round(voortgang * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${Math.min(100, Math.max(0, voortgang * 100))}%`,
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-slate-500">
            Nog geen doelen ingesteld voor {jaar}.
          </p>
        )}
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "font-semibold text-white" : "text-slate-300"
      }`}
    >
      <dt>{label}</dt>
      <dd>{formatEURPrecies(value)}</dd>
    </div>
  );
}

function PercentRow({
  color,
  label,
  percentage,
}: {
  color: string;
  label: string;
  percentage: number;
}) {
  return (
    <div className="flex items-center justify-between text-slate-300">
      <dt className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </dt>
      <dd>{percentage.toFixed(1)}%</dd>
    </div>
  );
}
