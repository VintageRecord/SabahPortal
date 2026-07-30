import Link from "next/link";
import LiveTicker from "@/components/LiveTicker";
import LiveMatchesSection from "@/components/LiveMatchesSection";
import MatchCard from "@/components/MatchCard";
import SportIcon from "@/components/icons/SportIcon";
import UiIcon from "@/components/icons/UiIcon";
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

      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-950 via-maroon-800 to-maroon-700 px-4 py-12 text-white sm:px-6 sm:py-16">
        <div
          className="animate-float-slow pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="animate-float-slower pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-maroon-200">
            {settings.organizer}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
              {settings.title}
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-maroon-100 sm:text-lg">{settings.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2.5 text-sm text-white">
            <span className="glass flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 shadow-sm">
              <UiIcon name="calendar" size={14} />
              {formatDateLong(settings.startDate)} — {formatDateLong(settings.endDate)}
            </span>
            <span className="glass flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 shadow-sm">
              <UiIcon name="medal" size={14} />9 Sukan
            </span>
            <span className="glass flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 shadow-sm">
              <UiIcon name="refresh" size={14} />Format Round-Robin
            </span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/jadual"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-maroon-700 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Lihat Jadual Penuh
            </Link>
            <Link
              href="/strim"
              className="glass rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Siaran Langsung
            </Link>
          </div>
        </div>
      </section>

      <LiveMatchesSection initialMatches={liveMatches} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">Sukan</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sports.map((sport) => (
            <Link
              key={sport.id}
              href={`/sukan/${sport.slug}`}
              className="group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-maroon-900/10 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-maroon-500 via-pink-500 to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-maroon-50 to-maroon-100 text-maroon-700 transition group-hover:scale-110 dark:from-maroon-950 dark:to-maroon-900 dark:text-maroon-400">
                <SportIcon slug={sport.slug} fallback={sport.icon} size={26} />
              </span>
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
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Perlawanan Hari Ini
          </h2>
          <Link
            href="/jadual"
            className="rounded-full px-3 py-1 text-sm font-medium text-maroon-600 transition hover:bg-maroon-50 dark:hover:bg-maroon-950/40"
          >
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
