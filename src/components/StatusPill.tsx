import { STATUS_LABEL } from "@/lib/format";

export default function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    LIVE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    UPCOMING: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    FINISHED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    POSTPONED: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[status] ?? styles.UPCOMING}`}
    >
      {status === "LIVE" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-600" />
        </span>
      )}
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
