"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";

function pathsFor(divisionId: string, sportSlug: string, divisionSlug: string) {
  revalidatePath(`/admin/matches/${divisionId}`);
  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/jadual");
  revalidatePath(`/sukan/${sportSlug}/${divisionSlug}`);
  revalidatePath(`/sukan/${sportSlug}/${divisionSlug}/kedudukan`);
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
