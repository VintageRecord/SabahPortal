"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SportIcon from "./icons/SportIcon";
import type { MatchWithTeamsAndDivision } from "@/lib/types";

export default function LiveTicker({
  initialMatches,
}: {
  initialMatches: MatchWithTeamsAndDivision[];
}) {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setMatches(data.matches);
      } catch {
        // ignore transient network errors, keep showing last known state
      }
    };
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, []);

  if (matches.length === 0) return null;

  return (
    <div className="border-b border-red-100 bg-red-50 dark:border-red-950 dark:bg-red-950/30">
      <div className="mx-auto flex max-w-6xl items-stretch gap-3 overflow-x-auto px-3 py-2 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5 pr-2 text-xs font-bold text-red-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
          </span>
          LANGSUNG
        </div>
        {matches.map((m) => (
          <Link
            key={m.id}
            href={`/sukan/${m.division.sport.slug}/${m.division.slug}`}
            className="flex shrink-0 flex-col justify-center rounded-lg bg-white px-3 py-1 text-xs shadow-sm dark:bg-slate-900"
          >
            <span className="mb-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <SportIcon slug={m.division.sport.slug} fallback={m.division.sport.icon} size={10} className="shrink-0" />
              {m.division.sport.name} · {m.division.name}
            </span>
            <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              {m.teamA.shortName} {m.scoreA} - {m.scoreB} {m.teamB.shortName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
