export type MatchStatus = "upcoming" | "live" | "finished" | "postponed";

export type StreamPlatform = "youtube" | "tiktok" | "facebook" | "instagram" | "other";

export interface EventSettings {
  title: string;
  subtitle: string;
  organizer: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  updatedAt: string;
}

export interface Sport {
  id: string;
  slug: string;
  name: string;
  icon: string; // emoji icon shown in UI
  order: number;
}

export interface Division {
  id: string;
  sportId: string;
  slug: string;
  name: string; // e.g. "Berpasukan", "Lelaki", "Wanita", "Veteran"
  format: "round-robin";
  order: number;
}

export interface Team {
  id: string;
  divisionId: string;
  name: string;
  shortName: string;
  color: string; // hex used for the avatar badge
}

export interface MatchGame {
  teamAScore: number;
  teamBScore: number;
}

export interface Match {
  id: string;
  divisionId: string;
  round: number;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  date: string; // ISO date yyyy-mm-dd
  time: string; // HH:mm
  venue: string;
  minute: string; // free text live clock/set info e.g. "Set 2" or "45'"
  updatedAt: string;
}

export interface StandingRow {
  teamId: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  pointsFor: number;
  pointsAgainst: number;
  diff: number;
  points: number;
}

export interface StreamLink {
  id: string;
  divisionId: string;
  platform: StreamPlatform;
  title: string;
  url: string;
  isLive: boolean;
  order: number;
}

export interface Database {
  settings: EventSettings;
  sports: Sport[];
  divisions: Division[];
  teams: Team[];
  matches: Match[];
  streams: StreamLink[];
}
