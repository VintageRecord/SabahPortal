export default function TeamBadge({
  name,
  shortName,
  color,
  size = "md",
}: {
  name: string;
  shortName: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-14 w-14 text-base",
  }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClasses}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {shortName}
    </div>
  );
}
