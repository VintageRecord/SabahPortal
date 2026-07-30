import Link from "next/link";
import SportIcon from "@/components/icons/SportIcon";
import PlatformIcon from "@/components/icons/PlatformIcon";
import StreamEmbed from "@/components/StreamEmbed";
import { getAllStreams } from "@/lib/data";
import { PLATFORM_LABEL } from "@/lib/format";

export default async function StreamsPage() {
  const streams = await getAllStreams();
  const liveStreams = streams.filter((s) => s.isLive);
  const otherStreams = streams.filter((s) => !s.isLive);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
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
        <>
          {liveStreams.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                Sedang Langsung Sekarang
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {liveStreams.map((stream) => (
                  <div key={stream.id}>
                    <StreamEmbed stream={stream} />
                    <Link
                      href={`/sukan/${stream.division.sport.slug}/${stream.division.slug}`}
                      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-maroon-600 hover:underline"
                    >
                      <SportIcon
                        slug={stream.division.sport.slug}
                        fallback={stream.division.sport.icon}
                        size={13}
                        className="shrink-0"
                      />
                      {stream.division.sport.name} · {stream.division.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherStreams.length > 0 && (
            <div>
              {liveStreams.length > 0 && (
                <h2 className="mb-3 text-sm font-bold text-slate-500">Pautan Strim Lain</h2>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-xl hover:shadow-maroon-900/10 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <a
                      href={stream.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                        <PlatformIcon platform={stream.platform} size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                          {stream.title}
                        </p>
                        <p className="text-xs text-slate-400">{PLATFORM_LABEL[stream.platform]}</p>
                      </div>
                    </a>
                    <Link
                      href={`/sukan/${stream.division.sport.slug}/${stream.division.slug}`}
                      className="flex items-center gap-1.5 text-xs font-medium text-maroon-600 hover:underline"
                    >
                      <SportIcon
                        slug={stream.division.sport.slug}
                        fallback={stream.division.sport.icon}
                        size={13}
                        className="shrink-0"
                      />
                      {stream.division.sport.name} · {stream.division.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
