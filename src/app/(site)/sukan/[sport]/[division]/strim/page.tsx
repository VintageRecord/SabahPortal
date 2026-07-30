import { notFound } from "next/navigation";
import { getDivision, getDivisionMatches, getDivisionStreams, getSettings } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import StreamEmbed from "@/components/StreamEmbed";
import StreamSidebar from "@/components/StreamSidebar";

export default async function DivisionStreamPage({
  params,
}: {
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const result = await getDivision(sportSlug, divisionSlug);
  if (!result) notFound();
  const { sport, division } = result;

  const [streams, matches, settings, teamsCount] = await Promise.all([
    getDivisionStreams(division.id),
    getDivisionMatches(division.id),
    getSettings(),
    prisma.team.count({ where: { divisionId: division.id } }),
  ]);

  const venues = [...new Set(matches.map((m) => m.venue))];

  return (
    <div>
      <h2 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
        Siaran Langsung
      </h2>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {streams.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
              Tiada pautan strim buat masa ini. Sila semak semula nanti.
            </p>
          ) : (
            streams.map((stream) => <StreamEmbed key={stream.id} stream={stream} />)
          )}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <StreamSidebar
            sportSlug={sport.slug}
            divisionSlug={division.slug}
            divisionId={division.id}
            initialMatches={matches}
            sportName={sport.name}
            divisionName={division.name}
            format="Round-Robin"
            teamsCount={teamsCount}
            venues={venues}
            pointsWin={settings.pointsWin}
            pointsDraw={settings.pointsDraw}
            pointsLoss={settings.pointsLoss}
          />
        </div>
      </div>
    </div>
  );
}
