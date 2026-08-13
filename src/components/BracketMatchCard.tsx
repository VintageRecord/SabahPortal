import Link from "next/link";
import TeamBadge from "./TeamBadge";
import StatusPill from "./StatusPill";
import { formatDateShort } from "@/lib/format";
import type { Match, Team } from "@prisma/client";

type BracketMatch = Match & { teamA: Team; teamB: Team; winner: Team | null };

export default function BracketMatchCard({
  match,
  scoreLabel,
  sportSlug,
  divisionSlug,
}: {
  match: BracketMatch;
  scoreLabel: string;
  sportSlug: string;
  divisionSlug: string;
}) {
  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";
  const showScore = isLive || isFinished;

  return (
    <Link
      href={`/sukan/${sportSlug}/${divisionSlug}/perlawanan/${match.id}`}
      className={`block rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        isLive
          ? "border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-900/60 dark:from-red-950/30 dark:to-slate-900"
          : "border-slate-200/70 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-400">
          {isLive && match.minute ? match.minute : !isFinished ? `${formatDateShort(match.date)} · ${match.time}` : match.venue}
        </span>
        <StatusPill status={match.status} />
      </div>
      <div className="space-y-2">
        {(["A", "B"] as const).map((side) => {
          const team = side === "A" ? match.teamA : match.teamB;
          const score = side === "A" ? match.scoreA : match.scoreB;
          const isWinner = match.winnerId === team.id;
          return (
            <div
              key={side}
              className={`flex items-center justify-between gap-2 rounded-xl px-1.5 py-1 ${
                isWinner ? "bg-maroon-50 dark:bg-maroon-950/40" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <TeamBadge name={team.name} shortName={team.shortName} color={team.color} size="sm" />
                <span
                  className={`truncate text-sm ${
                    isWinner
                      ? "font-bold text-maroon-700 dark:text-maroon-300"
                      : "font-medium text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {team.name}
                </span>
                {isWinner && <span className="shrink-0 text-xs">✓</span>}
              </div>
              {showScore && (
                <span
                  className={`shrink-0 text-sm font-extrabold tabular-nums ${
                    isLive ? "text-red-600" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {score}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showScore && (
        <p className="mt-2 text-right text-[10px] text-slate-400">Skor dalam {scoreLabel.toLowerCase()}</p>
      )}
    </Link>
  );
}
