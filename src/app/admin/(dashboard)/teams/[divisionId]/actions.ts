"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { roundRobinRounds } from "@/lib/roundRobin";

const COLORS = [
  "#1a56db", "#c81e3a", "#0f9d58", "#f59e0b", "#7c3aed", "#0891b2",
  "#db2777", "#65a30d", "#ea580c", "#4338ca", "#0d9488", "#b91c1c",
];

async function revalidateDivision(divisionId: string) {
  const division = await prisma.division.findUnique({
    where: { id: divisionId },
    include: { sport: true },
  });
  revalidatePath(`/admin/teams/${divisionId}`);
  revalidatePath(`/admin/matches/${divisionId}`);
  revalidatePath("/admin/teams");
  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/jadual");
  if (division) {
    revalidatePath(`/sukan/${division.sport.slug}/${division.slug}`);
    revalidatePath(`/sukan/${division.sport.slug}/${division.slug}/kedudukan`);
  }
}

export async function createTeamAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const name = String(formData.get("name")).trim();
  const shortName = String(formData.get("shortName")).trim().toUpperCase();
  if (!name || !shortName) return;

  const teamCount = await prisma.team.count({ where: { divisionId } });

  await prisma.team.create({
    data: {
      divisionId,
      name,
      shortName: shortName.slice(0, 4),
      color: COLORS[teamCount % COLORS.length],
    },
  });

  await revalidateDivision(divisionId);
}

export async function updateTeamAction(formData: FormData) {
  const teamId = String(formData.get("teamId"));
  const divisionId = String(formData.get("divisionId"));
  const name = String(formData.get("name")).trim();
  const shortName = String(formData.get("shortName")).trim().toUpperCase();
  const color = String(formData.get("color"));

  await prisma.team.update({
    where: { id: teamId },
    data: { name, shortName: shortName.slice(0, 4), color },
  });

  await revalidateDivision(divisionId);
}

export async function deleteTeamAction(formData: FormData) {
  const teamId = String(formData.get("teamId"));
  const divisionId = String(formData.get("divisionId"));

  await prisma.team.delete({ where: { id: teamId } });

  await revalidateDivision(divisionId);
}

export async function regenerateFixturesAction(formData: FormData) {
  const divisionId = String(formData.get("divisionId"));
  const startDate = String(formData.get("startDate"));
  const venue = String(formData.get("venue")).trim();
  const timesRaw = String(formData.get("times"));
  const times = timesRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const finalTimes = times.length > 0 ? times : ["09:00", "11:30", "16:00"];

  const teams = await prisma.team.findMany({ where: { divisionId }, orderBy: { createdAt: "asc" } });
  if (teams.length < 2) return;

  await prisma.match.deleteMany({ where: { divisionId } });

  const rounds = roundRobinRounds(teams.length);
  const base = new Date(startDate + "T00:00:00.000Z");

  for (const [roundIdx, pairs] of rounds.entries()) {
    const date = new Date(base);
    date.setUTCDate(date.getUTCDate() + roundIdx);
    for (const [pairIdx, [ai, bi]] of pairs.entries()) {
      await prisma.match.create({
        data: {
          divisionId,
          round: roundIdx + 1,
          teamAId: teams[ai].id,
          teamBId: teams[bi].id,
          date,
          time: finalTimes[pairIdx % finalTimes.length],
          venue: venue || "Akan ditetapkan",
          status: "UPCOMING",
        },
      });
    }
  }

  await revalidateDivision(divisionId);
}
