"use client";

import AdminMatchCard from "./AdminMatchCard";
import { generateQuarterfinalsAction, resetBracketAction, setMatchWinnerAction } from "./actions";
import type { Match, MatchStage, Team } from "@prisma/client";
import type { StandingRow } from "@/lib/standings";
import { toDateKey } from "@/lib/format";

type MatchWithTeams = Match & { teamA: Team; teamB: Team; winner: Team | null };

const STAGE_LABEL: Record<string, string> = {
  QUARTERFINAL: "Suku Akhir",
  SEMIFINAL: "Separuh Akhir",
  FINAL: "Akhir",
};

// Standard bracket seeding for 8 teams: 1v8, 4v5, 2v7, 3v6 -- avoids the
// top two seeds meeting before the final.
const SEED_PAIRS: [number, number][] = [
  [0, 7],
  [3, 4],
  [1, 6],
  [2, 5],
];

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
  const top8 = standings.slice(0, 8);
  const today = toDateKey(new Date());

  const byStage = new Map<MatchStage, MatchWithTeams[]>();
  for (const match of bracketMatches) {
    const list = byStage.get(match.stage) ?? [];
    list.push(match);
    byStage.set(match.stage, list);
  }
  for (const list of byStage.values()) {
    list.sort((a, b) => (a.bracketSlot ?? 0) - (b.bracketSlot ?? 0));
  }

  const quarterfinals = byStage.get("QUARTERFINAL" as MatchStage) ?? [];
  const semifinals = byStage.get("SEMIFINAL" as MatchStage) ?? [];
  const final = byStage.get("FINAL" as MatchStage)?.[0] ?? null;

  if (bracketMatches.length === 0) {
    if (top8.length < 8) {
      return (
        <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          Perlu sekurang-kurangnya 8 pasukan dalam bahagian ini untuk bracket play-off 8-pasukan.
        </p>
      );
    }
    return (
      <form
        action={generateQuarterfinalsAction}
        className="space-y-4 rounded-2xl border border-dashed border-maroon-300 bg-maroon-50/40 p-5 dark:border-maroon-900 dark:bg-maroon-950/20"
      >
        <input type="hidden" name="divisionId" value={divisionId} />
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Jana Suku Akhir (8 Pasukan)</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Berdasarkan kedudukan liga semasa, disusun secara piawai (#1 lwn #8, #4 lwn #5, #2 lwn
            #7, #3 lwn #6) — boleh ditukar. Selepas ini, separuh akhir dan akhir akan dijana
            secara automatik apabila keputusan diketahui.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {SEED_PAIRS.map(([a, b], idx) => (
            <div key={idx} className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-500">Suku Akhir {idx + 1}</p>
              <TeamSelect name={`qf${idx + 1}TeamA`} teams={top8} defaultValue={top8[a].team.id} />
              <TeamSelect name={`qf${idx + 1}TeamB`} teams={top8} defaultValue={top8[b].team.id} />
              <label className="block text-xs text-slate-500">
                Masa
                <input
                  type="time"
                  name={`qf${idx + 1}Time`}
                  defaultValue={["15:00", "16:00", "17:00", "18:00"][idx]}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </label>
            </div>
          ))}
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
          Jana Suku Akhir
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <BracketStageSection label={STAGE_LABEL.QUARTERFINAL} matches={quarterfinals} columns={2} />
      <BracketStageSection
        label={STAGE_LABEL.SEMIFINAL}
        matches={semifinals}
        columns={2}
        pending={quarterfinals.length > 0 && semifinals.length === 0}
      />
      <BracketStageSection
        label={STAGE_LABEL.FINAL}
        matches={final ? [final] : []}
        columns={1}
        pending={semifinals.length > 0 && !final}
      />

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

function BracketStageSection({
  label,
  matches,
  columns,
  pending,
}: {
  label: string;
  matches: MatchWithTeams[];
  columns: 1 | 2;
  pending?: boolean;
}) {
  if (matches.length === 0 && !pending) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      {matches.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
          Menunggu keputusan pusingan sebelumnya — akan dijana secara automatik.
        </p>
      ) : (
        <div className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
          {matches.map((match) => (
            <BracketMatchAdmin key={match.id} match={match} />
          ))}
        </div>
      )}
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

function BracketMatchAdmin({ match }: { match: MatchWithTeams }) {
  const isFinal = match.stage === ("FINAL" as MatchStage);
  return (
    <div className="space-y-2">
      <AdminMatchCard match={match} />
      {match.status === "FINISHED" && !match.winnerId && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <span className="font-semibold text-amber-800 dark:text-amber-300">
            Skor sama — siapa menang?
          </span>
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
          {isFinal ? "🏆 Juara" : "Menang & maju ke pusingan seterusnya"}: {match.winner?.name}
        </p>
      )}
    </div>
  );
}
