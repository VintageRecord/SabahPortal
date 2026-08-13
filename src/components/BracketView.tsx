import BracketMatchCard from "./BracketMatchCard";
import TeamBadge from "./TeamBadge";
import type { Match, Team } from "@prisma/client";

type BracketMatch = Match & { teamA: Team; teamB: Team; winner: Team | null };

function Connector() {
  return (
    <div className="flex items-center justify-center py-1" aria-hidden="true">
      <div className="h-6 w-px bg-gradient-to-b from-transparent via-maroon-300 to-maroon-400 dark:via-maroon-800 dark:to-maroon-700" />
    </div>
  );
}

export default function BracketView({
  semifinals,
  final,
  scoreLabel,
  sportSlug,
  divisionSlug,
}: {
  semifinals: BracketMatch[];
  final: BracketMatch | null;
  scoreLabel: string;
  sportSlug: string;
  divisionSlug: string;
}) {
  const champion = final?.winnerId ? final.winner : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
          Separuh Akhir
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {semifinals.map((match) => (
            <BracketMatchCard
              key={match.id}
              match={match}
              scoreLabel={scoreLabel}
              sportSlug={sportSlug}
              divisionSlug={divisionSlug}
            />
          ))}
        </div>
      </div>

      <Connector />

      <div>
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
          Akhir
        </p>
        {final ? (
          <div className="mx-auto max-w-sm">
            <BracketMatchCard
              match={final}
              scoreLabel={scoreLabel}
              sportSlug={sportSlug}
              divisionSlug={divisionSlug}
            />
          </div>
        ) : (
          <div className="mx-auto max-w-sm rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Menunggu keputusan separuh akhir
          </div>
        )}
      </div>

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
