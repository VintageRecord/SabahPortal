import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TeamBadge from "@/components/TeamBadge";
import StatusPill from "@/components/StatusPill";
import { toDateKey } from "@/lib/format";
import { adjustScoreAction, setMatchStatusAction, updateMatchDetailsAction } from "./actions";

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

  const matches = await prisma.match.findMany({
    where: { divisionId },
    include: { teamA: true, teamB: true },
    orderBy: [{ round: "asc" }, { time: "asc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/matches" className="text-xs font-medium text-indigo-600 hover:underline">
            ← Semua sukan
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            <span>{division.sport.icon}</span> {division.sport.name} · {division.name}
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

      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400">
                Pusingan {match.round} · {match.time} · {match.venue}
              </span>
              <StatusPill status={match.status} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="flex items-center gap-2">
                <TeamBadge name={match.teamA.name} shortName={match.teamA.shortName} color={match.teamA.color} />
                <span className="font-medium text-slate-800 dark:text-slate-100">{match.teamA.name}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <ScoreControl matchId={match.id} side="A" score={match.scoreA} />
                <span className="text-slate-300">:</span>
                <ScoreControl matchId={match.id} side="B" score={match.scoreB} />
              </div>

              <div className="flex items-center justify-end gap-2 sm:flex-row-reverse">
                <TeamBadge name={match.teamB.name} shortName={match.teamB.shortName} color={match.teamB.color} />
                <span className="font-medium text-slate-800 dark:text-slate-100">{match.teamB.name}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-400">Status pantas:</span>
              {(["UPCOMING", "LIVE", "FINISHED"] as const).map((status) => (
                <form key={status} action={setMatchStatusAction}>
                  <input type="hidden" name="matchId" value={match.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      match.status === status
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {status === "UPCOMING" ? "Akan Datang" : status === "LIVE" ? "Langsung" : "Tamat"}
                  </button>
                </form>
              ))}

              <details className="ml-auto">
                <summary className="cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Edit lengkap
                </summary>
                <form
                  action={updateMatchDetailsAction}
                  className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  <input type="hidden" name="matchId" value={match.id} />
                  <label className="col-span-2 text-xs text-slate-500 sm:col-span-1">
                    Tarikh
                    <input
                      type="date"
                      name="date"
                      defaultValue={toDateKey(match.date)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    Masa
                    <input
                      type="time"
                      name="time"
                      defaultValue={match.time}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    Status
                    <select
                      name="status"
                      defaultValue={match.status}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="UPCOMING">Akan Datang</option>
                      <option value="LIVE">Langsung</option>
                      <option value="FINISHED">Tamat</option>
                      <option value="POSTPONED">Ditangguh</option>
                    </select>
                  </label>
                  <label className="col-span-2 text-xs text-slate-500 sm:col-span-2">
                    Tempat
                    <input
                      type="text"
                      name="venue"
                      defaultValue={match.venue}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    Skor {match.teamA.shortName}
                    <input
                      type="number"
                      min={0}
                      name="scoreA"
                      defaultValue={match.scoreA}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    Skor {match.teamB.shortName}
                    <input
                      type="number"
                      min={0}
                      name="scoreB"
                      defaultValue={match.scoreB}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </label>
                  <label className="col-span-2 text-xs text-slate-500 sm:col-span-2">
                    Info masa (cth: Set 2, 27&apos;, Tamat)
                    <input
                      type="text"
                      name="minute"
                      defaultValue={match.minute}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />
                  </label>
                  <div className="col-span-2 flex items-end sm:col-span-4">
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreControl({ matchId, side, score }: { matchId: string; side: "A" | "B"; score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <form action={adjustScoreAction}>
        <input type="hidden" name="matchId" value={matchId} />
        <input type="hidden" name="side" value={side} />
        <input type="hidden" name="delta" value={-1} />
        <button
          type="submit"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
        >
          −
        </button>
      </form>
      <span className="w-6 text-center text-lg font-bold text-slate-800 dark:text-slate-100">
        {score}
      </span>
      <form action={adjustScoreAction}>
        <input type="hidden" name="matchId" value={matchId} />
        <input type="hidden" name="side" value={side} />
        <input type="hidden" name="delta" value={1} />
        <button
          type="submit"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-950 dark:text-indigo-300"
        >
          +
        </button>
      </form>
    </div>
  );
}
