import { redirect } from "next/navigation";

export default async function JaardoelenRedirect({
  searchParams,
}: {
  searchParams: Promise<{ jaar?: string }>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams({ tab: "maanden" });
  if (sp.jaar) params.set("jaar", sp.jaar);
  redirect(`/jaaroverzicht?${params.toString()}`);
}
