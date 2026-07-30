"use client";

import { useEffect, useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import { formatDateLong } from "@/lib/format";
import type { MatchWithTeams } from "@/lib/types";

type FilterKey = "ALL" | "LIVE" | "UPCOMING" | "FINISHED";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "LIVE", label: "Langsung" },
  { key: "UPCOMING", label: "Akan Datang" },
  { key: "FINISHED", label: "Tamat" },
];

export default function DivisionFixtures({
  divisionId,
  initialMatches,
}: {
  divisionId: string;
  initialMatches: MatchWithTeams[];
}) {
  const [matches, setMatches] = useState(initialMatches);
  const [filter, setFilter] = useState<FilterKey>("ALL");

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/matches?divisionId=${divisionId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setMatches(data.matches);
      } catch {
        // keep last known state on transient network errors
      }
    };
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, [divisionId]);

  const counts = useMemo(
    () => ({
      ALL: matches.length,
      LIVE: matches.filter((m) => m.status === "LIVE").length,
      UPCOMING: matches.filter((m) => m.status === "UPCOMING").length,
      FINISHED: matches.filter((m) => m.status === "FINISHED").length,
    }),
    [matches]
  );

  const filtered = useMemo(
    () => (filter === "ALL" ? matches : matches.filter((m) => m.status === filter)),
    [matches, filter]
  );

  const grouped = useMemo(() => {
    const byRound = new Map<number, MatchWithTeams[]>();
    for (const match of filtered) {
      const list = byRound.get(match.round) ?? [];
      list.push(match);
      byRound.set(match.round, list);
    }
    return [...byRound.entries()].sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f.key
                ? "bg-gradient-to-r from-maroon-600 to-maroon-500 text-white shadow-sm shadow-maroon-200 dark:shadow-none"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          Tiada perlawanan.
        </p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([round, roundMatches]) => (
            <div key={round}>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Pusingan {round}
                <span className="text-xs font-normal text-slate-400">
                  · {formatDateLong(roundMatches[0].date)}
                </span>
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {roundMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
