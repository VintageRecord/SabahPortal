const DAY_NAMES = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
const MONTH_NAMES = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];

export function toDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function formatDateLong(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${DAY_NAMES[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()].slice(0, 3)}`;
}

export const STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Akan Datang",
  LIVE: "Langsung",
  FINISHED: "Tamat",
  POSTPONED: "Ditangguh",
};

export const PLATFORM_LABEL: Record<string, string> = {
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  OTHER: "Lain-lain",
};
