"use client";

import { useState, useTransition } from "react";
import TeamBadge from "@/components/TeamBadge";
import StatusPill from "@/components/StatusPill";
import { toDateKey } from "@/lib/format";
import {
  adjustScoreAction,
  saveRoundResultAction,
  setMatchStatusAction,
  updateMatchDetailsAction,
} from "./actions";
import type { Match, MatchRound, MatchStatus, Team } from "@prisma/client";

type MatchWithTeams = Match & { teamA: Team; teamB: Team; rounds?: MatchRound[] };
type SportInfo = { roundBased: boolean; scoreLabel: string };

const STATUS_OPTIONS: MatchStatus[] = ["UPCOMING", "LIVE", "FINISHED"];
const STATUS_LABEL: Record<MatchStatus, string> = {
  UPCOMING: "Akan Datang",
  LIVE: "Langsung",
  FINISHED: "Tamat",
  POSTPONED: "Ditangguh",
};

export default function AdminMatchCard({
  match,
  sport,
}: {
  match: MatchWithTeams;
  sport?: SportInfo;
}) {
  const [scoreA, setScoreA] = useState(match.scoreA);
  const [scoreB, setScoreB] = useState(match.scoreB);
  const [status, setStatus] = useState(match.status);
  const [rounds, setRounds] = useState(match.rounds ?? []);
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

  const saveRound = (round: number, roundScoreA: number, roundScoreB: number) => {
    const nextRounds = [
      ...rounds.filter((r) => r.round !== round),
      { ...(rounds.find((r) => r.round === round) ?? {}), round, scoreA: roundScoreA, scoreB: roundScoreB } as MatchRound,
    ].sort((a, b) => a.round - b.round);
    setRounds(nextRounds);

    let roundsWonA = 0;
    let roundsWonB = 0;
    for (const r of nextRounds) {
      if (r.scoreA > r.scoreB) roundsWonA += 1;
      else if (r.scoreB > r.scoreA) roundsWonB += 1;
    }
    const decided = roundsWonA >= 2 || roundsWonB >= 2;
    setScoreA(roundsWonA);
    setScoreB(roundsWonB);
    setStatus(decided ? "FINISHED" : "LIVE");

    startTransition(async () => {
      const fd = new FormData();
      fd.set("matchId", match.id);
      fd.set("round", String(round));
      fd.set("scoreA", String(roundScoreA));
      fd.set("scoreB", String(roundScoreB));
      await saveRoundResultAction(fd);
    });
  };

  if (sport?.roundBased) {
    return (
      <RoundBasedMatchCard
        match={match}
        scoreLabel={sport.scoreLabel}
        scoreA={scoreA}
        scoreB={scoreB}
        status={status}
        rounds={rounds}
        onSaveRound={saveRound}
        onChangeStatus={changeStatus}
      />
    );
  }

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

function RoundBasedMatchCard({
  match,
  scoreLabel,
  scoreA,
  scoreB,
  status,
  rounds,
  onSaveRound,
  onChangeStatus,
}: {
  match: MatchWithTeams;
  scoreLabel: string;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  rounds: MatchRound[];
  onSaveRound: (round: number, scoreA: number, scoreB: number) => void;
  onChangeStatus: (status: MatchStatus) => void;
}) {
  const roundByNumber = new Map(rounds.map((r) => [r.round, r]));
  const showRound3 = (scoreA === 1 && scoreB === 1) || roundByNumber.has(3);
  const winner = status === "FINISHED" ? (scoreA > scoreB ? match.teamA : scoreB > scoreA ? match.teamB : null) : null;

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

        <div className="flex flex-col items-center">
          <span className="text-2xl font-extrabold tabular-nums text-slate-800 dark:text-slate-100">
            {scoreA} : {scoreB}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {scoreLabel} dimenangi
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 sm:flex-row-reverse">
          <TeamBadge name={match.teamB.name} shortName={match.teamB.shortName} color={match.teamB.color} />
          <span className="font-medium text-slate-800 dark:text-slate-100">{match.teamB.name}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-xs font-medium text-slate-400">Skor mengikut {scoreLabel.toLowerCase()}:</span>
        <RoundInput
          label="Pusingan 1"
          existing={roundByNumber.get(1)}
          onSave={(a, b) => onSaveRound(1, a, b)}
        />
        <RoundInput
          label="Pusingan 2"
          existing={roundByNumber.get(2)}
          onSave={(a, b) => onSaveRound(2, a, b)}
        />
        {showRound3 && (
          <RoundInput
            label="Pusingan 3 (penentu)"
            existing={roundByNumber.get(3)}
            onSave={(a, b) => onSaveRound(3, a, b)}
          />
        )}
      </div>

      {winner && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          Menang: {winner.name} ({scoreA}-{scoreB} {scoreLabel.toLowerCase()})
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-xs font-medium text-slate-400">Status pantas:</span>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeStatus(s)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
              status === s
                ? "bg-gradient-to-r from-maroon-600 to-maroon-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}

function RoundInput({
  label,
  existing,
  onSave,
}: {
  label: string;
  existing?: MatchRound;
  onSave: (scoreA: number, scoreB: number) => void;
}) {
  const [scoreA, setScoreA] = useState(existing?.scoreA ?? 0);
  const [scoreB, setScoreB] = useState(existing?.scoreB ?? 0);

  return (
    <div className="flex items-center gap-2">
      <span className="w-36 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
      <input
        type="number"
        min={0}
        value={scoreA}
        onChange={(e) => setScoreA(Math.max(0, Number(e.target.value) || 0))}
        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <span className="text-slate-300">:</span>
      <input
        type="number"
        min={0}
        value={scoreB}
        onChange={(e) => setScoreB(Math.max(0, Number(e.target.value) || 0))}
        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <button
        type="button"
        onClick={() => onSave(scoreA, scoreB)}
        className="rounded-full bg-maroon-100 px-3 py-1 text-[11px] font-semibold text-maroon-700 transition hover:bg-maroon-200 dark:bg-maroon-950 dark:text-maroon-300"
      >
        Simpan
      </button>
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
