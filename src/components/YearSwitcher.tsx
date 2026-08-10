"use client";

import { useRouter } from "next/navigation";
import { inputClass } from "@/components/formStyles";

export function YearSwitcher({
  jaar,
  jaren,
  basePath,
  extraParams,
}: {
  jaar: number;
  jaren: number[];
  basePath: string;
  extraParams?: Record<string, string>;
}) {
  const router = useRouter();

  return (
    <select
      value={jaar}
      onChange={(e) => {
        const params = new URLSearchParams(extraParams);
        params.set("jaar", e.target.value);
        router.push(`${basePath}?${params.toString()}`);
      }}
      className={`${inputClass} w-28`}
    >
      {jaren.map((j) => (
        <option key={j} value={j}>
          {j}
        </option>
      ))}
    </select>
  );
}
