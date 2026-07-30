const ICONS: Record<string, React.ReactNode> = {
  badminton: (
    <>
      <circle cx="15.5" cy="8.5" r="2.5" />
      <path d="M13.8 10.2 4 20M9 13l3-3M7 15l3-3M11 17l3-3" strokeLinecap="round" />
    </>
  ),
  "sepak-takraw": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M6 7c3 3 3 11 0 14M18 7c-3 3-3 11 0 14M4.5 12h15" strokeLinecap="round" />
    </>
  ),
  pickleball: (
    <>
      <path d="M9.5 3.5a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4Z" />
      <path d="M6 11.5 3 20.5M9.5 3.5c1.2 0 2.5 3 2.5 5.2" strokeLinecap="round" />
      <circle cx="18.5" cy="17.5" r="1.6" />
    </>
  ),
  "ping-pong": (
    <>
      <circle cx="9" cy="9" r="6.2" />
      <path d="M12.4 13.4 5 21" strokeLinecap="round" />
      <circle cx="18" cy="6" r="1.7" />
    </>
  ),
  "bola-tampar": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path
        d="M12 4c2.5 2 3.6 5 3.6 8s-1.1 6-3.6 8M12 4c-2.5 2-3.6 5-3.6 8s1.1 6 3.6 8M4.4 9.8c2.3 1.2 5 1.9 7.6 1.9s5.3-.7 7.6-1.9M4.4 14.2c2.3-1.2 5-1.9 7.6-1.9s5.3.7 7.6 1.9"
        strokeLinecap="round"
      />
    </>
  ),
  dart: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.2" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  petanque: (
    <>
      <circle cx="8.5" cy="14" r="4.5" />
      <circle cx="15.5" cy="9" r="4.5" />
      <circle cx="19.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  karom: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <circle cx="7" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  futsal: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path
        d="M12 8.2 15.2 10.4 14 14.2H10L8.8 10.4 12 8.2ZM12 8.2V4M14 14.2l3.4 2.4M10 14.2 6.6 16.6M8.8 10.4 5 9.2M15.2 10.4 19 9.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

export default function SportIcon({
  slug,
  fallback,
  size = 20,
  className = "",
}: {
  slug: string;
  fallback?: string;
  size?: number;
  className?: string;
}) {
  const icon = ICONS[slug];
  if (!icon) {
    if (fallback) {
      return (
        <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
          {fallback}
        </span>
      );
    }
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
        <circle cx="12" cy="15" r="5.5" />
        <path d="m9 4-3 7.5M15 4l3 7.5M9 4h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

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
