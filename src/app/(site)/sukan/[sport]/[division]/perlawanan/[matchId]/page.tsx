import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchDetail } from "@/lib/data";
import MatchDetailHeader from "@/components/MatchDetailHeader";
import MatchLineup from "@/components/MatchLineup";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ sport: string; division: string; matchId: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug, matchId } = await params;
  const detail = await getMatchDetail(matchId);
  if (!detail) notFound();

  const { match, teamAPlayers, teamBPlayers } = detail;
  if (match.division.sport.slug !== sportSlug || match.division.slug !== divisionSlug) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/sukan/${sportSlug}/${divisionSlug}`}
        className="mb-4 inline-block text-xs font-medium text-maroon-600 hover:underline"
      >
        ← Kembali ke {match.division.sport.name} · {match.division.name}
      </Link>

      <MatchDetailHeader
        match={match}
        divisionId={match.divisionId}
        roundBased={match.division.sport.roundBased}
        scoreLabel={match.division.sport.scoreLabel}
      />

      <div className="mt-6">
        {match.division.sport.hasLineup ? (
          <MatchLineup
            teamA={match.teamA}
            teamB={match.teamB}
            teamAPlayers={teamAPlayers}
            teamBPlayers={teamBPlayers}
            events={match.events}
          />
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
            Butiran pemain tidak berkenaan untuk sukan ini.
          </p>
        )}
      </div>
    </div>
  );
}
