"use client";

import { useRouter } from "next/navigation";
import { inputClass } from "@/components/formStyles";

export function YearSwitcher({
  jaar,
  jaren,
  basePath,
}: {
  jaar: number;
  jaren: number[];
  basePath: string;
}) {
  const router = useRouter();

  return (
    <select
      value={jaar}
      onChange={(e) => router.push(`${basePath}?jaar=${e.target.value}`)}
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
