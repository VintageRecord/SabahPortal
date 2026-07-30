import { notFound } from "next/navigation";
import { getDivision, getDivisionStreams } from "@/lib/data";
import StreamEmbed from "@/components/StreamEmbed";

export default async function DivisionStreamPage({
  params,
}: {
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const result = await getDivision(sportSlug, divisionSlug);
  if (!result) notFound();

  const streams = await getDivisionStreams(result.division.id);

  return (
    <div>
      <h2 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
        Siaran Langsung
      </h2>

      {streams.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          Tiada pautan strim buat masa ini. Sila semak semula nanti.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {streams.map((stream) => (
            <StreamEmbed key={stream.id} stream={stream} />
          ))}
        </div>
      )}
    </div>
  );
}
