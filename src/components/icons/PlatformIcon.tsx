const ICONS: Record<string, React.ReactNode> = {
  YOUTUBE: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5v5l4.3-2.5-4.3-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  TIKTOK: (
    <path
      d="M14.5 3.5c.4 2.2 1.8 3.6 4 3.9v2.9c-1.5 0-2.8-.4-4-1.2v5.8a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v3a2.3 2.3 0 1 0 1.6 2.2V3.5h2.8Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  FACEBOOK: (
    <path d="M14.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.6v2.2H9.3v2.8h2.4V21h2.8Z" fill="currentColor" stroke="none" />
  ),
  INSTAGRAM: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  OTHER: (
    <>
      <path d="M9.5 14.5 14.5 9.5" strokeLinecap="round" />
      <path d="M11 7.5h-1a4 4 0 0 0 0 8h1M13 16.5h1a4 4 0 0 0 0-8h-1" strokeLinecap="round" />
    </>
  ),
};

export default function PlatformIcon({
  platform,
  size = 18,
  className = "",
}: {
  platform: string;
  size?: number;
  className?: string;
}) {
  const icon = ICONS[platform] ?? ICONS.OTHER;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={className}
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
