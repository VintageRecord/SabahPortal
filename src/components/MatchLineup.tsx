import TeamBadge from "./TeamBadge";
import type { Player, Team } from "@prisma/client";

interface MatchEventWithPlayer {
  id: string;
  teamId: string;
  minute: string;
  player: Player | null;
}

function minuteSortKey(minute: string) {
  const match = minute.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function MatchLineup({
  teamA,
  teamB,
  teamAPlayers,
  teamBPlayers,
  events,
}: {
  teamA: Team;
  teamB: Team;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  events: MatchEventWithPlayer[];
}) {
  const scorerCounts = new Map<string, number>();
  for (const event of events) {
    if (!event.player) continue;
    scorerCounts.set(event.player.id, (scorerCounts.get(event.player.id) ?? 0) + 1);
  }

  const sortedEvents = [...events].sort((a, b) => minuteSortKey(a.minute) - minuteSortKey(b.minute));

  return (
    <div className="space-y-6">
      {sortedEvents.length > 0 && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <h2 className="mb-4 text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Jalan Perlawanan
          </h2>
          <ol className="space-y-3">
            {sortedEvents.map((event) => {
              const isTeamA = event.teamId === teamA.id;
              return (
                <li key={event.id} className="flex items-center gap-3 text-sm">
                  <span className="w-10 shrink-0 text-right text-xs font-bold tabular-nums text-slate-400">
                    {event.minute}
                  </span>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: isTeamA ? teamA.color : teamB.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 font-medium text-slate-800 dark:text-slate-100">
                    {event.player?.name ?? "Pemain"}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {isTeamA ? teamA.shortName : teamB.shortName}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { team: teamA, players: teamAPlayers },
          { team: teamB, players: teamBPlayers },
        ].map(({ team, players }) => (
          <div
            key={team.id}
            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <TeamBadge name={team.name} shortName={team.shortName} color={team.color} size="sm" />
              <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
                {team.name}
              </h2>
            </div>
            {players.length === 0 ? (
              <p className="text-xs text-slate-400">Senarai pemain belum ditambah.</p>
            ) : (
              <ul className="space-y-1.5">
                {players.map((player) => {
                  const goals = scorerCounts.get(player.id) ?? 0;
                  return (
                    <li
                      key={player.id}
                      className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {player.jerseyNumber ?? "-"}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">
                        {player.name}
                      </span>
                      {player.position && (
                        <span className="shrink-0 text-[11px] text-slate-400">{player.position}</span>
                      )}
                      {goals > 0 && (
                        <span className="shrink-0 rounded-full bg-maroon-50 px-1.5 py-0.5 text-[11px] font-bold text-maroon-700 dark:bg-maroon-950 dark:text-maroon-300">
                          {goals}×
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
