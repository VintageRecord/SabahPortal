"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MatchStage, MatchStatus } from "@prisma/client";

function pathsFor(divisionId: string, sportSlug: string, divisionSlug: string) {
  revalidatePath(`/admin/matches/${divisionId}`);
  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/jadual");
  revalidatePath(`/sukan/${sportSlug}/${divisionSlug}`);
  revalidatePath(`/sukan/${sportSlug}/${divisionSlug}/kedudukan`);
  revalidatePath(`/sukan/${sportSlug}/${divisionSlug}/carta`);
}

async function loadMatchContext(matchId: string) {
  const match = await prisma.match.findUniqueOrThrow({
    where: { id: matchId },
    include: { division: { include: { sport: true } } },
  });
  return match;
}

async function loadDivisionContext(divisionId: string) {
  const division = await prisma.division.findUniqueOrThrow({
    where: { id: divisionId },
    include: { sport: true },
  });
  return division;
}

// Bracket stage order and what each stage feeds into. FINAL has no next
// stage -- once it's decided, the champion is known and nothing more to do.
const NEXT_STAGE: Partial<Record<MatchStage, MatchStage>> = {
  QUARTERFINAL: MatchStage.SEMIFINAL,
  SEMIFINAL: MatchStage.FINAL,
};

function defaultTimesFor(stage: MatchStage): string[] {
  if (stage === MatchStage.SEMIFINAL) return ["15:00", "17:00"];
  if (stage === MatchStage.FINAL) return ["19:00"];
  return ["15:00", "16:00", "17:00", "18:00"];
}

/**
 * Once every match in a stage has a winner, automatically create the next
 * stage's matches by pairing winners two at a time (slot 1+2 -> next slot 1,
 * slot 3+4 -> next slot 2, ...). Never overwrites an already-generated next
 * stage, so this is safe to call after every bracket match update.
 */
async function progressBracket(divisionId: string) {
  const bracketMatches = await prisma.match.findMany({
    where: { divisionId, stage: { not: MatchStage.GROUP } },
    orderBy: [{ stage: "asc" }, { bracketSlot: "asc" }],
  });

  const byStage = new Map<MatchStage, typeof bracketMatches>();
  for (const match of bracketMatches) {
    const list = byStage.get(match.stage) ?? [];
    list.push(match);
    byStage.set(match.stage, list);
  }

  for (const [stage, matches] of byStage) {
    const nextStage = NEXT_STAGE[stage];
    if (!nextStage || byStage.has(nextStage)) continue;

    const allDecided = matches.every((m) => m.winnerId);
    if (!allDecided) continue;

    const winners = [...matches]
      .sort((a, b) => (a.bracketSlot ?? 0) - (b.bracketSlot ?? 0))
      .map((m) => m.winnerId as string);
    const venue = matches[0].venue;
    const latestDate = matches.reduce((max, m) => (m.date > max ? m.date : max), matches[0].date);
    const nextDate = new Date(latestDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const times = defaultTimesFor(nextStage);

    for (let i = 0; i < winners.length; i += 2) {
      const slot = i / 2 + 1;
      await prisma.match.create({
        data: {
          divisionId,
          round: 1,
          stage: nextStage,
          bracketSlot: slot,
          teamAId: winners[i],
          teamBId: winners[i + 1],
          status: MatchStatus.UPCOMING,
          date: nextDate,
          time: times[slot - 1] ?? times[0],
          venue,
        },
      });
    }
  }
}

/**
 * Called after any update that could finish a bracket match. If the match
 * just finished with a decisive score (no tie), the winner is inferred
 * automatically; a genuine tie is left for the admin to resolve by hand via
 * setMatchWinnerAction, since a plain score can't say who advances. Either
 * way, checks whether the whole stage is now decided and auto-generates the
 * next round if so.
 */
async function finalizeBracketMatchIfNeeded(matchId: string) {
  const match = await prisma.match.findUniqueOrThrow({ where: { id: matchId } });
  if (match.stage === MatchStage.GROUP || match.status !== MatchStatus.FINISHED) return;

  if (!match.winnerId && match.scoreA !== match.scoreB) {
    await prisma.match.update({
      where: { id: matchId },
      data: { winnerId: match.scoreA > match.scoreB ? match.teamAId : match.teamBId },
    });
  }

  await progressBracket(match.divisionId);
}

export async function adjustScoreAction(formData: FormData) {
  const matchId = String(formData.get("matchId"));
  const side = String(formData.get("side")); // "A" | "B"
  const delta = Number(formData.get("delta"));

  const match = await loadMatchContext(matchId);
  const field = side === "A" ? "scoreA" : "scoreB";
  const nextValue = Math.max(0, match[field] + delta);

  await prisma.match.update({
    where: { id: matchId },
    data: { [field]: nextValue },
  });

  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}

export async function setMatchStatusAction(formData: FormData) {
  const matchId = String(formData.get("matchId"));
  const status = String(formData.get("status")) as MatchStatus;

  const match = await loadMatchContext(matchId);
  await prisma.match.update({
    where: { id: matchId },
    data: {
      status,
      minute: status === "FINISHED" ? "Tamat" : status === "UPCOMING" ? "" : match.minute,
    },
  });

  await finalizeBracketMatchIfNeeded(matchId);
  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}

export async function generateQuarterfinalsAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const venue = String(formData.get("venue"));
  const date = String(formData.get("date"));
  const division = await loadDivisionContext(divisionId);

  for (let slot = 1; slot <= 4; slot++) {
    const teamAId = String(formData.get(`qf${slot}TeamA`));
    const teamBId = String(formData.get(`qf${slot}TeamB`));
    const time = String(formData.get(`qf${slot}Time`));
    await prisma.match.create({
      data: {
        divisionId,
        round: 1,
        stage: MatchStage.QUARTERFINAL,
        bracketSlot: slot,
        teamAId,
        teamBId,
        status: MatchStatus.UPCOMING,
        date: new Date(date),
        time,
        venue,
      },
    });
  }

  pathsFor(divisionId, division.sport.slug, division.slug);
}

/**
 * Saves the score for one round of a best-of-3-rounds match (Sport.roundBased
 * sports only). Recomputes rounds won from every saved round and, once one
 * side reaches 2, marks the match FINISHED with a winner and (for bracket
 * stages) advances the bracket -- no separate "who won?" step needed, since a
 * round-based match is never ambiguous the way a tied running score is.
 */
export async function saveRoundResultAction(formData: FormData) {
  const matchId = String(formData.get("matchId"));
  const round = Number(formData.get("round"));
  const scoreA = Math.max(0, Number(formData.get("scoreA")) || 0);
  const scoreB = Math.max(0, Number(formData.get("scoreB")) || 0);

  const match = await loadMatchContext(matchId);

  await prisma.matchRound.upsert({
    where: { matchId_round: { matchId, round } },
    update: { scoreA, scoreB },
    create: { matchId, round, scoreA, scoreB },
  });

  const rounds = await prisma.matchRound.findMany({
    where: { matchId },
    orderBy: { round: "asc" },
  });
  let roundsWonA = 0;
  let roundsWonB = 0;
  for (const r of rounds) {
    if (r.scoreA > r.scoreB) roundsWonA += 1;
    else if (r.scoreB > r.scoreA) roundsWonB += 1;
  }
  const decided = roundsWonA >= 2 || roundsWonB >= 2;

  await prisma.match.update({
    where: { id: matchId },
    data: {
      scoreA: roundsWonA,
      scoreB: roundsWonB,
      status: decided ? MatchStatus.FINISHED : MatchStatus.LIVE,
      minute: decided ? "Tamat" : `Pusingan ${rounds.length + 1}`,
      winnerId: decided ? (roundsWonA >= 2 ? match.teamAId : match.teamBId) : null,
    },
  });

  if (decided) {
    await progressBracket(match.divisionId);
  }

  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}

export async function setMatchWinnerAction(formData: FormData) {
  const matchId = String(formData.get("matchId"));
  const winnerId = String(formData.get("winnerId"));

  const match = await loadMatchContext(matchId);
  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId },
  });

  await progressBracket(match.divisionId);
  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}

export async function resetBracketAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const division = await loadDivisionContext(divisionId);

  await prisma.match.deleteMany({
    where: { divisionId, stage: { not: MatchStage.GROUP } },
  });

  pathsFor(divisionId, division.sport.slug, division.slug);
}

export async function updateMatchDetailsAction(formData: FormData) {
  const matchId = String(formData.get("matchId"));
  const date = String(formData.get("date"));
  const time = String(formData.get("time"));
  const venue = String(formData.get("venue"));
  const minute = String(formData.get("minute") ?? "");
  const scoreA = Number(formData.get("scoreA"));
  const scoreB = Number(formData.get("scoreB"));
  const status = String(formData.get("status")) as MatchStatus;

  const match = await loadMatchContext(matchId);

  await prisma.match.update({
    where: { id: matchId },
    data: {
      date: new Date(date),
      time,
      venue,
      minute,
      scoreA: Number.isFinite(scoreA) ? Math.max(0, scoreA) : 0,
      scoreB: Number.isFinite(scoreB) ? Math.max(0, scoreB) : 0,
      status,
    },
  });

  await finalizeBracketMatchIfNeeded(matchId);
  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}
