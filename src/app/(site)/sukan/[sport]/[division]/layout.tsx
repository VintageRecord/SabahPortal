import { notFound } from "next/navigation";
import Link from "next/link";
import { getSportBySlug } from "@/lib/data";
import DivisionTabs from "@/components/DivisionTabs";

export default async function DivisionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const sport = await getSportBySlug(sportSlug);
  if (!sport) notFound();
  const division = sport.divisions.find((d) => d.slug === divisionSlug);
  if (!division) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="text-3xl">{sport.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
            {sport.name}
          </h1>
          <p className="text-sm text-slate-500">Kejohanan Sukan 2026 · Format Round-Robin</p>
        </div>
      </div>

      {sport.divisions.length > 1 && (
        <div className="mb-4 mt-3 flex flex-wrap gap-1.5">
          {sport.divisions.map((d) => (
            <Link
              key={d.id}
              href={`/sukan/${sport.slug}/${d.slug}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                d.slug === divisionSlug
                  ? "bg-maroon-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {d.name}
            </Link>
          ))}
        </div>
      )}

      <DivisionTabs sportSlug={sport.slug} divisionSlug={divisionSlug} />

      <div className="mt-4">{children}</div>
    </div>
  );
}
