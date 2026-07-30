import Link from "next/link";
import TeamBadge from "./TeamBadge";
import StatusPill from "./StatusPill";
import SportIcon from "./icons/SportIcon";
import { formatDateShort } from "@/lib/format";
import type { MatchWithTeams, MatchWithTeamsAndDivision } from "@/lib/types";

function hasSportContext(
  match: MatchWithTeams | MatchWithTeamsAndDivision
): match is MatchWithTeamsAndDivision {
  return "division" in match;
}

export default function MatchCard({
  match,
  showSport = false,
  sportSlug,
  divisionSlug,
}: {
  match: MatchWithTeams | MatchWithTeamsAndDivision;
  showSport?: boolean;
  sportSlug?: string;
  divisionSlug?: string;
}) {
  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";
  const showScore = isLive || isFinished;

  const resolvedSportSlug = hasSportContext(match) ? match.division.sport.slug : sportSlug;
  const resolvedDivisionSlug = hasSportContext(match) ? match.division.slug : divisionSlug;

  const content = (
    <div
      className={`rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4 ${
        isLive
          ? "border-red-200 bg-gradient-to-br from-red-50 to-white shadow-red-100 dark:border-red-900/60 dark:from-red-950/30 dark:to-slate-900 dark:shadow-none"
          : "border-slate-200/70 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {showSport && hasSportContext(match) && (
            <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-maroon-600 dark:text-maroon-400">
              <SportIcon slug={match.division.sport.slug} fallback={match.division.sport.icon} size={12} className="shrink-0" />
              <span className="truncate">
                {match.division.sport.name} · {match.division.name}
              </span>
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isLive && match.minute && (
            <span className="text-[11px] font-bold text-red-600">{match.minute}</span>
          )}
          {!isLive && !isFinished && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {formatDateShort(match.date)} · {match.time}
            </span>
          )}
          <StatusPill status={match.status} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <TeamBadge name={match.teamA.name} shortName={match.teamA.shortName} color={match.teamA.color} size="sm" />
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {match.teamA.name}
            </span>
          </div>
          {showScore && (
            <span className={`shrink-0 text-base font-extrabold tabular-nums ${isLive ? "text-red-600" : "text-slate-700 dark:text-slate-200"}`}>
              {match.scoreA}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <TeamBadge name={match.teamB.name} shortName={match.teamB.shortName} color={match.teamB.color} size="sm" />
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {match.teamB.name}
            </span>
          </div>
          {showScore && (
            <span className={`shrink-0 text-base font-extrabold tabular-nums ${isLive ? "text-red-600" : "text-slate-700 dark:text-slate-200"}`}>
              {match.scoreB}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
        <span className="block truncate text-[11px] text-slate-400">{match.venue}</span>
      </div>
    </div>
  );

  if ((isLive || isFinished) && resolvedSportSlug && resolvedDivisionSlug) {
    return (
      <Link
        href={`/sukan/${resolvedSportSlug}/${resolvedDivisionSlug}/perlawanan/${match.id}`}
        className="block"
      >
        {content}
      </Link>
    );
  }

  if (hasSportContext(match)) {
    return (
      <Link href={`/sukan/${match.division.sport.slug}/${match.division.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
