import { getDoelen, listDoelenJaren } from "@/lib/data";
import { Card } from "@/components/Card";
import { YearSwitcher } from "@/components/YearSwitcher";
import { DoelenChart } from "./DoelenChart";
import { DoelenForm } from "./DoelenForm";

export default async function JaardoelenPage({
  searchParams,
}: {
  searchParams: Promise<{ jaar?: string }>;
}) {
  const sp = await searchParams;
  const nu = new Date();
  const jaar = Number(sp.jaar) || nu.getFullYear();

  const [doelen, beschikbareJaren] = await Promise.all([
    getDoelen(jaar),
    listDoelenJaren(),
  ]);

  const jaren = Array.from(
    new Set([...beschikbareJaren, nu.getFullYear(), nu.getFullYear() + 1])
  ).sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Jaardoelen</h1>
        <YearSwitcher jaar={jaar} jaren={jaren} basePath="/jaardoelen" />
      </div>

      <Card title={`Doel vs werkelijk ${jaar}`}>
        <DoelenChart
          doelPerMaand={doelen?.doelPerMaand ?? Array(12).fill(0)}
          werkelijkPerMaand={doelen?.werkelijkPerMaand ?? Array(12).fill(0)}
        />
      </Card>

      <Card title={`Doelen ${jaar} bewerken`}>
        <DoelenForm jaar={jaar} data={doelen} />
      </Card>
    </div>
  );
}
