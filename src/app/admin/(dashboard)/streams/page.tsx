import { prisma } from "@/lib/prisma";
import { PLATFORM_LABEL } from "@/lib/format";
import { createStreamAction, deleteStreamAction, updateStreamAction } from "./actions";

const PLATFORMS = ["YOUTUBE", "TIKTOK", "FACEBOOK", "INSTAGRAM", "OTHER"] as const;

export default async function AdminStreamsPage() {
  const [streams, divisions] = await Promise.all([
    prisma.streamLink.findMany({
      include: { division: { include: { sport: true } } },
      orderBy: [{ isLive: "desc" }, { order: "asc" }],
    }),
    prisma.division.findMany({ include: { sport: true }, orderBy: [{ sportId: "asc" }, { order: "asc" }] }),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">Pautan Strim</h1>
      <p className="mb-2 text-sm text-slate-500">
        Tambah pautan TikTok, YouTube, Facebook atau platform lain untuk setiap bahagian sukan.
      </p>
      <p className="mb-6 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        <strong>Untuk YouTube &amp; Facebook:</strong> tampal pautan video / siaran langsung
        (cth. youtube.com/watch?v=... atau pautan video Facebook Live), bukan pautan channel/halaman
        utama — supaya ia boleh dibenamkan terus di laman awam. TikTok &amp; Instagram tidak
        membenarkan strim langsung dibenamkan, jadi ia akan dipaparkan sebagai butang &quot;Tonton&quot;.
      </p>

      <div className="space-y-3">
        {streams.map((stream) => (
          <form
            key={stream.id}
            action={updateStreamAction}
            className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-6 sm:items-center dark:border-slate-800 dark:bg-slate-900"
          >
            <input type="hidden" name="streamId" value={stream.id} />
            <select
              name="divisionId"
              defaultValue={stream.divisionId}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.sport.icon} {d.sport.name} · {d.name}
                </option>
              ))}
            </select>
            <select
              name="platform"
              defaultValue={stream.platform}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_LABEL[p]}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="title"
              defaultValue={stream.title}
              placeholder="Tajuk"
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm sm:col-span-2 dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              type="url"
              name="url"
              defaultValue={stream.url}
              placeholder="https://..."
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-slate-500">
                <input type="checkbox" name="isLive" defaultChecked={stream.isLive} />
                Langsung
              </label>
              <button
                type="submit"
                className="rounded-lg bg-maroon-600 px-3 py-1 text-xs font-semibold text-white hover:bg-maroon-700"
              >
                Simpan
              </button>
              <button
                type="submit"
                formAction={deleteStreamAction}
                className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900"
              >
                Padam
              </button>
            </div>
          </form>
        ))}
        {streams.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
            Belum ada pautan strim.
          </p>
        )}
      </div>

      <form
        action={createStreamAction}
        className="mt-6 grid grid-cols-1 gap-2 rounded-xl border border-dashed border-maroon-300 bg-maroon-50/50 p-4 sm:grid-cols-6 sm:items-center dark:border-maroon-900 dark:bg-maroon-950/20"
      >
        <select
          name="divisionId"
          required
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">Pilih bahagian...</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.sport.icon} {d.sport.name} · {d.name}
            </option>
          ))}
        </select>
        <select
          name="platform"
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABEL[p]}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="title"
          required
          placeholder="Tajuk (cth: Live YouTube - Futsal)"
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm sm:col-span-2 dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          type="url"
          name="url"
          required
          placeholder="https://..."
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-slate-500">
            <input type="checkbox" name="isLive" />
            Langsung
          </label>
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-maroon-600 dark:hover:bg-maroon-700"
          >
            + Tambah
          </button>
        </div>
      </form>
    </div>
  );
}
