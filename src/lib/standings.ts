import type { Match, Team } from "@prisma/client";

export interface StandingRow {
  team: Team;
  played: number;
  win: number;
  draw: number;
  loss: number;
  pointsFor: number;
  pointsAgainst: number;
  diff: number;
  points: number;
}

interface PointsRule {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
}

/**
 * Round-robin standings computed only from FINISHED matches. LIVE/UPCOMING
 * matches don't affect the table yet, matching how organizers expect a
 * standing table to behave mid-tournament.
 */
export function computeStandings(
  teams: Team[],
  matches: Match[],
  rule: PointsRule
): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const team of teams) {
    rows.set(team.id, {
      team,
      played: 0,
      win: 0,
      draw: 0,
      loss: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      diff: 0,
      points: 0,
    });
  }

  for (const match of matches) {
    if (match.status !== "FINISHED") continue;
    const rowA = rows.get(match.teamAId);
    const rowB = rows.get(match.teamBId);
    if (!rowA || !rowB) continue;

    rowA.played += 1;
    rowB.played += 1;
    rowA.pointsFor += match.scoreA;
    rowA.pointsAgainst += match.scoreB;
    rowB.pointsFor += match.scoreB;
    rowB.pointsAgainst += match.scoreA;

    if (match.scoreA > match.scoreB) {
      rowA.win += 1;
      rowA.points += rule.pointsWin;
      rowB.loss += 1;
      rowB.points += rule.pointsLoss;
    } else if (match.scoreA < match.scoreB) {
      rowB.win += 1;
      rowB.points += rule.pointsWin;
      rowA.loss += 1;
      rowA.points += rule.pointsLoss;
    } else {
      rowA.draw += 1;
      rowB.draw += 1;
      rowA.points += rule.pointsDraw;
      rowB.points += rule.pointsDraw;
    }
  }

  for (const row of rows.values()) {
    row.diff = row.pointsFor - row.pointsAgainst;
  }

  return [...rows.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    return a.team.name.localeCompare(b.team.name);
  });
}
