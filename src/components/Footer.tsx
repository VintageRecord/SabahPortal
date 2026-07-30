import Link from "next/link";

export default function Footer({ organizer }: { organizer: string }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>&copy; {new Date().getFullYear()} {organizer}</p>
        <Link href="/admin" className="text-xs text-slate-400 hover:text-indigo-600">
          Panel Admin
        </Link>
      </div>
    </footer>
  );
}
