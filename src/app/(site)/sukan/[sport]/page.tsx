import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import SportIcon from "@/components/icons/SportIcon";
import { getSportBySlug } from "@/lib/data";

export default async function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport: sportSlug } = await params;
  const sport = await getSportBySlug(sportSlug);
  if (!sport) notFound();

  if (sport.divisions.length === 1) {
    redirect(`/sukan/${sport.slug}/${sport.divisions[0].slug}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-50 to-maroon-100 text-maroon-700 shadow-sm dark:from-maroon-950 dark:to-maroon-900 dark:text-maroon-400">
          <SportIcon slug={sport.slug} fallback={sport.icon} size={30} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {sport.name}
        </h1>
      </div>
      <p className="mb-4 text-sm text-slate-500">Pilih bahagian:</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sport.divisions.map((division) => (
          <Link
            key={division.id}
            href={`/sukan/${sport.slug}/${division.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 text-center font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-xl hover:shadow-maroon-900/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-maroon-500 via-pink-500 to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
            {division.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
