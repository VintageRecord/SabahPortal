import Link from "next/link";

export default function Footer({ organizer }: { organizer: string }) {
  return (
    <footer className="mt-auto bg-white py-6 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-maroon-200 to-transparent dark:via-maroon-900" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 pt-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>&copy; {new Date().getFullYear()} {organizer}</p>
        <Link
          href="/admin"
          className="rounded-full px-3 py-1 text-xs text-slate-400 transition hover:bg-maroon-50 hover:text-maroon-600 dark:hover:bg-maroon-950/40"
        >
          Panel Admin
        </Link>
      </div>
    </footer>
  );
}
