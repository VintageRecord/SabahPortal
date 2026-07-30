import Link from "next/link";
import MatchesFilterList from "@/components/MatchesFilterList";
import { getMatchesByDate, getSettings } from "@/lib/data";
import { formatDateLong, toDateKey } from "@/lib/format";

function shiftDate(dateKey: string, days: number) {
  const d = new Date(dateKey + "T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + days);
  return toDateKey(d);
}

export default async function JadualPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();
  const todayKey = toDateKey(new Date());
  const date = params.date ?? todayKey;

  const matches = await getMatchesByDate(date);
  const prevDate = shiftDate(date, -1);
  const nextDate = shiftDate(date, 1);

  const startKey = toDateKey(settings.startDate);
  const endKey = toDateKey(settings.endDate);
  const days: string[] = [];
  for (let d = startKey; d <= endKey; d = shiftDate(d, 1)) {
    days.push(d);
    if (days.length > 30) break;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
        Jadual Perlawanan
      </h1>
      <p className="mb-5 text-sm text-slate-500">Semua sukan, semua bahagian.</p>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        <Link
          href={`/jadual?date=${prevDate}`}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ← Sebelum
        </Link>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {formatDateLong(date)}
          {date === todayKey && (
            <span className="ml-2 rounded-full bg-maroon-100 px-2 py-0.5 text-[11px] font-semibold text-maroon-700 dark:bg-maroon-900 dark:text-maroon-300">
              Hari Ini
            </span>
          )}
        </span>
        <Link
          href={`/jadual?date=${nextDate}`}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Selepas →
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {days.map((d) => (
          <Link
            key={d}
            href={`/jadual?date=${d}`}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              d === date
                ? "bg-maroon-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {formatDateLong(d).split(", ")[1]}
          </Link>
        ))}
      </div>

      <MatchesFilterList
        matches={matches}
        showSport
        emptyLabel="Tiada perlawanan pada tarikh ini."
      />
    </div>
  );
}
