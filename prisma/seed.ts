// Seeds the database with the 9-sport Pesta Sukan Antara Wilayah [PESAWI] Ke-13 championship.
// Run with: npm run db:seed
import { PrismaClient, MatchStatus, MatchStage, StreamPlatform } from "@prisma/client";

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
  scoreLabel: string;
  hasLineup?: boolean;
  positions?: string[];
  divisions: { slug: string; name: string }[];
}

const FIRST_NAMES = [
  "Ahmad", "Muhammad", "Amirul", "Farid", "Aiman", "Danish", "Haziq", "Iskandar",
  "Adam", "Rayyan", "Zulhilmi", "Faris", "Naufal", "Hakim", "Syafiq", "Firdaus",
  "Nurul", "Siti", "Aisyah", "Farah", "Nadia", "Alia", "Sofea", "Batrisyia",
  "Aina", "Iman", "Qistina", "Damia", "Zara", "Elena",
];
const LAST_NAMES = [
  "Rahman", "Yusof", "Osman", "Ibrahim", "Hassan", "Kassim", "Salleh", "Talib",
  "Majid", "Latif", "Aziz", "Bakar", "Hamid", "Saad", "Idris", "Karim",
];

function randomName(usedNames: Set<string>) {
  let name = "";
  do {
    name = `${FIRST_NAMES[randInt(0, FIRST_NAMES.length - 1)]} ${LAST_NAMES[randInt(0, LAST_NAMES.length - 1)]}`;
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
}

const SPORT_DEFS: SportDef[] = [
  {
    slug: "badminton",
    name: "Badminton",
    icon: "🏸",
    venues: ["Dewan Badminton MSN Sabah, Kota Kinabalu"],
    scoreStyle: "games3",
    scoreLabel: "Set",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "sepak-takraw",
    name: "Sepak Takraw",
    icon: "🥎",
    venues: ["Dewan Sepak Takraw Karamunsing"],
    scoreStyle: "sets3",
    scoreLabel: "Set",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "pickleball",
    name: "Pickleball",
    icon: "🎾",
    venues: ["Kompleks Pickleball Likas"],
    scoreStyle: "games3",
    scoreLabel: "Gim",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "ping-pong",
    name: "Ping Pong",
    icon: "🏓",
    venues: ["Dewan Tenis Meja, Kompleks Belia & Sukan KK"],
    scoreStyle: "games3",
    scoreLabel: "Gim",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "bola-tampar",
    name: "Bola Tampar",
    icon: "🏐",
    venues: ["Dewan Bola Tampar Universiti Malaysia Sabah"],
    scoreStyle: "sets5",
    scoreLabel: "Set",
    hasLineup: true,
    positions: ["Pemukul Luar", "Pemukul Tengah", "Pengesan", "Penyangkak", "Libero"],
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
    scoreLabel: "Leg",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "petanque",
    name: "Petanque",
    icon: "🔘",
    venues: ["Padang Petanque, Karamunsing"],
    scoreStyle: "points13",
    scoreLabel: "Mata",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "karom",
    name: "Karom",
    icon: "⚫",
    venues: ["Dewan Komuniti Penampang"],
    scoreStyle: "games3",
    scoreLabel: "Set",
    divisions: [{ slug: "berpasukan", name: "Berpasukan" }],
  },
  {
    slug: "futsal",
    name: "Futsal",
    icon: "⚽",
    venues: ["Arena Futsal MBSA, Kota Kinabalu", "Arena Futsal Inanam"],
    scoreStyle: "goals",
    scoreLabel: "Gol",
    hasLineup: true,
    positions: ["Penjaga Gol", "Pertahanan", "Sayap", "Pivot"],
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

const PLACEHOLDER_YOUTUBE_URL = "https://www.youtube.com/watch?v=TVpSVuUK3aY";
const NON_LIVE_PLATFORMS: StreamPlatform[] = ["YOUTUBE", "TIKTOK", "FACEBOOK", "INSTAGRAM"];

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
      title: "Pesta Sukan Antara Wilayah [PESAWI] Ke-13",
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
  const liveDivisionIds = new Set<string>();
  const allDivisions: {
    id: string;
    sportSlug: string;
    sportName: string;
    divSlug: string;
    divName: string;
  }[] = [];
  let bracketDemoDivisionId: string | null = null;
  let bracketDemoTeams: { id: string; name: string; shortName: string; color: string }[] = [];

  for (const sportDef of SPORT_DEFS) {
    sportOrder += 1;
    const sport = await prisma.sport.create({
      data: {
        slug: sportDef.slug,
        name: sportDef.name,
        icon: sportDef.icon,
        hasLineup: sportDef.hasLineup ?? false,
        scoreLabel: sportDef.scoreLabel,
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
      allDivisions.push({
        id: division.id,
        sportSlug: sportDef.slug,
        sportName: sportDef.name,
        divSlug: divDef.slug,
        divName: divDef.name,
      });

      const teamCount = 8;
      const createdTeams = [];
      const teamPlayers = new Map<string, { id: string }[]>();
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

        if (sportDef.hasLineup) {
          const usedNames = new Set<string>();
          const rosterSize = 10;
          const players = [];
          for (let n = 1; n <= rosterSize; n++) {
            const position = sportDef.positions?.[n % (sportDef.positions?.length ?? 1)];
            const player = await prisma.player.create({
              data: {
                teamId: team.id,
                name: randomName(usedNames),
                jerseyNumber: n,
                position,
              },
            });
            players.push(player);
          }
          teamPlayers.set(team.id, players);
        }
      }
      districtOffset += 4;

      if (sportDef.slug === "futsal" && divDef.slug === "lelaki") {
        bracketDemoDivisionId = division.id;
        bracketDemoTeams = createdTeams.slice(0, 8);
      }

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

          const match = await prisma.match.create({
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

          if (status === MatchStatus.LIVE) {
            liveDivisionIds.add(division.id);
          }

          if (
            sportDef.hasLineup &&
            (status === MatchStatus.FINISHED || status === MatchStatus.LIVE)
          ) {
            const teamAPlayers = teamPlayers.get(createdTeams[ai].id) ?? [];
            const teamBPlayers = teamPlayers.get(createdTeams[bi].id) ?? [];
            const eventMinute = () =>
              sportDef.scoreStyle === "goals"
                ? `${randInt(1, 40)}'`
                : `Set ${randInt(1, Math.max(scoreA + scoreB, 1))}`;

            for (let g = 0; g < scoreA; g++) {
              if (teamAPlayers.length === 0) break;
              const scorer = teamAPlayers[randInt(0, teamAPlayers.length - 1)];
              await prisma.matchEvent.create({
                data: {
                  matchId: match.id,
                  teamId: createdTeams[ai].id,
                  playerId: scorer.id,
                  minute: eventMinute(),
                },
              });
            }
            for (let g = 0; g < scoreB; g++) {
              if (teamBPlayers.length === 0) break;
              const scorer = teamBPlayers[randInt(0, teamBPlayers.length - 1)];
              await prisma.matchEvent.create({
                data: {
                  matchId: match.id,
                  teamId: createdTeams[bi].id,
                  playerId: scorer.id,
                  minute: eventMinute(),
                },
              });
            }
          }
        }
      }
    }
  }

  // Demo bracket: Futsal Lelaki, 8-team single elimination with standard
  // seeding (1v8, 4v5, 2v7, 3v6), fully played out so the "Carta" feature
  // has something to show immediately after seeding.
  if (bracketDemoDivisionId && bracketDemoTeams.length === 8) {
    const [s1, s2, s3, s4, s5, s6, s7, s8] = bracketDemoTeams;
    const venue = "Arena Futsal MBSA, Kota Kinabalu";

    const qfPairs: [typeof s1, typeof s1, number, number][] = [
      [s1, s8, 4, 1],
      [s4, s5, 3, 2],
      [s2, s7, 5, 0],
      [s3, s6, 2, 1],
    ];
    const qfWinners: (typeof s1)[] = [];
    for (const [idx, [teamA, teamB, scoreA, scoreB]] of qfPairs.entries()) {
      await prisma.match.create({
        data: {
          divisionId: bracketDemoDivisionId,
          round: 1,
          stage: MatchStage.QUARTERFINAL,
          bracketSlot: idx + 1,
          teamAId: teamA.id,
          teamBId: teamB.id,
          scoreA,
          scoreB,
          winnerId: scoreA > scoreB ? teamA.id : teamB.id,
          status: MatchStatus.FINISHED,
          date: new Date(addDays(TODAY, 2)),
          time: "15:00",
          venue,
          minute: "Tamat",
        },
      });
      qfWinners.push(scoreA > scoreB ? teamA : teamB);
    }

    const sfPairs: [typeof s1, typeof s1, number, number][] = [
      [qfWinners[0], qfWinners[1], 3, 2],
      [qfWinners[2], qfWinners[3], 2, 1],
    ];
    const sfWinners: (typeof s1)[] = [];
    for (const [idx, [teamA, teamB, scoreA, scoreB]] of sfPairs.entries()) {
      await prisma.match.create({
        data: {
          divisionId: bracketDemoDivisionId,
          round: 1,
          stage: MatchStage.SEMIFINAL,
          bracketSlot: idx + 1,
          teamAId: teamA.id,
          teamBId: teamB.id,
          scoreA,
          scoreB,
          winnerId: scoreA > scoreB ? teamA.id : teamB.id,
          status: MatchStatus.FINISHED,
          date: new Date(addDays(TODAY, 3)),
          time: "17:00",
          venue,
          minute: "Tamat",
        },
      });
      sfWinners.push(scoreA > scoreB ? teamA : teamB);
    }

    await prisma.match.create({
      data: {
        divisionId: bracketDemoDivisionId,
        round: 1,
        stage: MatchStage.FINAL,
        bracketSlot: 1,
        teamAId: sfWinners[0].id,
        teamBId: sfWinners[1].id,
        scoreA: 2,
        scoreB: 0,
        winnerId: sfWinners[0].id,
        status: MatchStatus.FINISHED,
        date: new Date(addDays(TODAY, 4)),
        time: "19:00",
        venue,
        minute: "Tamat",
      },
    });
  }

  const PLATFORM_LABEL: Record<StreamPlatform, string> = {
    YOUTUBE: "YouTube",
    TIKTOK: "TikTok",
    FACEBOOK: "Facebook",
    INSTAGRAM: "Instagram",
    OTHER: "Lain-lain",
  };
  const PLATFORM_URL: Record<StreamPlatform, string> = {
    YOUTUBE: PLACEHOLDER_YOUTUBE_URL,
    TIKTOK: "https://www.tiktok.com/@sabahsukan",
    FACEBOOK: "https://www.facebook.com/SabahSukan",
    INSTAGRAM: "https://www.instagram.com/sabahsukan",
    OTHER: PLACEHOLDER_YOUTUBE_URL,
  };

  // Every division gets a stream link so its Strim tab always has something to show.
  // Divisions with a match currently LIVE always get a real, embeddable YouTube link.
  let streamOrder = 0;
  for (const [idx, div] of allDivisions.entries()) {
    const isLive = liveDivisionIds.has(div.id);
    const platform: StreamPlatform = isLive
      ? "YOUTUBE"
      : NON_LIVE_PLATFORMS[idx % NON_LIVE_PLATFORMS.length];
    streamOrder += 1;
    await prisma.streamLink.create({
      data: {
        divisionId: div.id,
        platform,
        title: `${PLATFORM_LABEL[platform]} - ${div.sportName} ${div.divName}`,
        url: PLATFORM_URL[platform],
        isLive,
        order: streamOrder,
      },
    });
  }

  const [sportCount, divisionCount, teamCount, matchCount, streamCount, playerCount, eventCount] =
    await Promise.all([
      prisma.sport.count(),
      prisma.division.count(),
      prisma.team.count(),
      prisma.match.count(),
      prisma.streamLink.count(),
      prisma.player.count(),
      prisma.matchEvent.count(),
    ]);
  console.log(
    `Seeded ${sportCount} sports, ${divisionCount} divisions, ${teamCount} teams, ${matchCount} matches, ${streamCount} streams, ${playerCount} players, ${eventCount} match events.`
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
