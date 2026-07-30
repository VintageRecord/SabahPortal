"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DivisionTabs({
  sportSlug,
  divisionSlug,
}: {
  sportSlug: string;
  divisionSlug: string;
}) {
  const pathname = usePathname();
  const base = `/sukan/${sportSlug}/${divisionSlug}`;

  const tabs = [
    { href: base, label: "Perlawanan", exact: true },
    { href: `${base}/kedudukan`, label: "Kedudukan", exact: false },
    { href: `${base}/strim`, label: "Strim", exact: false },
  ];

  return (
    <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? "border-maroon-600 text-maroon-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
