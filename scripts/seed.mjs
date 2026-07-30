// One-off generator that produces data/db.json (the seed database).
// Run with: node scripts/seed.mjs
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const TODAY = "2026-07-30";
const addDays = (iso, n) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const DISTRICTS = [
  ["Kota Kinabalu", "KK"],
  ["Sandakan", "SDK"],
  ["Tawau", "TWU"],
  ["Lahad Datu", "LD"],
  ["Keningau", "KNG"],
  ["Papar", "PPR"],
  ["Kudat", "KDT"],
  ["Beaufort", "BFT"],
  ["Ranau", "RNU"],
  ["Semporna", "SPN"],
  ["Penampang", "PNP"],
  ["Putatan", "PTT"],
  ["Tuaran", "TRN"],
  ["Kunak", "KNK"],
  ["Tambunan", "TBN"],
  ["Sipitang", "SPT"],
  ["Kota Belud", "KBL"],
  ["Kota Marudu", "KMD"],
  ["Nabawan", "NBW"],
  ["Tenom", "TNM"],
];

const COLORS = [
  "#1a56db", "#c81e3a", "#0f9d58", "#f59e0b", "#7c3aed", "#0891b2",
  "#db2777", "#65a30d", "#ea580c", "#4338ca", "#0d9488", "#b91c1c",
];

let teamSeq = 0;
function makeTeams(divisionId, offset, count) {
  const teams = [];
  for (let i = 0; i < count; i++) {
    const [name, short] = DISTRICTS[(offset + i) % DISTRICTS.length];
    teams.push({
      id: `team_${++teamSeq}`,
      divisionId,
      name,
      shortName: short,
      color: COLORS[teamSeq % COLORS.length],
    });
  }
  return teams;
}

// round-robin pairing (circle method), returns rounds -> array of [teamIndexA, teamIndexB]
function roundRobinRounds(n) {
  const ids = [...Array(n).keys()];
  const rounds = [];
  const fixed = ids[0];
  let rest = ids.slice(1);
  const totalRounds = n - 1;
  for (let r = 0; r < totalRounds; r++) {
    const pairs = [];
    const cur = [fixed, ...rest];
    for (let i = 0; i < n / 2; i++) {
      pairs.push([cur[i], cur[n - 1 - i]]);
    }
    rounds.push(pairs);
    rest.push(rest.shift());
  }
  return rounds;
}

const SPORT_DEFS = [
  {
    slug: "badminton",
    name: "Badminton",
    icon: "🏸",
    venues: ["Dewan Badminton MSN Sabah, Kota Kinabalu"],
    scoreStyle: "games3",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "sepak-takraw",
    name: "Sepak Takraw",
    icon: "🥎",
    venues: ["Dewan Sepak Takraw Karamunsing"],
    scoreStyle: "sets3",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "pickleball",
    name: "Pickleball",
    icon: "🎾",
    venues: ["Kompleks Pickleball Likas"],
    scoreStyle: "games3",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "ping-pong",
    name: "Ping Pong",
    icon: "🏓",
    venues: ["Dewan Tenis Meja, Kompleks Belia & Sukan KK"],
    scoreStyle: "games3",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "bola-tampar",
    name: "Bola Tampar",
    icon: "🏐",
    venues: ["Dewan Bola Tampar Universiti Malaysia Sabah"],
    scoreStyle: "sets5",
    divisions: [
      { slug: "lelaki", name: "Lelaki" },
      { slug: "wanita", name: "Wanita" },
    ],
  },
  {
    slug: "dart",
    name: "Dart",
    icon: "🎯",
    venues: ["Dewan Serbaguna, Kompleks Sukan Likas"],
    scoreStyle: "legs7",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "petanque",
    name: "Petanque",
    icon: "🔘",
    venues: ["Padang Petanque, Karamunsing"],
    scoreStyle: "points13",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "karom",
    name: "Karom",
    icon: "⚫",
    venues: ["Dewan Komuniti Penampang"],
    scoreStyle: "games3",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "futsal",
    name: "Futsal",
    icon: "⚽",
    venues: ["Arena Futsal MBSA, Kota Kinabalu", "Arena Futsal Inanam"],
    scoreStyle: "goals",
    divisions: [
      { slug: "lelaki", name: "Lelaki" },
      { slug: "veteran", name: "Veteran" },
      { slug: "wanita", name: "Wanita" },
    ],
  },
];

function finishedScore(style) {
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  switch (style) {
    case "games3": {
      const win = r(0, 1) ? 2 : 2;
      const lose = Math.random() < 0.5 ? 0 : 1;
      return Math.random() < 0.5 ? [win, lose] : [lose, win];
    }
    case "sets3": {
      const lose = Math.random() < 0.5 ? 0 : 1;
      return Math.random() < 0.5 ? [2, lose] : [lose, 2];
    }
    case "sets5": {
      const lose = r(0, 2);
      return Math.random() < 0.5 ? [3, lose] : [lose, 3];
    }
    case "legs7": {
      const lose = r(0, 3);
      return Math.random() < 0.5 ? [4, lose] : [lose, 4];
    }
    case "points13": {
      const lose = r(2, 11);
      return Math.random() < 0.5 ? [13, lose] : [lose, 13];
    }
    case "goals": {
      const a = r(0, 5);
      const b = r(0, 5);
      return [a, b];
    }
    default:
      return [0, 0];
  }
}

function liveScore(style) {
  const [a, b] = finishedScore(style);
  const factor = 0.5;
  return [Math.round(a * factor), Math.round(b * factor)];
}

function liveMinute(style) {
  switch (style) {
    case "games3":
    case "sets3":
      return "Set 2";
    case "sets5":
      return "Set 3";
    case "legs7":
      return "Leg 5";
    case "points13":
      return "Pusingan akhir";
    case "goals":
      return "27'";
    default:
      return "Sedang berlangsung";
  }
}

const sports = [];
const divisions = [];
const teams = [];
const matches = [];
let sportSeq = 0;
let divisionSeq = 0;
let matchSeq = 0;
let districtOffset = 0;

const ROUND1_SLOTS = [
  { time: "08:30", status: "finished" },
  { time: "10:00", status: "live" },
  { time: "13:00", status: "upcoming" },
];
const OTHER_ROUND_SLOTS = ["09:00", "11:30", "16:00"];

for (const sportDef of SPORT_DEFS) {
  sportSeq += 1;
  const sportId = `sport_${sportSeq}`;
  sports.push({
    id: sportId,
    slug: sportDef.slug,
    name: sportDef.name,
    icon: sportDef.icon,
    order: sportSeq,
  });

  sportDef.divisions.forEach((divDef, divIdx) => {
    divisionSeq += 1;
    const divisionId = `division_${divisionSeq}`;
    divisions.push({
      id: divisionId,
      sportId,
      slug: divDef.slug,
      name: divDef.name,
      format: "round-robin",
      order: divIdx + 1,
    });

    const divTeams = makeTeams(divisionId, districtOffset, 6);
    districtOffset += 3;
    teams.push(...divTeams);

    const rounds = roundRobinRounds(divTeams.length);
    rounds.forEach((pairs, roundIdx) => {
      const roundNumber = roundIdx + 1;
      const date = addDays(TODAY, roundIdx);
      pairs.forEach(([ai, bi], pairIdx) => {
        matchSeq += 1;
        const venue = sportDef.venues[pairIdx % sportDef.venues.length];
        let time, status, scoreA, scoreB, minute;
        if (roundNumber === 1) {
          const slot = ROUND1_SLOTS[pairIdx % ROUND1_SLOTS.length];
          time = slot.time;
          status = slot.status;
        } else {
          time = OTHER_ROUND_SLOTS[pairIdx % OTHER_ROUND_SLOTS.length];
          status = "upcoming";
        }

        if (status === "finished") {
          [scoreA, scoreB] = finishedScore(sportDef.scoreStyle);
          minute = "Tamat";
        } else if (status === "live") {
          [scoreA, scoreB] = liveScore(sportDef.scoreStyle);
          minute = liveMinute(sportDef.scoreStyle);
        } else {
          scoreA = 0;
          scoreB = 0;
          minute = "";
        }

        matches.push({
          id: `match_${matchSeq}`,
          divisionId,
          round: roundNumber,
          teamAId: divTeams[ai].id,
          teamBId: divTeams[bi].id,
          scoreA,
          scoreB,
          status,
          date,
          time,
          venue,
          minute,
          updatedAt: new Date().toISOString(),
        });
      });
    });
  });
}

const STREAM_SEED = [
  { sportSlug: "futsal", divSlug: "lelaki", platform: "youtube", title: "Live YouTube - Futsal Lelaki", url: "https://www.youtube.com/@SabahSukan", isLive: true },
  { sportSlug: "futsal", divSlug: "wanita", platform: "tiktok", title: "Live TikTok - Futsal Wanita", url: "https://www.tiktok.com/@sabahsukan", isLive: false },
  { sportSlug: "badminton", divSlug: "berpasukan", platform: "facebook", title: "Live Facebook - Badminton", url: "https://www.facebook.com/SabahSukan", isLive: false },
  { sportSlug: "bola-tampar", divSlug: "lelaki", platform: "youtube", title: "Live YouTube - Bola Tampar Lelaki", url: "https://www.youtube.com/@SabahSukan", isLive: true },
];

const streams = [];
let streamSeq = 0;
for (const s of STREAM_SEED) {
  const sport = sports.find((sp) => sp.slug === s.sportSlug);
  const division = divisions.find((d) => d.sportId === sport.id && d.slug === s.divSlug);
  streamSeq += 1;
  streams.push({
    id: `stream_${streamSeq}`,
    divisionId: division.id,
    platform: s.platform,
    title: s.title,
    url: s.url,
    isLive: s.isLive,
    order: streamSeq,
  });
}

const db = {
  settings: {
    title: "Kejohanan Sukan 2026",
    subtitle: "Kejohanan Sukan Antara Daerah Sabah",
    organizer: "Jawatankuasa Kejohanan Sukan Sabah 2026",
    startDate: TODAY,
    endDate: addDays(TODAY, 6),
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    updatedAt: new Date().toISOString(),
  },
  sports,
  divisions,
  teams,
  matches,
  streams,
};

writeFileSync(join(__dirname, "..", "data", "db.json"), JSON.stringify(db, null, 2));
console.log(
  `Seeded ${sports.length} sports, ${divisions.length} divisions, ${teams.length} teams, ${matches.length} matches, ${streams.length} streams.`
);
