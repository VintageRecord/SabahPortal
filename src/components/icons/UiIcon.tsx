const ICONS: Record<string, React.ReactNode> = {
  trophy: (
    <path
      d="M8 4h8v3a4 4 0 0 1-4 4 4 4 0 0 1-4-4V4ZM5 5H4a2 2 0 0 0 0 4h1M19 5h1a2 2 0 0 1 0 4h-1M12 11v3M9 20h6M10 17h4v3h-4v-3Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" strokeLinecap="round" />
    </>
  ),
  refresh: (
    <path
      d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5M19.5 12a7.5 7.5 0 0 1-12.6 5.5M15.5 6h3.5V2.5M8.5 18H5v3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="5.5" />
      <path d="m9 4-3 7.5M15 4l3 7.5M9 4h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10.3 15 1.2 1.4L13.7 13.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z" strokeLinejoin="round" />,
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
      <path d="M16 5.2A3 3 0 0 1 16 11M17.5 14c2.3.4 3.7 2.1 3.7 5" strokeLinecap="round" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4M17.8 17.8l-1.4-1.4M7.6 7.6 6.2 6.2"
        strokeLinecap="round"
      />
    </>
  ),
};

export default function UiIcon({
  name,
  size = 18,
  className = "",
}: {
  name: keyof typeof ICONS;
  size?: number;
  className?: string;
}) {
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
      {ICONS[name]}
    </svg>
  );
}
