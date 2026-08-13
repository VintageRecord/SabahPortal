"use client";

import AdminMatchCard from "./AdminMatchCard";
import {
  generateFinalAction,
  generateSemifinalsAction,
  resetBracketAction,
  setMatchWinnerAction,
} from "./actions";
import type { Match, Team } from "@prisma/client";
import type { StandingRow } from "@/lib/standings";
import { toDateKey } from "@/lib/format";

type MatchWithTeams = Match & { teamA: Team; teamB: Team; winner: Team | null };

export default function BracketAdmin({
  divisionId,
  standings,
  bracketMatches,
  defaultVenue,
}: {
  divisionId: string;
  standings: StandingRow[];
  bracketMatches: MatchWithTeams[];
  defaultVenue: string;
}) {
  const semifinals = bracketMatches
    .filter((m) => m.stage === "SEMIFINAL")
    .sort((a, b) => (a.bracketSlot ?? 0) - (b.bracketSlot ?? 0));
  const final = bracketMatches.find((m) => m.stage === "FINAL") ?? null;
  const top4 = standings.slice(0, 4);
  const today = toDateKey(new Date());

  if (bracketMatches.length === 0) {
    if (top4.length < 4) {
      return (
        <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          Perlu sekurang-kurangnya 4 pasukan dalam bahagian ini untuk bracket play-off.
        </p>
      );
    }
    return (
      <form
        action={generateSemifinalsAction}
        className="space-y-4 rounded-2xl border border-dashed border-maroon-300 bg-maroon-50/40 p-5 dark:border-maroon-900 dark:bg-maroon-950/20"
      >
        <input type="hidden" name="divisionId" value={divisionId} />
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Jana Separuh Akhir</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Berdasarkan kedudukan liga semasa (#1 lwn #4, #2 lwn #3 secara lalai — boleh ditukar).
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500">Separuh Akhir 1</p>
            <TeamSelect name="sf1TeamA" teams={top4} defaultValue={top4[0].team.id} />
            <TeamSelect name="sf1TeamB" teams={top4} defaultValue={top4[3].team.id} />
            <label className="block text-xs text-slate-500">
              Masa
              <input
                type="time"
                name="sf1Time"
                defaultValue="15:00"
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500">Separuh Akhir 2</p>
            <TeamSelect name="sf2TeamA" teams={top4} defaultValue={top4[1].team.id} />
            <TeamSelect name="sf2TeamB" teams={top4} defaultValue={top4[2].team.id} />
            <label className="block text-xs text-slate-500">
              Masa
              <input
                type="time"
                name="sf2Time"
                defaultValue="17:00"
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-slate-500">
            Tarikh
            <input
              type="date"
              name="date"
              defaultValue={today}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="text-xs text-slate-500">
            Tempat
            <input
              type="text"
              name="venue"
              defaultValue={defaultVenue}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
        </div>
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-maroon-600 to-maroon-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
        >
          Jana Separuh Akhir
        </button>
      </form>
    );
  }

  const bothSfDecided = semifinals.length === 2 && semifinals.every((m) => m.winnerId);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {semifinals.map((m) => (
          <BracketMatchAdmin key={m.id} match={m} />
        ))}
      </div>

      {!final && bothSfDecided && (
        <form
          action={generateFinalAction}
          className="space-y-3 rounded-2xl border border-dashed border-maroon-300 bg-maroon-50/40 p-5 dark:border-maroon-900 dark:bg-maroon-950/20"
        >
          <input type="hidden" name="divisionId" value={divisionId} />
          <input type="hidden" name="teamAId" value={semifinals[0].winnerId!} />
          <input type="hidden" name="teamBId" value={semifinals[1].winnerId!} />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Jana Perlawanan Akhir: {semifinals[0].winner?.name} lwn {semifinals[1].winner?.name}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-xs text-slate-500">
              Tarikh
              <input
                type="date"
                name="date"
                defaultValue={today}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Masa
              <input
                type="time"
                name="time"
                defaultValue="19:00"
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="text-xs text-slate-500">
              Tempat
              <input
                type="text"
                name="venue"
                defaultValue={defaultVenue}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-maroon-600 to-maroon-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            Jana Perlawanan Akhir
          </button>
        </form>
      )}

      {final && <BracketMatchAdmin match={final} isFinal />}

      <form
        action={resetBracketAction}
        onSubmit={(e) => {
          if (!confirm("Padam semua perlawanan bracket play-off untuk bahagian ini? Tindakan ini tidak boleh diundur.")) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="divisionId" value={divisionId} />
        <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
          Padam bracket &amp; mula semula
        </button>
      </form>
    </div>
  );
}

function TeamSelect({
  name,
  teams,
  defaultValue,
}: {
  name: string;
  teams: StandingRow[];
  defaultValue: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
    >
      {teams.map((row, idx) => (
        <option key={row.team.id} value={row.team.id}>
          #{idx + 1} {row.team.name} ({row.points} mata)
        </option>
      ))}
    </select>
  );
}

function BracketMatchAdmin({ match, isFinal }: { match: MatchWithTeams; isFinal?: boolean }) {
  return (
    <div className="space-y-2">
      <AdminMatchCard match={match} />
      {match.status === "FINISHED" && !match.winnerId && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <span className="font-semibold text-amber-800 dark:text-amber-300">Siapa menang?</span>
          <form action={setMatchWinnerAction}>
            <input type="hidden" name="matchId" value={match.id} />
            <input type="hidden" name="winnerId" value={match.teamAId} />
            <button
              type="submit"
              className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
            >
              {match.teamA.shortName}
            </button>
          </form>
          <form action={setMatchWinnerAction}>
            <input type="hidden" name="matchId" value={match.id} />
            <input type="hidden" name="winnerId" value={match.teamBId} />
            <button
              type="submit"
              className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
            >
              {match.teamB.shortName}
            </button>
          </form>
        </div>
      )}
      {match.winnerId && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {isFinal ? "🏆 Juara" : "Menang & ke akhir"}: {match.winner?.name}
        </p>
      )}
    </div>
  );
}
