import { getLoonontwikkeling } from "@/lib/data";
import { Card } from "@/components/Card";
import { LoonChart } from "./LoonChart";
import { LoonForm } from "./LoonForm";

export default async function LoonPage() {
  const loonontwikkeling = await getLoonontwikkeling();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Loonontwikkeling</h1>

      <Card title="Verloop door de jaren">
        <LoonChart data={loonontwikkeling} />
      </Card>

      <Card title="Bewerken">
        <LoonForm data={loonontwikkeling} />
      </Card>
    </div>
  );
}
