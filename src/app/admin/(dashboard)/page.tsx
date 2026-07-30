import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [sportCount, divisionCount, teamCount, matchCount, liveCount, streamCount] =
    await Promise.all([
      prisma.sport.count(),
      prisma.division.count(),
      prisma.team.count(),
      prisma.match.count(),
      prisma.match.count({ where: { status: "LIVE" } }),
      prisma.streamLink.count(),
    ]);

  const cards = [
    { label: "Sukan", value: sportCount, href: "/admin/matches" },
    { label: "Bahagian", value: divisionCount, href: "/admin/teams" },
    { label: "Pasukan", value: teamCount, href: "/admin/teams" },
    { label: "Perlawanan", value: matchCount, href: "/admin/matches" },
    { label: "Sedang Langsung", value: liveCount, href: "/admin/matches" },
    { label: "Pautan Strim", value: streamCount, href: "/admin/streams" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">Papan Pemuka</h1>
      <p className="mb-6 text-sm text-slate-500">
        Urus perlawanan, skor langsung, pasukan, strim dan tetapan kejohanan.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:border-maroon-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-2xl font-bold text-maroon-600">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/matches"
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="mb-1 text-lg">⚡</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Kemas kini skor</p>
          <p className="mt-1 text-xs text-slate-500">
            Tukar status ke Langsung dan kemas kini skor masa nyata.
          </p>
        </Link>
        <Link
          href="/admin/teams"
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="mb-1 text-lg">👥</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Urus pasukan</p>
          <p className="mt-1 text-xs text-slate-500">
            Tambah/edit pasukan dan jana semula jadual round-robin.
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="mb-1 text-lg">⚙️</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Tetapan kejohanan</p>
          <p className="mt-1 text-xs text-slate-500">
            Nama, tarikh dan sistem mata (menang/seri/kalah).
          </p>
        </Link>
      </div>
    </div>
  );
}
