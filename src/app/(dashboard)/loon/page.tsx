import { getLoonontwikkeling } from "@/lib/data";
import { Card } from "@/components/Card";
import { ExportLink } from "@/components/ExportLink";
import { LoonChart } from "./LoonChart";
import { LoonForm } from "./LoonForm";

export default async function LoonPage() {
  const loonontwikkeling = await getLoonontwikkeling();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <h1 className="text-2xl font-semibold text-white">Loonontwikkeling</h1>
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
