import Link from "next/link";

export function Tabs({
  tabs,
  actief,
  basePath,
  extraParams,
}: {
  tabs: { value: string; label: string }[];
  actief: string;
  basePath: string;
  extraParams?: Record<string, string>;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-800">
      {tabs.map((tab) => {
        const params = new URLSearchParams(extraParams);
        params.set("tab", tab.value);
        const isActief = tab.value === actief;
        return (
          <Link
            key={tab.value}
            href={`${basePath}?${params.toString()}`}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm transition ${
              isActief
                ? "border-emerald-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
