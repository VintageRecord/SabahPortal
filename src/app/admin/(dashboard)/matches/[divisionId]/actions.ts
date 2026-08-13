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

  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}

async function loadDivisionContext(divisionId: string) {
  const division = await prisma.division.findUniqueOrThrow({
    where: { id: divisionId },
    include: { sport: true },
  });
  return division;
}

export async function generateSemifinalsAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const venue = String(formData.get("venue"));
  const date = String(formData.get("date"));
  const sf1TeamA = String(formData.get("sf1TeamA"));
  const sf1TeamB = String(formData.get("sf1TeamB"));
  const sf1Time = String(formData.get("sf1Time"));
  const sf2TeamA = String(formData.get("sf2TeamA"));
  const sf2TeamB = String(formData.get("sf2TeamB"));
  const sf2Time = String(formData.get("sf2Time"));

  const division = await loadDivisionContext(divisionId);

  await prisma.match.create({
    data: {
      divisionId,
      round: 1,
      stage: MatchStage.SEMIFINAL,
      bracketSlot: 1,
      teamAId: sf1TeamA,
      teamBId: sf1TeamB,
      status: MatchStatus.UPCOMING,
      date: new Date(date),
      time: sf1Time,
      venue,
    },
  });
  await prisma.match.create({
    data: {
      divisionId,
      round: 1,
      stage: MatchStage.SEMIFINAL,
      bracketSlot: 2,
      teamAId: sf2TeamA,
      teamBId: sf2TeamB,
      status: MatchStatus.UPCOMING,
      date: new Date(date),
      time: sf2Time,
      venue,
    },
  });

  pathsFor(divisionId, division.sport.slug, division.slug);
}

export async function setMatchWinnerAction(formData: FormData) {
  const matchId = String(formData.get("matchId"));
  const winnerId = String(formData.get("winnerId"));

  const match = await loadMatchContext(matchId);
  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId },
  });

  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}

export async function generateFinalAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const teamAId = String(formData.get("teamAId"));
  const teamBId = String(formData.get("teamBId"));
  const date = String(formData.get("date"));
  const time = String(formData.get("time"));
  const venue = String(formData.get("venue"));

  const division = await loadDivisionContext(divisionId);

  await prisma.match.create({
    data: {
      divisionId,
      round: 1,
      stage: MatchStage.FINAL,
      bracketSlot: 1,
      teamAId,
      teamBId,
      status: MatchStatus.UPCOMING,
      date: new Date(date),
      time,
      venue,
    },
  });

  pathsFor(divisionId, division.sport.slug, division.slug);
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

  pathsFor(match.divisionId, match.division.sport.slug, match.division.slug);
}
