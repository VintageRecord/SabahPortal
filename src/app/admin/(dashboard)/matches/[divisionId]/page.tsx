import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SportIcon from "@/components/icons/SportIcon";
import AdminMatchCard from "./AdminMatchCard";

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

      <div className="space-y-3">
        {matches.map((match) => (
          <AdminMatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
