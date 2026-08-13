"use client";

import { useEffect, useState } from "react";
import TeamBadge from "./TeamBadge";
import StatusPill from "./StatusPill";
import { formatDateLong } from "@/lib/format";
import type { MatchWithTeams } from "@/lib/types";

export default function MatchDetailHeader({
  match: initialMatch,
  divisionId,
  roundBased = false,
  scoreLabel = "Mata",
}: {
  match: MatchWithTeams;
  divisionId: string;
  roundBased?: boolean;
  scoreLabel?: string;
}) {
  const [match, setMatch] = useState(initialMatch);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/matches?divisionId=${divisionId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const updated = (data.matches as MatchWithTeams[]).find((m) => m.id === initialMatch.id);
        if (updated) setMatch(updated);
      } catch {
        // keep last known state on transient network errors
      }
    };
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, [divisionId, initialMatch.id]);

  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";
  const showScore = isLive || isFinished;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 p-5 text-white shadow-lg sm:p-8">
      <div
        className="animate-float-slow pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-center gap-2">
        {isLive && match.minute && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            {match.minute}
          </span>
        )}
        <StatusPill status={match.status} />
      </div>

      <div className="relative mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <TeamBadge name={match.teamA.name} shortName={match.teamA.shortName} color={match.teamA.color} size="lg" />
          <span className="text-sm font-semibold sm:text-base">{match.teamA.name}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3 text-3xl font-extrabold tabular-nums sm:text-5xl">
            {showScore ? (
              <>
                <span className={isLive ? "text-red-200" : ""}>{match.scoreA}</span>
                <span className="text-white/40">:</span>
                <span className={isLive ? "text-red-200" : ""}>{match.scoreB}</span>
              </>
            ) : (
              <span className="text-lg font-semibold sm:text-xl">{match.time}</span>
            )}
          </div>
          {roundBased && showScore && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-maroon-100">
              {scoreLabel} dimenangi
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <TeamBadge name={match.teamB.name} shortName={match.teamB.shortName} color={match.teamB.color} size="lg" />
          <span className="text-sm font-semibold sm:text-base">{match.teamB.name}</span>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-maroon-100">
        <span>Pusingan {match.round}</span>
        <span className="opacity-50">·</span>
        <span>{formatDateLong(match.date)}</span>
        <span className="opacity-50">·</span>
        <span>{match.venue}</span>
      </div>

      {roundBased && match.rounds && match.rounds.length > 0 && (
        <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
          {match.rounds.map((r) => (
            <span
              key={r.round}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular-nums text-white"
            >
              Pusingan {r.round}: {r.scoreA}-{r.scoreB}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
