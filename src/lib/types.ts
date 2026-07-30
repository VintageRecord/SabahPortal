import type { Division, Match, Sport, StreamLink, Team } from "@prisma/client";

export type MatchWithTeams = Match & { teamA: Team; teamB: Team };

export type MatchWithTeamsAndDivision = MatchWithTeams & {
  division: Division & { sport: Sport };
};

export type StreamWithDivision = StreamLink & {
  division: Division & { sport: Sport };
};
