import { loginAction } from "../auth-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-2xl text-white">
            🏆
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Panel Admin</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kejohanan Sukan 2026
          </p>
        </div>

        {hasError && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            Kata laluan salah. Sila cuba lagi.
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Kata Laluan
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Masukkan kata laluan admin"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Log Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
