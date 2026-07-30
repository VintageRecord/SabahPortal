"use client";

import { useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import type { MatchWithTeamsAndDivision } from "@/lib/types";

export default function LiveMatchesSection({
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
    <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Sedang Berlangsung
        </h2>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
          {matches.length}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} showSport />
        ))}
      </div>
    </section>
  );
}
