import {
  MessageCircle,
  Globe,
  ExternalLink,
  Gamepad2,
  Store,
  type LucideIcon,
} from "lucide-react"

export type ProviderId =
  | "instagram"
  | "tiktok"
  | "x"
  | "youtube"
  | "discord"
  | "github"
  | "spotify"
  | "twitch"
  | "linkedin"
  | "telegram"
  | "whatsapp"
  | "portfolio"
  | "custom"

// Provider configuration - icons will be rendered via BrandIcon component
export interface ProviderConfig {
  id: ProviderId
  label: string
  patterns: string[]
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    patterns: ["instagram.com", "www.instagram.com", "instagr.am"],
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    patterns: ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"],
  },
  x: {
    id: "x",
    label: "X",
    patterns: ["x.com", "twitter.com", "www.twitter.com", "www.x.com", "t.co"],
  },
  youtube: {
    id: "youtube",
    label: "YouTube",
    patterns: ["youtube.com", "www.youtube.com", "youtu.be", "youtube.co"],
  },
  discord: {
    id: "discord",
    label: "Discord",
    patterns: ["discord.com", "www.discord.com", "discord.gg", "discordapp.com"],
  },
  github: {
    id: "github",
    label: "GitHub",
    patterns: ["github.com", "www.github.com", "gh.dev"],
  },
  spotify: {
    id: "spotify",
    label: "Spotify",
    patterns: ["spotify.com", "open.spotify.com", "spotify.link"],
  },
  twitch: {
    id: "twitch",
    label: "Twitch",
    patterns: ["twitch.tv", "www.twitch.tv"],
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    patterns: ["linkedin.com", "www.linkedin.com", "lnkd.in"],
  },
  telegram: {
    id: "telegram",
    label: "Telegram",
    patterns: ["t.me", "telegram.me", "telegram.org"],
  },
  whatsapp: {
    id: "whatsapp",
    label: "WhatsApp",
    patterns: ["wa.me", "whatsapp.com", "www.whatsapp.com"],
  },
  portfolio: {
    id: "portfolio",
    label: "Portfolio",
    patterns: [],
  },
  custom: {
    id: "custom",
    label: "Custom Link",
    patterns: [],
  },
}

// Fallback Lucide icons for when brand icons aren't available
export const FALLBACK_ICONS: Record<ProviderId, LucideIcon> = {
  instagram: MessageCircle,
  tiktok: Globe,
  x: ExternalLink,
  youtube: Globe,
  discord: MessageCircle,
  github: Globe,
  spotify: Globe,
  twitch: Globe,
  linkedin: Globe,
  telegram: MessageCircle,
  whatsapp: MessageCircle,
  portfolio: Globe,
  custom: ExternalLink,
}

export const POPULAR_PROVIDERS: ProviderId[] = [
  "instagram",
  "tiktok",
  "x",
  "youtube",
  "discord",
  "github",
  "spotify",
  "twitch",
]
