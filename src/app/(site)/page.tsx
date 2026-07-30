import Link from "next/link";
import LiveTicker from "@/components/LiveTicker";
import MatchCard from "@/components/MatchCard";
import { getLiveMatches, getMatchesByDate, getSettings, getSports } from "@/lib/data";
import { formatDateLong, toDateKey } from "@/lib/format";

export default async function HomePage() {
  const [settings, sports, liveMatches] = await Promise.all([
    getSettings(),
    getSports(),
    getLiveMatches(),
  ]);

  const todayKey = toDateKey(new Date());
  const todaysMatches = await getMatchesByDate(todayKey);
  const highlightMatches = todaysMatches.slice(0, 8);

  return (
    <div>
      <LiveTicker initialMatches={liveMatches} />

      <section className="bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-maroon-200">
            {settings.organizer}
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">{settings.title}</h1>
          <p className="mt-2 text-maroon-100">{settings.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-maroon-100">
            <span className="rounded-full bg-white/15 px-3 py-1">
              📅 {formatDateLong(settings.startDate)} — {formatDateLong(settings.endDate)}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">🏅 9 Sukan</span>
            <span className="rounded-full bg-white/15 px-3 py-1">🔄 Format Round-Robin</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/jadual"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-maroon-700 transition hover:bg-maroon-50"
            >
              Lihat Jadual Penuh
            </Link>
            <Link
              href="/strim"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/20"
            >
              Siaran Langsung
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">Sukan</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sports.map((sport) => (
            <Link
              key={sport.id}
              href={`/sukan/${sport.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-maroon-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-3xl">{sport.icon}</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {sport.name}
              </span>
              <span className="text-[11px] text-slate-400">
                {sport.divisions.map((d) => d.name).join(" / ")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Perlawanan Hari Ini
          </h2>
          <Link href="/jadual" className="text-sm font-medium text-maroon-600 hover:underline">
            Lihat semua →
          </Link>
        </div>
        {highlightMatches.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
            Tiada perlawanan dijadualkan hari ini.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {highlightMatches.map((match) => (
              <MatchCard key={match.id} match={match} showSport />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
