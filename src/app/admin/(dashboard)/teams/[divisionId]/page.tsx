import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TeamBadge from "@/components/TeamBadge";
import { toDateKey } from "@/lib/format";
import {
  createTeamAction,
  deleteTeamAction,
  regenerateFixturesAction,
  updateTeamAction,
} from "./actions";

export default async function AdminDivisionTeamsPage({
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

  const teams = await prisma.team.findMany({ where: { divisionId }, orderBy: { createdAt: "asc" } });
  const matchCount = await prisma.match.count({ where: { divisionId } });

  return (
    <div>
      <Link href="/admin/teams" className="text-xs font-medium text-indigo-600 hover:underline">
        ← Semua sukan
      </Link>
      <h1 className="mb-6 mt-1 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
        <span>{division.sport.icon}</span> {division.sport.name} · {division.name}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
            Senarai Pasukan ({teams.length})
          </h2>
          <div className="space-y-2">
            {teams.map((team) => (
              <form
                key={team.id}
                action={updateTeamAction}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 p-2 dark:border-slate-800"
              >
                <input type="hidden" name="teamId" value={team.id} />
                <input type="hidden" name="divisionId" value={divisionId} />
                <TeamBadge name={team.name} shortName={team.shortName} color={team.color} size="sm" />
                <input
                  type="text"
                  name="name"
                  defaultValue={team.name}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="text"
                  name="shortName"
                  defaultValue={team.shortName}
                  maxLength={4}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm uppercase dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="color"
                  name="color"
                  defaultValue={team.color}
                  className="h-8 w-8 rounded border border-slate-300 dark:border-slate-700"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Simpan
                </button>
                <button
                  type="submit"
                  formAction={deleteTeamAction}
                  className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                >
                  Padam
                </button>
              </form>
            ))}
            {teams.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
                Belum ada pasukan.
              </p>
            )}
          </div>

          <form action={createTeamAction} className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <input type="hidden" name="divisionId" value={divisionId} />
            <input
              type="text"
              name="name"
              required
              placeholder="Nama pasukan"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              type="text"
              name="shortName"
              required
              maxLength={4}
              placeholder="Kod"
              className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm uppercase dark:border-slate-700 dark:bg-slate-800"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              + Tambah Pasukan
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <h2 className="mb-1 text-sm font-bold text-amber-800 dark:text-amber-300">
            Jana Semula Jadual Round-Robin
          </h2>
          <p className="mb-3 text-xs text-amber-700 dark:text-amber-400">
            Ini akan memadam {matchCount} perlawanan sedia ada dan mencipta jadual round-robin
            baharu berdasarkan {teams.length} pasukan semasa. Gunakan selepas menambah/memadam
            pasukan.
          </p>
          <form action={regenerateFixturesAction} className="space-y-2">
            <input type="hidden" name="divisionId" value={divisionId} />
            <label className="block text-xs font-medium text-amber-800 dark:text-amber-300">
              Tarikh Mula (Pusingan 1)
              <input
                type="date"
                name="startDate"
                defaultValue={toDateKey(new Date())}
                className="mt-1 w-full rounded-lg border border-amber-300 px-2 py-1.5 text-sm dark:bg-slate-900"
              />
            </label>
            <label className="block text-xs font-medium text-amber-800 dark:text-amber-300">
              Tempat
              <input
                type="text"
                name="venue"
                placeholder="cth: Dewan Sukan Likas"
                className="mt-1 w-full rounded-lg border border-amber-300 px-2 py-1.5 text-sm dark:bg-slate-900"
              />
            </label>
            <label className="block text-xs font-medium text-amber-800 dark:text-amber-300">
              Slot Masa (pisah dengan koma)
              <input
                type="text"
                name="times"
                defaultValue="09:00, 11:30, 16:00"
                className="mt-1 w-full rounded-lg border border-amber-300 px-2 py-1.5 text-sm dark:bg-slate-900"
              />
            </label>
            <button
              type="submit"
              disabled={teams.length < 2}
              className="w-full rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Jana Semula Jadual
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
