/**
 * The birthday is stored as a UTC midnight timestamp so the card can render it
 * with `getUTCDate()` and never drift a day across timezones.
 *
 * Every read and write of the three birthday fields goes through here: the
 * sidebar form, the live preview, and the server action that persists it.
 * They must agree — a value assembled in two different places is how the
 * editor and the preview drifted apart.
 */

export type BirthdayParts = {
  day: string
  month: string
  year: string
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function parseBirthdayParts(day: string, month: string, year: string): Date | null {
  const d = Number(day)
  const m = Number(month)
  const y = Number(year)

  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return null
  if (m < 1 || m > 12) return null
  if (y < 1000 || y > 9999) return null

  const date = new Date(Date.UTC(y, m - 1, d))
  // Date.UTC silently rolls invalid days over (Feb 30 becomes Mar 2).
  if (
    date.getUTCDate() !== d ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCFullYear() !== y
  ) {
    return null
  }

  return date
}

export function formatBirthdayParts(date: Date): BirthdayParts {
  return {
    day: String(date.getUTCDate()),
    month: String(date.getUTCMonth() + 1),
    year: String(date.getUTCFullYear()),
  }
}

/**
 * The card renders the birthday from the profile, which reaches it as a
 * `Date` on the server and as an ISO string after the postMessage hop into
 * the preview frame. Both must produce the same parts.
 */
export function birthdayPartsFrom(value: Date | string): BirthdayParts | null {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return formatBirthdayParts(date)
}
