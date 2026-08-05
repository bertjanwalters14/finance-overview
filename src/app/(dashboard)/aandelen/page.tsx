import { getAandelenPayt } from "@/lib/data";
import { berekenAandelenWaarde } from "@/lib/types";
import { Card } from "@/components/Card";
import { formatEURPrecies } from "@/lib/format";
import { AandelenForm } from "./AandelenForm";

export default async function AandelenPage() {
  const data = await getAandelenPayt();

  const totaalWaarde = data.aandeelhouders.reduce(
    (s, a) => s + berekenAandelenWaarde(a, data.koersPerAandeel),
    0
  );
  const totaalInleg = data.aandeelhouders.reduce((s, a) => s + a.inleg, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Aandelen Payt</h1>

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
