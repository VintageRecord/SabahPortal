import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SportIcon from "@/components/icons/SportIcon";
import AdminMatchCard from "./AdminMatchCard";
import BracketAdmin from "./BracketAdmin";
import { getSettings } from "@/lib/data";
import { computeStandings } from "@/lib/standings";

export default async function AdminDivisionMatchesPage({
  params,
}: {
  params: Promise<{ divisionId: string }>;
}) {
  const { divisionId } = await params;
  const division = await prisma.division.findUnique({
    where: { id: divisionId },
    include: { sport: true },
  });
  if (!division) notFound();

  const [matches, bracketMatches, teams, settings] = await Promise.all([
    prisma.match.findMany({
      where: { divisionId, stage: "GROUP" },
      include: { teamA: true, teamB: true, rounds: { orderBy: { round: "asc" } } },
      orderBy: [{ round: "asc" }, { time: "asc" }],
    }),
    prisma.match.findMany({
      where: { divisionId, stage: { not: "GROUP" } },
      include: { teamA: true, teamB: true, winner: true, rounds: { orderBy: { round: "asc" } } },
      orderBy: [{ stage: "asc" }, { bracketSlot: "asc" }],
    }),
    prisma.team.findMany({ where: { divisionId } }),
    getSettings(),
  ]);

  const standings = computeStandings(teams, matches, {
    pointsWin: settings.pointsWin,
    pointsDraw: settings.pointsDraw,
    pointsLoss: settings.pointsLoss,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/matches" className="text-xs font-medium text-maroon-600 hover:underline">
            ← Semua sukan
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            <SportIcon slug={division.sport.slug} fallback={division.sport.icon} size={20} /> {division.sport.name} · {division.name}
          </h1>
        </div>
        <Link
          href={`/sukan/${division.sport.slug}/${division.slug}`}
          target="_blank"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
        >
          Lihat laman awam ↗
        </Link>
      </div>

      <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        Perlawanan Liga (Round-Robin)
      </h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <AdminMatchCard key={match.id} match={match} sport={division.sport} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-bold text-slate-700 dark:text-slate-200">
        Bracket Play-Off
      </h2>
      <BracketAdmin
        divisionId={divisionId}
        standings={standings}
        bracketMatches={bracketMatches}
        defaultVenue={matches[0]?.venue ?? ""}
        sport={division.sport}
      />
    </div>
  );
}
