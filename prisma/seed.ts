// Seeds the database with the 9-sport Kejohanan Sukan 2026 championship.
// Run with: npm run db:seed
import { PrismaClient, MatchStatus, StreamPlatform } from "@prisma/client";

const prisma = new PrismaClient();

const TODAY = "2026-07-30";
const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const DISTRICTS: [string, string][] = [
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

type ScoreStyle = "games3" | "sets3" | "sets5" | "legs7" | "points13" | "goals";

interface SportDef {
  slug: string;
  name: string;
  icon: string;
  venues: string[];
  scoreStyle: ScoreStyle;
  divisions: { slug: string; name: string }[];
}

const SPORT_DEFS: SportDef[] = [
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

function roundRobinRounds(n: number): [number, number][][] {
  const ids = [...Array(n).keys()];
  const rounds: [number, number][][] = [];
  const fixed = ids[0];
  const rest = ids.slice(1);
  const totalRounds = n - 1;
  for (let r = 0; r < totalRounds; r++) {
    const pairs: [number, number][] = [];
    const cur = [fixed, ...rest];
    for (let i = 0; i < n / 2; i++) {
      pairs.push([cur[i], cur[n - 1 - i]]);
    }
    rounds.push(pairs);
    rest.push(rest.shift()!);
  }
  return rounds;
}

function randInt(a: number, b: number) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

function finishedScore(style: ScoreStyle): [number, number] {
  switch (style) {
    case "games3": {
      const lose = Math.random() < 0.5 ? 0 : 1;
      return Math.random() < 0.5 ? [2, lose] : [lose, 2];
    }
    case "sets3": {
      const lose = Math.random() < 0.5 ? 0 : 1;
      return Math.random() < 0.5 ? [2, lose] : [lose, 2];
    }
    case "sets5": {
      const lose = randInt(0, 2);
      return Math.random() < 0.5 ? [3, lose] : [lose, 3];
    }
    case "legs7": {
      const lose = randInt(0, 3);
      return Math.random() < 0.5 ? [4, lose] : [lose, 4];
    }
    case "points13": {
      const lose = randInt(2, 11);
      return Math.random() < 0.5 ? [13, lose] : [lose, 13];
    }
    case "goals": {
      return [randInt(0, 5), randInt(0, 5)];
    }
    default:
      return [0, 0];
  }
}

function liveScore(style: ScoreStyle): [number, number] {
  const [a, b] = finishedScore(style);
  return [Math.round(a * 0.5), Math.round(b * 0.5)];
}

function liveMinute(style: ScoreStyle) {
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

const STREAM_SEED: {
  sportSlug: string;
  divSlug: string;
  platform: StreamPlatform;
  title: string;
  url: string;
  isLive: boolean;
}[] = [
  { sportSlug: "futsal", divSlug: "lelaki", platform: "YOUTUBE", title: "Live YouTube - Futsal Lelaki", url: "https://www.youtube.com/@SabahSukan", isLive: true },
  { sportSlug: "futsal", divSlug: "wanita", platform: "TIKTOK", title: "Live TikTok - Futsal Wanita", url: "https://www.tiktok.com/@sabahsukan", isLive: false },
  { sportSlug: "badminton", divSlug: "berpasukan", platform: "FACEBOOK", title: "Live Facebook - Badminton", url: "https://www.facebook.com/SabahSukan", isLive: false },
  { sportSlug: "bola-tampar", divSlug: "lelaki", platform: "YOUTUBE", title: "Live YouTube - Bola Tampar Lelaki", url: "https://www.youtube.com/@SabahSukan", isLive: true },
];

const ROUND1_SLOTS: { time: string; status: MatchStatus }[] = [
  { time: "08:30", status: MatchStatus.FINISHED },
  { time: "10:00", status: MatchStatus.LIVE },
  { time: "13:00", status: MatchStatus.UPCOMING },
];
const OTHER_ROUND_SLOTS = ["09:00", "11:30", "16:00"];

async function main() {
  console.log("Clearing existing data...");
  await prisma.streamLink.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.division.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.eventSettings.deleteMany();

  await prisma.eventSettings.create({
    data: {
      id: 1,
      title: "Kejohanan Sukan 2026",
      subtitle: "Kejohanan Sukan Antara Daerah Sabah",
      organizer: "Jawatankuasa Kejohanan Sukan Sabah 2026",
      startDate: new Date(TODAY),
      endDate: new Date(addDays(TODAY, 6)),
      pointsWin: 3,
      pointsDraw: 1,
      pointsLoss: 0,
    },
  });

  let districtOffset = 0;
  let teamColorSeq = 0;
  let sportOrder = 0;

  for (const sportDef of SPORT_DEFS) {
    sportOrder += 1;
    const sport = await prisma.sport.create({
      data: {
        slug: sportDef.slug,
        name: sportDef.name,
        icon: sportDef.icon,
        order: sportOrder,
      },
    });

    for (const [divIdx, divDef] of sportDef.divisions.entries()) {
      const division = await prisma.division.create({
        data: {
          sportId: sport.id,
          slug: divDef.slug,
          name: divDef.name,
          format: "round-robin",
          order: divIdx + 1,
        },
      });

      const teamCount = 6;
      const createdTeams = [];
      for (let i = 0; i < teamCount; i++) {
        const [name, short] = DISTRICTS[(districtOffset + i) % DISTRICTS.length];
        teamColorSeq += 1;
        const team = await prisma.team.create({
          data: {
            divisionId: division.id,
            name,
            shortName: short,
            color: COLORS[teamColorSeq % COLORS.length],
          },
        });
        createdTeams.push(team);
      }
      districtOffset += 3;

      const rounds = roundRobinRounds(createdTeams.length);
      for (const [roundIdx, pairs] of rounds.entries()) {
        const roundNumber = roundIdx + 1;
        const date = addDays(TODAY, roundIdx);
        for (const [pairIdx, [ai, bi]] of pairs.entries()) {
          const venue = sportDef.venues[pairIdx % sportDef.venues.length];
          let time: string;
          let status: MatchStatus;
          if (roundNumber === 1) {
            const slot = ROUND1_SLOTS[pairIdx % ROUND1_SLOTS.length];
            time = slot.time;
            status = slot.status;
          } else {
            time = OTHER_ROUND_SLOTS[pairIdx % OTHER_ROUND_SLOTS.length];
            status = MatchStatus.UPCOMING;
          }

          let scoreA = 0;
          let scoreB = 0;
          let minute = "";
          if (status === MatchStatus.FINISHED) {
            [scoreA, scoreB] = finishedScore(sportDef.scoreStyle);
            minute = "Tamat";
          } else if (status === MatchStatus.LIVE) {
            [scoreA, scoreB] = liveScore(sportDef.scoreStyle);
            minute = liveMinute(sportDef.scoreStyle);
          }

          await prisma.match.create({
            data: {
              divisionId: division.id,
              round: roundNumber,
              teamAId: createdTeams[ai].id,
              teamBId: createdTeams[bi].id,
              scoreA,
              scoreB,
              status,
              date: new Date(date),
              time,
              venue,
              minute,
            },
          });
        }
      }
    }
  }

  let streamOrder = 0;
  for (const s of STREAM_SEED) {
    const sport = await prisma.sport.findUniqueOrThrow({ where: { slug: s.sportSlug } });
    const division = await prisma.division.findFirstOrThrow({
      where: { sportId: sport.id, slug: s.divSlug },
    });
    streamOrder += 1;
    await prisma.streamLink.create({
      data: {
        divisionId: division.id,
        platform: s.platform,
        title: s.title,
        url: s.url,
        isLive: s.isLive,
        order: streamOrder,
      },
    });
  }

  const [sportCount, divisionCount, teamCount, matchCount, streamCount] = await Promise.all([
    prisma.sport.count(),
    prisma.division.count(),
    prisma.team.count(),
    prisma.match.count(),
    prisma.streamLink.count(),
  ]);
  console.log(
    `Seeded ${sportCount} sports, ${divisionCount} divisions, ${teamCount} teams, ${matchCount} matches, ${streamCount} streams.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
