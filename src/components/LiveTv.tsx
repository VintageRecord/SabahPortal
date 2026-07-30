"use client";

import { useState } from "react";
import Link from "next/link";
import SportIcon from "./icons/SportIcon";
import PlatformIcon from "./icons/PlatformIcon";
import { PLATFORM_LABEL } from "@/lib/format";
import { getFacebookEmbedUrl, getYouTubeEmbedUrl } from "@/lib/stream";
import type { StreamWithDivision } from "@/lib/types";

const PLATFORM_COLOR: Record<string, string> = {
  YOUTUBE: "bg-red-600",
  TIKTOK: "bg-slate-900",
  FACEBOOK: "bg-blue-600",
  INSTAGRAM: "bg-gradient-to-br from-amber-500 via-pink-600 to-purple-600",
  OTHER: "bg-maroon-600",
};

export default function LiveTv({ streams }: { streams: StreamWithDivision[] }) {
  const [selectedId, setSelectedId] = useState(streams[0]?.id);

  if (streams.length === 0) return null;

  const selected = streams.find((s) => s.id === selectedId) ?? streams[0];
  const embedUrl =
    selected.platform === "YOUTUBE"
      ? getYouTubeEmbedUrl(selected.url)
      : selected.platform === "FACEBOOK"
        ? getFacebookEmbedUrl(selected.url)
        : null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Tonton Langsung
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-3xl bg-gradient-to-b from-slate-700 to-slate-950 p-3 shadow-2xl sm:p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            {embedUrl ? (
              <iframe
                key={selected.id}
                src={embedUrl}
                title={selected.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-white transition hover:bg-white/5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ${PLATFORM_COLOR[selected.platform]}`}
                >
                  <PlatformIcon platform={selected.platform} size={26} />
                </span>
                <span className="text-sm font-semibold">
                  Tonton di {PLATFORM_LABEL[selected.platform]} ↗
                </span>
                <span className="max-w-xs text-xs text-white/60">
                  {PLATFORM_LABEL[selected.platform]} tidak membenarkan strim dibenamkan terus.
                </span>
              </a>
            )}

            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              LIVE
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 max-w-[80%] truncate rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {selected.division.sport.name} · {selected.division.name}
            </div>
          </div>
          <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-black/30" />
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-800 dark:border-slate-800 dark:text-slate-100">
            Pilih Saluran
          </div>
          <div className="max-h-[420px] space-y-1 overflow-y-auto p-2 lg:max-h-none lg:flex-1">
            {streams.map((stream) => {
              const active = stream.id === selected.id;
              return (
                <button
                  key={stream.id}
                  onClick={() => setSelectedId(stream.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-maroon-50 text-maroon-700 dark:bg-maroon-950/50 dark:text-maroon-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <SportIcon
                    slug={stream.division.sport.slug}
                    fallback={stream.division.sport.icon}
                    size={16}
                    className="shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {stream.division.sport.name} · {stream.division.name}
                  </span>
                  {active ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                  ) : (
                    <PlatformIcon platform={stream.platform} size={13} className="shrink-0 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
          <Link
            href={`/sukan/${selected.division.sport.slug}/${selected.division.slug}/strim`}
            className="border-t border-slate-100 px-4 py-2.5 text-center text-xs font-semibold text-maroon-600 transition hover:bg-maroon-50 dark:border-slate-800 dark:text-maroon-400 dark:hover:bg-slate-800"
          >
            Lihat skor &amp; maklumat penuh →
          </Link>
        </div>
      </div>
    </section>
  );
}
