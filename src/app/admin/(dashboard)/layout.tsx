import Link from "next/link";
import { getSettings } from "@/lib/data";
import { logoutAction } from "../auth-actions";

const NAV = [
  { href: "/admin", label: "Papan Pemuka" },
  { href: "/admin/matches", label: "Perlawanan & Skor" },
  { href: "/admin/teams", label: "Pasukan" },
  { href: "/admin/streams", label: "Strim" },
  { href: "/admin/settings", label: "Tetapan" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-maroon-600 text-white">
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
            <Link href="/" className="text-xs font-medium text-maroon-600 hover:underline">
              Lihat Laman Awam
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Log Keluar
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
