import { notFound } from "next/navigation";
import { getDivision, getDivisionStreams } from "@/lib/data";
import { PLATFORM_ICON, PLATFORM_LABEL } from "@/lib/format";

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
        <div className="grid gap-3 sm:grid-cols-2">
          {streams.map((stream) => (
            <a
              key={stream.id}
              href={stream.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-maroon-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl dark:bg-slate-800">
                {PLATFORM_ICON[stream.platform]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {stream.title}
                  </p>
                  {stream.isLive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{PLATFORM_LABEL[stream.platform]}</p>
              </div>
              <span className="text-slate-300">→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
