const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

export function ZodiacIcon({ name }: { name: string }) {
  let mark
  switch (name) {
    case "Aries": mark = <path d="M7 31c0-9 5-16 11-16 4 0 6 4 6 10 0-6 2-10 6-10 6 0 11 7 11 16M24 25v15" />; break
    case "Taurus": mark = <><circle cx="24" cy="28" r="11" /><path d="M13 22C8 20 7 16 7 12m30 10c5-2 6-6 6-10M7 12c4 0 7 2 9 5m27-5c-4 0-7 2-9 5" /></>; break
    case "Gemini": mark = <path d="M10 10c8 4 20 4 28 0M10 38c8-4 20-4 28 0M15 12v24m18-24v24" />; break
    case "Cancer": mark = <><path d="M15 15c-4-5-1-9 4-9s8 4 8 9-4 9-9 9-9-4-9-9m18 18c4 5 1 9-4 9s-8-4-8-9 4-9 9-9 9 4 9 9" /><circle cx="11" cy="15" r="1.5" /><circle cx="37" cy="33" r="1.5" /></>; break
    case "Leo": mark = <><circle cx="18" cy="21" r="7" /><path d="M24 17c7-8 13-1 9 5-3 5-9 3-11 0m-5 6c-2 7 3 11 9 8 5-3 5-10 3-14m-3 14 8 3" /></>; break
    case "Virgo": mark = <path d="M8 12v26m0-25c8-2 10 5 10 13v12m0-25c8-2 10 5 10 13v12m0-25c8-2 10 4 9 11-1 8-5 12-11 15 5 3 9 2 13-1" />; break
    case "Libra": mark = <path d="M8 34h32M12 29h24M12 29a12 12 0 0 1 24 0M24 8v7m-6-3h12" />; break
    case "Scorpio": mark = <path d="M8 12v26m0-25c8-2 10 5 10 13v12m0-25c8-2 10 5 10 13v12m0-25c8-2 10 5 10 13v12l7-7m0 0-1 7m1-7-7-1" />; break
    case "Sagittarius": mark = <path d="m10 38 27-27m-1 0h-9m9 0v9M13 17l14 14" />; break
    case "Capricorn": mark = <path d="M8 12c5-2 8 2 9 10l3 15m-12-2 8-13c5-8 16-9 20-3 4 7-1 16-9 16-6 0-8-5-5-9 3-4 10-3 12 1" />; break
    case "Aquarius": mark = <path d="m7 19 7-5 7 5 7-5 7 5 7-5M7 31l7-5 7 5 7-5 7 5 7-5" />; break
    case "Pisces": mark = <path d="M8 10c10 3 18 12 18 14S18 35 8 38m32-28c-10 3-18 12-18 14s8 11 18 14M10 24h28" />; break
    default: mark = <path d="M24 7v34M12 13c6 0 12 5 12 11 0-6 6-11 12-11M12 35c6 0 12-5 12-11 0 6 6 11 12 11" />
  }

  return <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9 shrink-0 text-[var(--theme-accent)]" {...common}>{mark}</svg>
}
