import { notFound } from "next/navigation";
import TeamBadge from "@/components/TeamBadge";
import { getDivision, getDivisionMatches, getDivisionTeams, getSettings } from "@/lib/data";
import { computeStandings } from "@/lib/standings";

export default async function DivisionStandingsPage({
  params,
}: {
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const result = await getDivision(sportSlug, divisionSlug);
  if (!result) notFound();

  const [teams, matches, settings] = await Promise.all([
    getDivisionTeams(result.division.id),
    getDivisionMatches(result.division.id),
    getSettings(),
  ]);

  const standings = computeStandings(teams, matches, {
    pointsWin: settings.pointsWin,
    pointsDraw: settings.pointsDraw,
    pointsLoss: settings.pointsLoss,
  });

  const anyPlayed = standings.some((row) => row.played > 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Kedudukan Liga (Round-Robin)
        </h2>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Menang {settings.pointsWin} mata · Seri {settings.pointsDraw} mata · Kalah{" "}
          {settings.pointsLoss} mata
        </p>
      </div>

      {!anyPlayed && (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          Belum ada perlawanan yang tamat. Jadual menunjukkan semua pasukan dengan 0 mata.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200/70 shadow-sm dark:border-slate-800">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <th className="w-10 px-3 py-2 text-center">#</th>
              <th className="px-3 py-2">Pasukan</th>
              <th className="w-10 px-2 py-2 text-center">M</th>
              <th className="w-10 px-2 py-2 text-center">M</th>
              <th className="w-10 px-2 py-2 text-center">S</th>
              <th className="w-10 px-2 py-2 text-center">K</th>
              <th className="w-14 px-2 py-2 text-center">Jf</th>
              <th className="w-14 px-2 py-2 text-center">Jl</th>
              <th className="w-14 px-2 py-2 text-center">Beza</th>
              <th className="w-14 px-3 py-2 text-center">Mata</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, idx) => (
              <tr
                key={row.team.id}
                className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      idx === 0
                        ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm"
                        : idx === 1
                          ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm"
                          : idx === 2
                            ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm"
                            : "text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <TeamBadge
                      name={row.team.name}
                      shortName={row.team.shortName}
                      color={row.team.color}
                      size="sm"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {row.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.played}
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.win}
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.draw}
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.loss}
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.pointsFor}
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.pointsAgainst}
                </td>
                <td className="px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                  {row.diff > 0 ? `+${row.diff}` : row.diff}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-maroon-50 px-2 py-0.5 text-sm font-extrabold text-maroon-700 dark:bg-maroon-950 dark:text-maroon-300">
                    {row.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        M = Dimainkan, M = Menang, S = Seri, K = Kalah, Jf = Jaringan/Mata Dibuat, Jl =
        Jaringan/Mata Dilepaskan
      </p>
    </div>
  );
}
