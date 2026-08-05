import {
  getLaatsteBesteedbaarVermogen,
  getOverigVermogen,
  listBesteedbaarVermogenGeschiedenis,
} from "@/lib/data";
import { berekenEigenVermogen, besteedbaarVermogenTotaal } from "@/lib/types";
import { formatEUR } from "@/lib/format";
import { Card } from "@/components/Card";
import { ExportLink } from "@/components/ExportLink";
import { BesteedbaarVermogenForm } from "./BesteedbaarVermogenForm";
import { OverigVermogenForm } from "./OverigVermogenForm";
import { VermogenChart } from "./VermogenChart";

export default async function VermogenPage() {
  const [laatsteBesteedbaar, overig, geschiedenis] = await Promise.all([
    getLaatsteBesteedbaarVermogen(),
    getOverigVermogen(),
    listBesteedbaarVermogenGeschiedenis(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <h1 className="text-2xl font-semibold text-white">Vermogen</h1>
        <ExportLink href="/api/export/vermogen" />
      </div>

      {laatsteBesteedbaar && overig && (
        <Card>
          <p className="text-sm text-slate-400">Huidig eigen vermogen</p>
          <p className="text-3xl font-semibold text-white">
            {formatEUR(berekenEigenVermogen(laatsteBesteedbaar, overig))}
          </p>
        </Card>
      )}

      <Card title="Besteedbaar vermogen door de tijd">
        {geschiedenis.length > 0 ? (
          <VermogenChart data={geschiedenis} />
        ) : (
          <p className="text-slate-500">
            Nog geen historische punten. Sla hieronder je eerste maand op.
          </p>
        )}
      </Card>

      <Card
        title={`Besteedbaar vermogen bewerken${
          laatsteBesteedbaar
            ? ` (huidig: ${formatEUR(
                besteedbaarVermogenTotaal(laatsteBesteedbaar)
              )})`
            : ""
        }`}
      >
        <p className="mb-4 text-sm text-slate-500">
          Wordt opgeslagen als het punt voor de huidige maand. Nogmaals
          opslaan deze maand overschrijft dat punt.
        </p>
        <BesteedbaarVermogenForm data={laatsteBesteedbaar} />
      </Card>

      <Card title="Overig vermogen (huis, hypotheek, aandelen, schuld)">
        <p className="mb-4 text-sm text-slate-500">
          Verandert zelden — pas aan wanneer de werkelijke stand echt wijzigt.
        </p>
        <OverigVermogenForm data={overig} />
      </Card>
    </div>
  );
}
