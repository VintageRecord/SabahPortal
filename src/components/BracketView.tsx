import BracketMatchCard from "./BracketMatchCard";
import TeamBadge from "./TeamBadge";
import type { Match, MatchRound, Team } from "@prisma/client";

type BracketMatch = Match & { teamA: Team; teamB: Team; winner: Team | null; rounds?: MatchRound[] };

function Connector() {
  return (
    <div className="flex items-center justify-center py-1" aria-hidden="true">
      <div className="h-6 w-px bg-gradient-to-b from-transparent via-maroon-300 to-maroon-400 dark:via-maroon-800 dark:to-maroon-700" />
    </div>
  );
}

function BracketRound({
  label,
  matches,
  columns,
  emptyLabel,
  scoreLabel,
  roundBased,
  sportSlug,
  divisionSlug,
}: {
  label: string;
  matches: BracketMatch[];
  columns: 1 | 2;
  emptyLabel?: string;
  scoreLabel: string;
  roundBased: boolean;
  sportSlug: string;
  divisionSlug: string;
}) {
  if (matches.length === 0 && !emptyLabel) return null;

  return (
    <div>
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      {matches.length === 0 ? (
        <div className="mx-auto max-w-sm rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
          {emptyLabel}
        </div>
      ) : (
        <div className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : "mx-auto max-w-sm"}`}>
          {matches.map((match) => (
            <BracketMatchCard
              key={match.id}
              match={match}
              scoreLabel={scoreLabel}
              roundBased={roundBased}
              sportSlug={sportSlug}
              divisionSlug={divisionSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BracketView({
  quarterfinals,
  semifinals,
  final,
  scoreLabel,
  roundBased,
  sportSlug,
  divisionSlug,
}: {
  quarterfinals: BracketMatch[];
  semifinals: BracketMatch[];
  final: BracketMatch | null;
  scoreLabel: string;
  roundBased: boolean;
  sportSlug: string;
  divisionSlug: string;
}) {
  const champion = final?.winnerId ? final.winner : null;

  return (
    <div className="mx-auto max-w-3xl">
      {quarterfinals.length > 0 && (
        <>
          <BracketRound
            label="Suku Akhir"
            matches={quarterfinals}
            columns={2}
            scoreLabel={scoreLabel}
            roundBased={roundBased}
            sportSlug={sportSlug}
            divisionSlug={divisionSlug}
          />
          <Connector />
        </>
      )}

      <BracketRound
        label="Separuh Akhir"
        matches={semifinals}
        columns={2}
        emptyLabel={quarterfinals.length > 0 ? "Menunggu keputusan suku akhir" : undefined}
        scoreLabel={scoreLabel}
        roundBased={roundBased}
        sportSlug={sportSlug}
        divisionSlug={divisionSlug}
      />

      <Connector />

      <BracketRound
        label="Akhir"
        matches={final ? [final] : []}
        columns={1}
        emptyLabel="Menunggu keputusan separuh akhir"
        scoreLabel={scoreLabel}
        roundBased={roundBased}
        sportSlug={sportSlug}
        divisionSlug={divisionSlug}
      />

      {champion && (
        <>
          <Connector />
          <div className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-5 text-center shadow-lg shadow-amber-500/20">
            <span className="text-3xl">🏆</span>
            <div className="flex items-center gap-2">
              <TeamBadge name={champion.name} shortName={champion.shortName} color={champion.color} />
              <span className="text-lg font-extrabold text-amber-950">{champion.name}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-900">Juara</p>
          </div>
        </>
      )}
    </div>
  );
}
