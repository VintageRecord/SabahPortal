"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SportIcon from "./icons/SportIcon";

interface SportNavItem {
  slug: string;
  name: string;
  icon: string;
  divisions: { slug: string; name: string }[];
}

const NAV_LINKS = [
  { href: "/", label: "Utama" },
  { href: "/jadual", label: "Jadual" },
  { href: "/strim", label: "Siaran Langsung" },
];

export default function Header({ sports, title }: { sports: SportNavItem[]; title: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-white/10 bg-gradient-to-r from-maroon-900 via-maroon-700 to-maroon-800 text-white shadow-lg shadow-maroon-950/20">
      <div
        className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold" onClick={() => setMenuOpen(false)}>
          <span className="glass flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-lg shadow-inner">
            🏆
          </span>
          <span className="hidden text-base leading-tight tracking-tight sm:block">
            {title}
          </span>
          <span className="text-base leading-tight tracking-tight sm:hidden">Sukan 2026</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 transition ${
                pathname === link.href ? "glass shadow-sm" : "hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button
              onClick={() => setSportsOpen((v) => !v)}
              onBlur={() => setTimeout(() => setSportsOpen(false), 150)}
              className={`flex items-center gap-1 rounded-full px-4 py-2 transition ${
                pathname.startsWith("/sukan") ? "glass shadow-sm" : "hover:bg-white/10"
              }`}
            >
              Sukan
              <span className={`text-xs transition-transform ${sportsOpen ? "rotate-180" : ""}`}>▼</span>
            </button>
            {sportsOpen && (
              <div className="absolute right-0 top-full mt-2 grid w-72 grid-cols-1 gap-0.5 rounded-2xl border border-slate-100 bg-white/95 p-2 text-slate-700 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100">
                {sports.map((sport) => (
                  <Link
                    key={sport.slug}
                    href={`/sukan/${sport.slug}`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-maroon-50 dark:hover:bg-slate-800"
                  >
                    <SportIcon slug={sport.slug} fallback={sport.icon} size={16} className="shrink-0 text-maroon-600 dark:text-maroon-400" />
                    <span className="flex-1">{sport.name}</span>
                    {sport.divisions.length > 1 && (
                      <span className="text-[11px] text-slate-400">
                        {sport.divisions.map((d) => d.name).join(" / ")}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button
          className="relative rounded-full p-2 hover:bg-white/10 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Buka menu"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="relative border-t border-white/10 bg-maroon-800/95 backdrop-blur-md md:hidden">
          <div className="max-h-[75vh] overflow-y-auto px-3 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-white/60">
                Sukan
              </p>
              {sports.map((sport) => (
                <Link
                  key={sport.slug}
                  href={`/sukan/${sport.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
                >
                  <SportIcon slug={sport.slug} fallback={sport.icon} size={16} className="shrink-0" />
                  <span className="flex-1">{sport.name}</span>
                  {sport.divisions.length > 1 && (
                    <span className="text-[11px] text-white/50">
                      {sport.divisions.map((d) => d.name).join(" / ")}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
