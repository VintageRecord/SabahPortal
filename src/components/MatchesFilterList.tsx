"use client";

import { useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import type { MatchWithTeams, MatchWithTeamsAndDivision } from "@/lib/types";

type FilterKey = "ALL" | "LIVE" | "UPCOMING" | "FINISHED";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "LIVE", label: "Langsung" },
  { key: "UPCOMING", label: "Akan Datang" },
  { key: "FINISHED", label: "Tamat" },
];

export default function MatchesFilterList({
  matches,
  showSport = false,
  emptyLabel = "Tiada perlawanan.",
}: {
  matches: (MatchWithTeams | MatchWithTeamsAndDivision)[];
  showSport?: boolean;
  emptyLabel?: string;
}) {
  const [filter, setFilter] = useState<FilterKey>("ALL");

  const counts = useMemo(() => {
    return {
      ALL: matches.length,
      LIVE: matches.filter((m) => m.status === "LIVE").length,
      UPCOMING: matches.filter((m) => m.status === "UPCOMING").length,
      FINISHED: matches.filter((m) => m.status === "FINISHED").length,
    };
  }, [matches]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return matches;
    return matches.filter((m) => m.status === filter);
  }, [matches, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f.key
                ? "bg-maroon-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} showSport={showSport} />
          ))}
        </div>
      )}
    </div>
  );
}
