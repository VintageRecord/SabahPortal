import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const settings = await prisma.eventSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    throw new Error("Event settings not seeded. Run `npm run db:seed`.");
  }
  return settings;
}

export async function getSports() {
  return prisma.sport.findMany({
    orderBy: { order: "asc" },
    include: { divisions: { orderBy: { order: "asc" } } },
  });
}

export async function getSportBySlug(slug: string) {
  return prisma.sport.findUnique({
    where: { slug },
    include: { divisions: { orderBy: { order: "asc" } } },
  });
}

export async function getDivision(sportSlug: string, divisionSlug: string) {
  const sport = await prisma.sport.findUnique({ where: { slug: sportSlug } });
  if (!sport) return null;
  const division = await prisma.division.findFirst({
    where: { sportId: sport.id, slug: divisionSlug },
  });
  if (!division) return null;
  return { sport, division };
}

export async function getDivisionMatches(divisionId: string) {
  return prisma.match.findMany({
    where: { divisionId, stage: "GROUP" },
    include: { teamA: true, teamB: true, rounds: { orderBy: { round: "asc" } } },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
}

export async function divisionHasBracket(divisionId: string) {
  const count = await prisma.match.count({ where: { divisionId, stage: { not: "GROUP" } } });
  return count > 0;
}

export async function getBracketMatches(divisionId: string) {
  return prisma.match.findMany({
    where: { divisionId, stage: { not: "GROUP" } },
    include: { teamA: true, teamB: true, winner: true, rounds: { orderBy: { round: "asc" } } },
    orderBy: [{ stage: "asc" }, { bracketSlot: "asc" }],
  });
}

export async function getDivisionTeams(divisionId: string) {
  return prisma.team.findMany({ where: { divisionId }, orderBy: { name: "asc" } });
}

export async function getDivisionStreams(divisionId: string) {
  return prisma.streamLink.findMany({ where: { divisionId }, orderBy: { order: "asc" } });
}

export async function getLiveMatches() {
  return prisma.match.findMany({
    where: { status: "LIVE" },
    include: {
      teamA: true,
      teamB: true,
      division: { include: { sport: true } },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
}

export async function getMatchesByDate(date: string) {
  const start = new Date(date + "T00:00:00.000Z");
  const end = new Date(date + "T23:59:59.999Z");
  return prisma.match.findMany({
    where: { date: { gte: start, lte: end } },
    include: {
      teamA: true,
      teamB: true,
      division: { include: { sport: true } },
    },
    orderBy: [{ time: "asc" }],
  });
}

export async function getAllStreams() {
  return prisma.streamLink.findMany({
    include: { division: { include: { sport: true } } },
    orderBy: [{ isLive: "desc" }, { order: "asc" }],
  });
}

export async function getLiveStreams() {
  return prisma.streamLink.findMany({
    where: { isLive: true },
    include: { division: { include: { sport: true } } },
    orderBy: { order: "asc" },
  });
}

export async function getMatchDetail(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      teamA: true,
      teamB: true,
      division: { include: { sport: true } },
      events: {
        include: { player: true },
        orderBy: { createdAt: "asc" },
      },
      rounds: { orderBy: { round: "asc" } },
    },
  });
  if (!match) return null;

  if (!match.division.sport.hasLineup) {
    return { match, teamAPlayers: [], teamBPlayers: [] };
  }

  const [teamAPlayers, teamBPlayers] = await Promise.all([
    prisma.player.findMany({ where: { teamId: match.teamAId }, orderBy: { jerseyNumber: "asc" } }),
    prisma.player.findMany({ where: { teamId: match.teamBId }, orderBy: { jerseyNumber: "asc" } }),
  ]);

  return { match, teamAPlayers, teamBPlayers };
}
