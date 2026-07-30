import PlatformIcon from "./icons/PlatformIcon";
import { PLATFORM_LABEL } from "@/lib/format";
import { getFacebookEmbedUrl, getYouTubeEmbedUrl } from "@/lib/stream";
import type { StreamLink } from "@prisma/client";

type StreamEmbedData = Pick<StreamLink, "id" | "platform" | "title" | "url" | "isLive">;

const PLATFORM_COLOR: Record<string, string> = {
  YOUTUBE: "bg-red-600",
  TIKTOK: "bg-slate-900",
  FACEBOOK: "bg-blue-600",
  INSTAGRAM: "bg-gradient-to-br from-amber-500 via-pink-600 to-purple-600",
  OTHER: "bg-maroon-600",
};

export default function StreamEmbed({ stream }: { stream: StreamEmbedData }) {
  const embedUrl =
    stream.platform === "YOUTUBE"
      ? getYouTubeEmbedUrl(stream.url)
      : stream.platform === "FACEBOOK"
        ? getFacebookEmbedUrl(stream.url)
        : null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${PLATFORM_COLOR[stream.platform]}`}
          >
            <PlatformIcon platform={stream.platform} size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {stream.title}
            </p>
            <p className="text-[11px] text-slate-400">{PLATFORM_LABEL[stream.platform]}</p>
          </div>
        </div>
        {stream.isLive && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
            LANGSUNG
          </span>
        )}
      </div>

      {embedUrl ? (
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title={stream.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <a
          href={stream.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800/70"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${PLATFORM_COLOR[stream.platform]}`}
          >
            <PlatformIcon platform={stream.platform} size={22} />
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tonton di {PLATFORM_LABEL[stream.platform]} ↗
          </span>
          <span className="max-w-xs text-[11px] text-slate-400">
            {PLATFORM_LABEL[stream.platform]} tidak membenarkan siaran langsung dibenamkan terus
            di laman lain. Klik untuk buka strim di {PLATFORM_LABEL[stream.platform]}.
          </span>
        </a>
      )}

      <div className="border-t border-slate-100 px-4 py-2 text-right dark:border-slate-800">
        <a
          href={stream.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-maroon-600 hover:underline"
        >
          Buka pautan asal ↗
        </a>
      </div>
    </div>
  );
}
