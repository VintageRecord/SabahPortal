"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DivisionTabs({
  sportSlug,
  divisionSlug,
  hasBracket = false,
}: {
  sportSlug: string;
  divisionSlug: string;
  hasBracket?: boolean;
}) {
  const pathname = usePathname();
  const base = `/sukan/${sportSlug}/${divisionSlug}`;

  const tabs = [
    { href: base, label: "Perlawanan", exact: true },
    { href: `${base}/kedudukan`, label: "Kedudukan", exact: false },
    ...(hasBracket ? [{ href: `${base}/carta`, label: "Carta", exact: false }] : []),
    { href: `${base}/strim`, label: "Strim", exact: false },
  ];

  return (
    <div className="inline-flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800/70">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-white text-maroon-600 shadow-sm dark:bg-slate-950 dark:text-maroon-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
