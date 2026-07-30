"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MatchCard from "./MatchCard";
import type { MatchWithTeams } from "@/lib/types";

type Tab = "SKOR" | "MAKLUMAT";

export default function StreamSidebar({
  sportSlug,
  divisionSlug,
  divisionId,
  initialMatches,
  sportName,
  divisionName,
  format,
  teamsCount,
  venues,
  pointsWin,
  pointsDraw,
  pointsLoss,
}: {
  sportSlug: string;
  divisionSlug: string;
  divisionId: string;
  initialMatches: MatchWithTeams[];
  sportName: string;
  divisionName: string;
  format: string;
  teamsCount: number;
  venues: string[];
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
}) {
  const [tab, setTab] = useState<Tab>("SKOR");
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/matches?divisionId=${divisionId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setMatches(data.matches);
      } catch {
        // keep last known state on transient network errors
      }
    };
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, [divisionId]);

  const live = useMemo(() => matches.filter((m) => m.status === "LIVE"), [matches]);
  const upcoming = useMemo(
    () => matches.filter((m) => m.status === "UPCOMING").slice(0, 3),
    [matches]
  );
  const finished = useMemo(
    () =>
      matches
        .filter((m) => m.status === "FINISHED")
        .slice(-3)
        .reverse(),
    [matches]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-1 border-b border-slate-100 bg-slate-50/60 p-1.5 dark:border-slate-800 dark:bg-slate-950/40">
        {(
          [
            ["SKOR", "Skor"],
            ["MAKLUMAT", "Maklumat"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tab === key
                ? "bg-white text-maroon-600 shadow-sm dark:bg-slate-900 dark:text-maroon-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {label}
            {key === "SKOR" && live.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-100 px-1 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                {live.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="max-h-[70vh] overflow-y-auto p-3">
        {tab === "SKOR" ? (
          <div className="space-y-4">
            {live.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-red-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                  Sedang Langsung
                </p>
                <div className="space-y-2">
                  {live.map((m) => (
                    <MatchCard key={m.id} match={m} sportSlug={sportSlug} divisionSlug={divisionSlug} />
                  ))}
                </div>
              </div>
            )}

            {upcoming.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Akan Datang
                </p>
                <div className="space-y-2">
                  {upcoming.map((m) => (
                    <MatchCard key={m.id} match={m} sportSlug={sportSlug} divisionSlug={divisionSlug} />
                  ))}
                </div>
              </div>
            )}

            {finished.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Keputusan Terkini
                </p>
                <div className="space-y-2">
                  {finished.map((m) => (
                    <MatchCard key={m.id} match={m} sportSlug={sportSlug} divisionSlug={divisionSlug} />
                  ))}
                </div>
              </div>
            )}

            {live.length === 0 && upcoming.length === 0 && finished.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
                Tiada perlawanan buat masa ini.
              </p>
            )}

            <Link
              href={`/sukan/${sportSlug}/${divisionSlug}`}
              className="block rounded-full bg-slate-100 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Lihat semua perlawanan →
            </Link>
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Sukan</dt>
              <dd className="text-slate-700 dark:text-slate-200">
                {sportName} · {divisionName}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Format</dt>
              <dd className="text-slate-700 dark:text-slate-200">{format}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Bilangan Pasukan
              </dt>
              <dd className="text-slate-700 dark:text-slate-200">{teamsCount} pasukan</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Sistem Mata
              </dt>
              <dd className="text-slate-700 dark:text-slate-200">
                Menang {pointsWin} mata · Seri {pointsDraw} mata · Kalah {pointsLoss} mata
              </dd>
            </div>
            {venues.length > 0 && (
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Tempat
                </dt>
                <dd className="space-y-0.5 text-slate-700 dark:text-slate-200">
                  {venues.map((v) => (
                    <p key={v}>{v}</p>
                  ))}
                </dd>
              </div>
            )}
            <Link
              href={`/sukan/${sportSlug}/${divisionSlug}/kedudukan`}
              className="block rounded-full bg-slate-100 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Lihat kedudukan penuh →
            </Link>
          </dl>
        )}
      </div>
    </div>
  );
}
