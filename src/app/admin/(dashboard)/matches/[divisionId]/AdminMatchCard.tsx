"use client";

import { useState, useTransition } from "react";
import TeamBadge from "@/components/TeamBadge";
import StatusPill from "@/components/StatusPill";
import { toDateKey } from "@/lib/format";
import { adjustScoreAction, setMatchStatusAction, updateMatchDetailsAction } from "./actions";
import type { Match, MatchStatus, Team } from "@prisma/client";

type MatchWithTeams = Match & { teamA: Team; teamB: Team };

const STATUS_OPTIONS: MatchStatus[] = ["UPCOMING", "LIVE", "FINISHED"];
const STATUS_LABEL: Record<MatchStatus, string> = {
  UPCOMING: "Akan Datang",
  LIVE: "Langsung",
  FINISHED: "Tamat",
  POSTPONED: "Ditangguh",
};

export default function AdminMatchCard({ match }: { match: MatchWithTeams }) {
  const [scoreA, setScoreA] = useState(match.scoreA);
  const [scoreB, setScoreB] = useState(match.scoreB);
  const [status, setStatus] = useState(match.status);
  const [, startTransition] = useTransition();

  const adjustScore = (side: "A" | "B", delta: number) => {
    const setter = side === "A" ? setScoreA : setScoreB;
    setter((prev) => Math.max(0, prev + delta));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("matchId", match.id);
      fd.set("side", side);
      fd.set("delta", String(delta));
      await adjustScoreAction(fd);
    });
  };

  const changeStatus = (next: MatchStatus) => {
    setStatus(next);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("matchId", match.id);
      fd.set("status", next);
      await setMatchStatusAction(fd);
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400">
          Pusingan {match.round} · {match.time} · {match.venue}
        </span>
        <StatusPill status={status} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="flex items-center gap-2">
          <TeamBadge name={match.teamA.name} shortName={match.teamA.shortName} color={match.teamA.color} />
          <span className="font-medium text-slate-800 dark:text-slate-100">{match.teamA.name}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <ScoreButtons score={scoreA} onAdjust={(delta) => adjustScore("A", delta)} />
          <span className="text-slate-300">:</span>
          <ScoreButtons score={scoreB} onAdjust={(delta) => adjustScore("B", delta)} />
        </div>

        <div className="flex items-center justify-end gap-2 sm:flex-row-reverse">
          <TeamBadge name={match.teamB.name} shortName={match.teamB.shortName} color={match.teamB.color} />
          <span className="font-medium text-slate-800 dark:text-slate-100">{match.teamB.name}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-xs font-medium text-slate-400">Status pantas:</span>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => changeStatus(s)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
              status === s
                ? "bg-gradient-to-r from-maroon-600 to-maroon-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}

        <details className="ml-auto">
          <summary className="cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            Edit lengkap
          </summary>
          <form action={updateMatchDetailsAction} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input type="hidden" name="matchId" value={match.id} />
            <label className="col-span-2 text-xs text-slate-500 sm:col-span-1">
              Tarikh
              <input
                type="date"
                name="date"
                defaultValue={toDateKey(match.date)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Masa
              <input
                type="time"
                name="time"
                defaultValue={match.time}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Status
              <select
                name="status"
                defaultValue={status}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="UPCOMING">Akan Datang</option>
                <option value="LIVE">Langsung</option>
                <option value="FINISHED">Tamat</option>
                <option value="POSTPONED">Ditangguh</option>
              </select>
            </label>
            <label className="col-span-2 text-xs text-slate-500 sm:col-span-2">
              Tempat
              <input
                type="text"
                name="venue"
                defaultValue={match.venue}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Skor {match.teamA.shortName}
              <input
                type="number"
                min={0}
                name="scoreA"
                defaultValue={scoreA}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Skor {match.teamB.shortName}
              <input
                type="number"
                min={0}
                name="scoreB"
                defaultValue={scoreB}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="col-span-2 text-xs text-slate-500 sm:col-span-2">
              Info masa (cth: Set 2, 27&apos;, Tamat)
              <input
                type="text"
                name="minute"
                defaultValue={match.minute}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <div className="col-span-2 flex items-end sm:col-span-4">
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-maroon-600 to-maroon-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </details>
      </div>
    </div>
  );
}

function ScoreButtons({ score, onAdjust }: { score: number; onAdjust: (delta: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onAdjust(-1)}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300"
      >
        −
      </button>
      <span className="w-6 text-center text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">
        {score}
      </span>
      <button
        type="button"
        onClick={() => onAdjust(1)}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-maroon-100 text-sm font-bold text-maroon-700 transition hover:bg-maroon-200 active:scale-95 dark:bg-maroon-950 dark:text-maroon-300"
      >
        +
      </button>
    </div>
  );
}
