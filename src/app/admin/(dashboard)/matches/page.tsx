import Link from "next/link";
import SportIcon from "@/components/icons/SportIcon";
import { getSports } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminMatchesIndexPage() {
  const sports = await getSports();
  const liveMatches = await prisma.match.findMany({
    where: { status: "LIVE" },
    include: { teamA: true, teamB: true, division: { include: { sport: true } } },
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">
        Perlawanan & Skor
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Pilih sukan / bahagian untuk urus jadual dan kemas kini skor langsung.
      </p>

      {liveMatches.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">
            Sedang Langsung Sekarang
          </p>
          <div className="flex flex-wrap gap-2">
            {liveMatches.map((m) => (
              <Link
                key={m.id}
                href={`/admin/matches/${m.divisionId}`}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100"
              >
                <SportIcon slug={m.division.sport.slug} fallback={m.division.sport.icon} size={13} className="shrink-0" />
                {m.teamA.shortName} {m.scoreA}-{m.scoreB} {m.teamB.shortName}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <SportIcon slug={sport.slug} fallback={sport.icon} size={16} /> {sport.name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sport.divisions.map((division) => (
                <Link
                  key={division.id}
                  href={`/admin/matches/${division.id}`}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-maroon-100 hover:text-maroon-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {division.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
