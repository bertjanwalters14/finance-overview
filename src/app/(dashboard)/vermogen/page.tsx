import { getVermogen } from "@/lib/data";
import { berekenEigenVermogen } from "@/lib/types";
import { formatEUR } from "@/lib/format";
import { Card } from "@/components/Card";
import { VermogenForm } from "./VermogenForm";

export default async function VermogenPage() {
  const vermogen = await getVermogen();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Vermogen</h1>

      {vermogen && (
        <Card>
          <p className="text-sm text-slate-400">Huidig eigen vermogen</p>
          <p className="text-3xl font-semibold text-white">
            {formatEUR(berekenEigenVermogen(vermogen))}
          </p>
        </Card>
      )}

      <Card title="Bewerken">
        <VermogenForm data={vermogen} />
      </Card>
    </div>
  );
}
