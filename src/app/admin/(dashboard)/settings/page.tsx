import { getSettings } from "@/lib/data";
import { toDateKey } from "@/lib/format";
import { updateSettingsAction } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">
        Tetapan Kejohanan
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Nama acara, tempoh kejohanan dan sistem mata untuk kedudukan liga.
      </p>

      <form
        action={updateSettingsAction}
        className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nama Kejohanan
          <input
            type="text"
            name="title"
            defaultValue={settings.title}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Sari Kata / Subtajuk
          <input
            type="text"
            name="subtitle"
            defaultValue={settings.subtitle}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Penganjur
          <input
            type="text"
            name="organizer"
            defaultValue={settings.organizer}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tarikh Mula
            <input
              type="date"
              name="startDate"
              defaultValue={toDateKey(settings.startDate)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tarikh Tamat
            <input
              type="date"
              name="endDate"
              defaultValue={toDateKey(settings.endDate)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Sistem Mata (Kedudukan Liga)
          </p>
          <div className="grid grid-cols-3 gap-4">
            <label className="block text-xs text-slate-500">
              Menang
              <input
                type="number"
                name="pointsWin"
                defaultValue={settings.pointsWin}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="block text-xs text-slate-500">
              Seri
              <input
                type="number"
                name="pointsDraw"
                defaultValue={settings.pointsDraw}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
            <label className="block text-xs text-slate-500">
              Kalah
              <input
                type="number"
                name="pointsLoss"
                defaultValue={settings.pointsLoss}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Simpan Tetapan
        </button>
      </form>
    </div>
  );
}
