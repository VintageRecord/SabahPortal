"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Papan Pemuka" },
  { href: "/admin/matches", label: "Perlawanan & Skor" },
  { href: "/admin/teams", label: "Pasukan" },
  { href: "/admin/streams", label: "Strim" },
  { href: "/admin/settings", label: "Tetapan" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-medium transition ${
              active
                ? "bg-gradient-to-r from-maroon-600 to-maroon-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
