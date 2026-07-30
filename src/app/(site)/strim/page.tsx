import Link from "next/link";
import { getAllStreams } from "@/lib/data";
import { PLATFORM_ICON, PLATFORM_LABEL } from "@/lib/format";

export default async function StreamsPage() {
  const streams = await getAllStreams();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
        Siaran Langsung
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Ikuti perlawanan melalui TikTok, YouTube dan platform lain yang digunakan oleh penganjur.
      </p>

      {streams.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          Tiada pautan strim ditambah lagi.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <a
                href={stream.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
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
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{PLATFORM_LABEL[stream.platform]}</p>
                </div>
              </a>
              <Link
                href={`/sukan/${stream.division.sport.slug}/${stream.division.slug}`}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline"
              >
                {stream.division.sport.icon} {stream.division.sport.name} · {stream.division.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
