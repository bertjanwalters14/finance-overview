import Link from "next/link";
import {
  getLaatsteBesteedbaarVermogen,
  getOverigVermogen,
  getAandelenPayt,
  listBesteedbaarVermogenGeschiedenis,
  listNietBesteedbaarGeschiedenis,
  getLoonontwikkeling,
} from "@/lib/data";
import {
  berekenEigenVermogen,
  berekenEigenAandelenWaarde,
  berekenAandelenWaarde,
  besteedbaarVermogenTotaal,
} from "@/lib/types";
import { formatEUR, formatEURPrecies } from "@/lib/format";
import { Card } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { ExportLink } from "@/components/ExportLink";
import { BesteedbaarVermogenForm } from "./BesteedbaarVermogenForm";
import { OverigVermogenForm } from "./OverigVermogenForm";
import { VermogenChart } from "./VermogenChart";
import { AandelenForm } from "./AandelenForm";
import { LoonChart } from "./LoonChart";
import { LoonForm } from "./LoonForm";

const TAB_WAARDEN = ["overzicht", "aandelen", "loon"] as const;

export default async function VermogenPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const tab = (TAB_WAARDEN as readonly string[]).includes(sp.tab ?? "")
    ? (sp.tab as (typeof TAB_WAARDEN)[number])
    : "overzicht";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Vermogen</h1>

      <Tabs
        basePath="/vermogen"
        actief={tab}
        tabs={[
          { value: "overzicht", label: "Overzicht" },
          { value: "aandelen", label: "Aandelen Payt" },
          { value: "loon", label: "Loonontwikkeling" },
        ]}
      />

      {tab === "overzicht" && <OverzichtTab />}
      {tab === "aandelen" && <AandelenTab />}
      {tab === "loon" && <LoonTab />}
    </div>
  );
}

async function OverzichtTab() {
  const [
    laatsteBesteedbaar,
    overig,
    aandelen,
    geschiedenis,
    nietBesteedbaarGeschiedenis,
  ] = await Promise.all([
    getLaatsteBesteedbaarVermogen(),
    getOverigVermogen(),
    getAandelenPayt(),
    listBesteedbaarVermogenGeschiedenis(),
    listNietBesteedbaarGeschiedenis(),
  ]);

  const aandelenPaytWaarde = berekenEigenAandelenWaarde(aandelen);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <ExportLink href="/api/export/vermogen" />
      </div>

      {laatsteBesteedbaar && overig && (
        <Card>
          <p className="text-sm text-slate-400">Huidig eigen vermogen</p>
          <p className="text-3xl font-semibold text-white">
            {formatEUR(
              berekenEigenVermogen(laatsteBesteedbaar, overig, aandelenPaytWaarde)
            )}
          </p>
        </Card>
      )}

      <Card title="Vermogen door de tijd">
        {geschiedenis.length > 0 || nietBesteedbaarGeschiedenis.length > 0 ? (
          <VermogenChart
            besteedbaar={geschiedenis}
            nietBesteedbaar={nietBesteedbaarGeschiedenis}
          />
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

      <Card title="Overig vermogen (huis, hypotheek, schuld)">
        <p className="mb-4 text-sm text-slate-500">
          Verandert zelden — pas aan wanneer de werkelijke stand echt wijzigt.
          Payt aandelen ({formatEURPrecies(aandelenPaytWaarde)}) tel je hier
          niet los in — die waarde komt automatisch mee vanuit de{" "}
          <Link
            href="/vermogen?tab=aandelen"
            className="text-emerald-400 hover:underline"
          >
            Aandelen Payt-tab
          </Link>
          .
        </p>
        <OverigVermogenForm data={overig} />
      </Card>
    </div>
  );
}

async function AandelenTab() {
  const data = await getAandelenPayt();

  const totaalWaarde = data.aandeelhouders.reduce(
    (s, a) => s + berekenAandelenWaarde(a, data.koersPerAandeel),
    0
  );
  const totaalInleg = data.aandeelhouders.reduce((s, a) => s + a.inleg, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <ExportLink href="/api/export/aandelen" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Totale waarde">
          <p className="text-3xl font-semibold text-white">
            {formatEURPrecies(totaalWaarde)}
          </p>
        </Card>
        <Card title="Totale inleg">
          <p className="text-3xl font-semibold text-white">
            {formatEURPrecies(totaalInleg)}
          </p>
        </Card>
      </div>

      <Card title="Aandeelhouders">
        <AandelenForm data={data} />
      </Card>
    </div>
  );
}

async function LoonTab() {
  const loonontwikkeling = await getLoonontwikkeling();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <ExportLink href="/api/export/loon" />
      </div>

      <Card title="Verloop door de jaren">
        <LoonChart data={loonontwikkeling} />
      </Card>

      <Card title="Bewerken">
        <LoonForm data={loonontwikkeling} />
      </Card>
    </div>
  );
}
