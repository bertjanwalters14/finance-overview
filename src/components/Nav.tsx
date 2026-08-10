"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/maandoverzicht", label: "Maandoverzicht" },
  { href: "/jaaroverzicht", label: "Jaaroverzicht" },
  { href: "/vermogen", label: "Vermogen" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="whitespace-nowrap text-sm text-slate-500 hover:text-slate-300"
          >
            Uitloggen
          </button>
        </form>
      </div>
    </nav>
  );
}
