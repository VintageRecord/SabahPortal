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
        <SportIcon slug={sport.slug} fallback={sport.icon} size={40} className="text-maroon-700 dark:text-maroon-400" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{sport.name}</h1>
      </div>
      <p className="mb-4 text-sm text-slate-500">Pilih bahagian:</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sport.divisions.map((division) => (
          <Link
            key={division.id}
            href={`/sukan/${sport.slug}/${division.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center font-semibold text-slate-700 transition hover:border-maroon-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            {division.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
