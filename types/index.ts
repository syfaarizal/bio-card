// Prisma types — available after `prisma generate`
import type { Prisma } from "@prisma/client"

export type Profile = Prisma.ProfileGetPayload<object>
export type Music = Prisma.MusicGetPayload<object>
export type Image = Prisma.ImageGetPayload<object>
export type User = Prisma.UserGetPayload<object>

// Full profile with all relations
export type FullProfile = Prisma.ProfileGetPayload<{
  include: {
    links: true
    profileLinks: { orderBy: { sortOrder: "asc" } }
    music: true
    images: true
    user: { select: { username: true; email: true } }
  }
}>

// ProfileLink type
export type ProfileLink = Prisma.ProfileLinkGetPayload<object>

// Theme config
export interface ThemeConfig {
  id: string
  version: number
  name: string
  label: string
}

export const THEMES: ThemeConfig[] = [
  { id: "default", version: 1, name: "White", label: "Minimal" },
  { id: "midnight", version: 1, name: "Midnight", label: "Dark & Elegant" },
  { id: "rose", version: 1, name: "Rose", label: "Warm & Soft" },
  { id: "cyber", version: 1, name: "Cyber", label: "Neon & Techy" },
  { id: "cyber-red", version: 1, name: "Cyber Red", label: "Black & Red" },
  { id: "soft-green", version: 1, name: "Soft Green", label: "Calm & Fresh" },
  { id: "glass", version: 1, name: "Glass", label: "Glassmorphism" },
]

export type ReferrerSource = "Discord" | "Twitter" | "WhatsApp" | "Direct" | "Other"

export function parseReferrer(referrer: string | null | undefined): ReferrerSource {
  if (!referrer) return "Direct"
  if (referrer.includes("discord.com") || referrer.includes("discordapp.com")) return "Discord"
  if (referrer.includes("twitter.com") || referrer.includes("t.co") || referrer.includes("x.com")) return "Twitter"
  if (referrer.includes("wa.me") || referrer.includes("whatsapp.com")) return "WhatsApp"
  return "Other"
}

export interface SpotifyOEmbed {
  title: string
  author_name: string
  thumbnail_url: string
  html: string
}
