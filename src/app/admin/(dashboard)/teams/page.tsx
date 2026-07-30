import Link from "next/link";
import { getSports } from "@/lib/data";

export default async function AdminTeamsIndexPage() {
  const sports = await getSports();

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">Pasukan</h1>
      <p className="mb-6 text-sm text-slate-500">
        Pilih sukan / bahagian untuk urus senarai pasukan dan jana semula jadual round-robin.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <span>{sport.icon}</span> {sport.name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sport.divisions.map((division) => (
                <Link
                  key={division.id}
                  href={`/admin/teams/${division.id}`}
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
