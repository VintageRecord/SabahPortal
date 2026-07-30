import Link from "next/link";
import { getSettings } from "@/lib/data";
import { logoutAction } from "../auth-actions";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 text-white shadow-sm">
              🏆
            </span>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-800 dark:text-slate-100">
                Panel Admin
              </p>
              <p className="text-[11px] leading-tight text-slate-400">{settings.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-xs font-medium text-maroon-600 transition hover:bg-maroon-50 dark:hover:bg-maroon-950/40"
            >
              Lihat Laman Awam
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Log Keluar
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
