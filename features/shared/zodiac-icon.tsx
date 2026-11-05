const SIGN_FILES: Record<string, string> = {
  Aries: "aries",
  Taurus: "taurus",
  Gemini: "gemini",
  Cancer: "cancer",
  Leo: "leo",
  Virgo: "virgo",
  Libra: "libra",
  Scorpio: "scorpio",
  Sagittarius: "sagittarius",
  Capricorn: "capricorn",
  Aquarius: "aquarius",
  Pisces: "pisces",
}

export function ZodiacIcon({ name }: { name: string }) {
  const file = SIGN_FILES[name]
  if (!file) return null

  const mask = `url(/zodiac/${file}.svg)`
  return (
    <span
      aria-hidden="true"
      className="inline-block h-11 w-11 shrink-0 top-2 relative bg-current text-[var(--theme-accent)]"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  )
}
