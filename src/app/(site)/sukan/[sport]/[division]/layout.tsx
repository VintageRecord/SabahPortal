import { notFound } from "next/navigation";
import Link from "next/link";
import { getSettings, getSportBySlug } from "@/lib/data";
import DivisionTabs from "@/components/DivisionTabs";
import SportIcon from "@/components/icons/SportIcon";

export default async function DivisionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const [sport, settings] = await Promise.all([getSportBySlug(sportSlug), getSettings()]);
  if (!sport) notFound();
  const division = sport.divisions.find((d) => d.slug === divisionSlug);
  if (!division) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-50 to-maroon-100 text-maroon-700 shadow-sm dark:from-maroon-950 dark:to-maroon-900 dark:text-maroon-400">
          <SportIcon slug={sport.slug} fallback={sport.icon} size={30} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
            {sport.name}
          </h1>
          <p className="text-sm text-slate-500">{settings.title} · Format Round-Robin</p>
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
                  ? "bg-gradient-to-r from-maroon-600 to-maroon-500 text-white shadow-sm shadow-maroon-200 dark:shadow-none"
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
