"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="sticky top-0 z-40 border-b border-maroon-900/20 bg-maroon-700 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-lg">
            🏆
          </span>
          <span className="hidden text-base leading-tight sm:block">
            {title}
          </span>
          <span className="text-base leading-tight sm:hidden">Sukan 2026</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 transition hover:bg-white/10 ${
                pathname === link.href ? "bg-white/15" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button
              onClick={() => setSportsOpen((v) => !v)}
              onBlur={() => setTimeout(() => setSportsOpen(false), 150)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 transition hover:bg-white/10 ${
                pathname.startsWith("/sukan") ? "bg-white/15" : ""
              }`}
            >
              Sukan
              <span className="text-xs">{sportsOpen ? "▲" : "▼"}</span>
            </button>
            {sportsOpen && (
              <div className="absolute right-0 top-full mt-2 grid w-72 grid-cols-1 gap-0.5 rounded-xl bg-white p-2 text-slate-700 shadow-xl">
                {sports.map((sport) => (
                  <Link
                    key={sport.slug}
                    href={`/sukan/${sport.slug}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    <span>{sport.icon}</span>
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
          className="rounded-lg p-2 hover:bg-white/10 md:hidden"
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
        <div className="border-t border-white/10 bg-maroon-700 md:hidden">
          <div className="max-h-[75vh] overflow-y-auto px-3 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10"
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10"
                >
                  <span>{sport.icon}</span>
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
