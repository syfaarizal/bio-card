"use client"

import { motion } from "motion/react"
import type { FullProfile } from "@/types"
import { getActiveSinceYear } from "@/lib/utils"
import { AtSign, PlayCircle, Music2, MapPin, Calendar, Zap, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Props {
  profile: FullProfile
}

// ── Theme system ─────────────────────────────────────────────────────────────

const THEME_CONFIG: Record<string, {
  bg: string
  card: string
  surface: string
  surfaceBorder: string
  tag: string
  tagBorder: string
  tagText: string
  muted: string
  accent: string
  glow: string
  ring: string
  socialBg: string
  socialBorder: string
  progressTrack: string
  progressFill: string
  eqColor: string
}> = {
  default: {
    bg: "bg-gray-100",
    card: "bg-white text-gray-900",
    surface: "bg-gray-50",
    surfaceBorder: "border-gray-200",
    tag: "bg-gray-900",
    tagBorder: "border-gray-700",
    tagText: "text-white",
    muted: "text-gray-400",
    accent: "text-gray-900",
    glow: "shadow-gray-400/40",
    ring: "ring-gray-300",
    socialBg: "bg-gray-100",
    socialBorder: "border-gray-200",
    progressTrack: "bg-gray-200",
    progressFill: "bg-gray-900",
    eqColor: "bg-gray-700",
  },
  midnight: {
    bg: "bg-[#07070f]",
    card: "bg-[#0f0f1a] text-[#e2e8f0]",
    surface: "bg-[#16162a]",
    surfaceBorder: "border-[#2a2a45]",
    tag: "bg-[#1e1e38]",
    tagBorder: "border-[#4a4a7a]",
    tagText: "text-[#a5b4fc]",
    muted: "text-[#64748b]",
    accent: "text-[#a5b4fc]",
    glow: "shadow-indigo-500/40",
    ring: "ring-[#6366f1]",
    socialBg: "bg-[#1a1a2e]",
    socialBorder: "border-[#2a2a45]",
    progressTrack: "bg-[#1a1a2e]",
    progressFill: "bg-[#6366f1]",
    eqColor: "bg-[#818cf8]",
  },
  rose: {
    bg: "bg-[#fce7e9]",
    card: "bg-[#fff1f2] text-[#1f1f1f]",
    surface: "bg-[#ffe4e6]",
    surfaceBorder: "border-[#fecdd3]",
    tag: "bg-[#fce7f3]",
    tagBorder: "border-[#fbcfe8]",
    tagText: "text-[#be185d]",
    muted: "text-[#9f9f9f]",
    accent: "text-[#be185d]",
    glow: "shadow-pink-400/40",
    ring: "ring-[#f43f5e]",
    socialBg: "bg-[#ffe4e6]",
    socialBorder: "border-[#fecdd3]",
    progressTrack: "bg-[#fecdd3]",
    progressFill: "bg-[#be185d]",
    eqColor: "bg-[#be185d]",
  },
  cyber: {
    bg: "bg-[#010410]",
    card: "bg-[#020617] text-[#e2f8ff]",
    surface: "bg-[#0c1524]",
    surfaceBorder: "border-[#1e3a5f]",
    tag: "bg-[#0c1e35]",
    tagBorder: "border-[#164e73]",
    tagText: "text-[#22d3ee]",
    muted: "text-[#4a6a8a]",
    accent: "text-[#22d3ee]",
    glow: "shadow-cyan-500/40",
    ring: "ring-[#22d3ee]",
    socialBg: "bg-[#0c1524]",
    socialBorder: "border-[#1e3a5f]",
    progressTrack: "bg-[#0c1524]",
    progressFill: "bg-[#22d3ee]",
    eqColor: "bg-[#06b6d4]",
  },
  glass: {
    bg: "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
    card: "bg-white/80 text-[#1e1b4b] backdrop-blur-xl",
    surface: "bg-white/50",
    surfaceBorder: "border-white/40",
    tag: "bg-[#ede9fe]",
    tagBorder: "border-[#ddd6fe]",
    tagText: "text-[#7c3aed]",
    muted: "text-[#6b7280]",
    accent: "text-[#7c3aed]",
    glow: "shadow-violet-400/40",
    ring: "ring-[#7c3aed]",
    socialBg: "bg-white/60",
    socialBorder: "border-white/40",
    progressTrack: "bg-violet-100",
    progressFill: "bg-[#7c3aed]",
    eqColor: "bg-[#7c3aed]",
  },
}

// Tag icons — map common tag text to lucide icon
const TAG_ICONS: Record<string, React.ReactNode> = {
  creator: <span className="text-[10px]">✏️</span>,
  developer: <span className="text-[10px]">&lt;/&gt;</span>,
  "front-end": <span className="text-[10px]">🖥</span>,
  frontend: <span className="text-[10px]">🖥</span>,
  designer: <span className="text-[10px]">🎨</span>,
  gamer: <span className="text-[10px]">🎮</span>,
  anime: <span className="text-[10px]">⛩</span>,
  streamer: <span className="text-[10px]">📡</span>,
}

function getTagIcon(tag: string) {
  return TAG_ICONS[tag.toLowerCase()] ?? null
}

// Animation variants
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, show: { opacity: 1, scale: 1 } }

// ── Component ────────────────────────────────────────────────────────────────

export function PublicProfilePage({ profile }: Props) {
  const themeId = profile.themeId ?? "default"
  const t = THEME_CONFIG[themeId] ?? THEME_CONFIG.default

  const mainPhoto = profile.images?.find((img: { type: string; url: string }) => img.type === "MAIN")
  const secondaryPhoto = profile.images?.find((img: { type: string; url: string }) => img.type === "SECONDARY")
  const activeSince = getActiveSinceYear(profile.createdAt)

  const socialLinks = [
    { href: profile.links?.instagram, icon: AtSign, label: "Instagram" },
    { href: profile.links?.tiktok, icon: Music2, label: "TikTok" },
    { href: profile.links?.twitter, icon: AtSign, label: "Twitter" },
    { href: profile.links?.youtube, icon: PlayCircle, label: "YouTube" },
  ].filter((l) => Boolean(l.href))

  return (
    <div className={cn("min-h-screen transition-colors duration-300", t.bg)}>
      <div className="max-w-lg mx-auto px-4 py-8 md:py-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className={cn("rounded-3xl overflow-hidden shadow-2xl", t.card)}
        >

          {/* ── BANNER ── */}
          <motion.div variants={scaleIn} className="relative w-full h-44 md:h-52 overflow-hidden">
            {secondaryPhoto ? (
              <Image
                src={secondaryPhoto.url}
                alt="Banner"
                fill
                className="object-cover"
                priority
              />
            ) : (
              // Fallback gradient banner — no transparency, solid and intentional
              <div className={cn(
                "w-full h-full",
                themeId === "midnight" && "bg-gradient-to-br from-[#1a1a3e] via-[#2d1b69] to-[#0f0f1a]",
                themeId === "cyber" && "bg-gradient-to-br from-[#020617] via-[#0c1e35] to-[#020617]",
                themeId === "rose" && "bg-gradient-to-br from-[#fce7f3] via-[#fda4af] to-[#fff1f2]",
                themeId === "glass" && "bg-gradient-to-br from-[#ddd6fe] via-[#c4b5fd] to-[#ede9fe]",
                themeId === "default" && "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100",
              )} />
            )}
            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
          </motion.div>

          {/* ── AVATAR overlapping banner ── */}
          <div className="relative px-6">
            <motion.div
              variants={scaleIn}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="absolute -top-14 left-6"
            >
              {/* Glow ring */}
              <div className={cn(
                "relative w-[104px] h-[104px] rounded-full p-[3px]",
                "ring-4 shadow-2xl",
                t.ring, t.glow
              )}
                style={{
                  background: themeId === "midnight"
                    ? "linear-gradient(135deg, #6366f1, #a855f7, #6366f1)"
                    : themeId === "cyber"
                    ? "linear-gradient(135deg, #22d3ee, #0ea5e9, #22d3ee)"
                    : themeId === "rose"
                    ? "linear-gradient(135deg, #f43f5e, #ec4899, #f43f5e)"
                    : themeId === "glass"
                    ? "linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed)"
                    : "linear-gradient(135deg, #374151, #6b7280, #374151)",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                  {mainPhoto ? (
                    <Image src={mainPhoto.url} alt={profile.displayName ?? profile.slug} fill className="object-cover rounded-full" />
                  ) : (
                    <div className={cn("w-full h-full flex items-center justify-center", t.surface)}>
                      <span className={cn("text-3xl font-black", t.muted)}>
                        {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Online dot */}
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
            </motion.div>

            {/* Spacer for avatar overlap */}
            <div className="h-16" />
          </div>

          {/* ── IDENTITY ── */}
          <motion.div variants={stagger} className="px-6 pb-2 text-center">
            {/* Slug */}
            <motion.p variants={fadeUp} className={cn("text-xs font-semibold tracking-[0.25em] uppercase mb-1", t.accent)}>
              · {profile.slug} ·
            </motion.p>

            {/* Display name + badge */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-black tracking-tight">
                {profile.displayName || profile.slug}
              </h1>
              <BadgeCheck className={cn("w-6 h-6 flex-shrink-0", t.accent)} fill="currentColor" />
            </motion.div>

            {/* Bio */}
            {profile.bio && (
              <motion.p variants={fadeUp} className={cn("text-sm mt-1", t.muted)}>
                {profile.bio}
              </motion.p>
            )}

            {/* Location */}
            {profile.location && (
              <motion.div variants={fadeUp} className={cn("flex items-center justify-center gap-1.5 mt-2 text-xs", t.muted)}>
                <MapPin className="w-3 h-3" />
                {profile.location}
              </motion.div>
            )}
          </motion.div>

          {/* ── TAGS ── */}
          {profile.tags && profile.tags.length > 0 && (
            <motion.div variants={fadeUp} className="px-6 py-4 flex flex-wrap justify-center gap-2">
              {profile.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border",
                    t.tag, t.tagBorder, t.tagText
                  )}
                >
                  {getTagIcon(tag)}
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* ── SOCIAL LINKS ── */}
          {socialLinks.length > 0 && (
            <motion.div variants={fadeUp} className="px-6 pb-5 flex justify-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-full border transition-all hover:scale-110 active:scale-95",
                    t.socialBg, t.socialBorder
                  )}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          )}

          {/* ── BIRTHDAY + ACTIVE SINCE ── */}
          {(profile.birthday || activeSince) && (
            <motion.div variants={fadeUp} className="px-4 pb-4">
              <div className={cn("rounded-2xl border p-4 grid grid-cols-2 gap-4", t.surface, t.surfaceBorder)}>
                {profile.birthday && (
                  <div>
                    <div className={cn("flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-2", t.muted)}>
                      <Calendar className="w-3 h-3" />
                      Birthday
                    </div>
                    <p className="text-3xl font-black leading-none">
                      {new Date(profile.birthday).getUTCDate()}
                    </p>
                    <p className={cn("text-sm mt-1", t.muted)}>
                      {new Date(profile.birthday).toLocaleString("en-US", { month: "long", timeZone: "UTC" })}{" "}
                      {new Date(profile.birthday).getUTCFullYear()}
                    </p>
                  </div>
                )}
                <div className={profile.birthday ? "border-l pl-4 " + t.surfaceBorder : ""}>
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-2", t.muted)}>
                    <Zap className="w-3 h-3" />
                    Active Since
                  </div>
                  <p className="text-3xl font-black leading-none">{activeSince}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={cn("text-sm", t.accent)}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GALLERY (secondary photo as banner gallery) ── */}
          {secondaryPhoto && (
            <motion.div variants={scaleIn} className="px-4 pb-4">
              <div className="relative w-full h-44 rounded-2xl overflow-hidden">
                <Image
                  src={secondaryPhoto.url}
                  alt="Gallery"
                  fill
                  className="object-cover"
                />
                {/* Counter badge */}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  1/1
                </div>
              </div>
              {/* Pagination dots */}
              <div className="flex justify-center gap-1.5 mt-3">
                <div className={cn("w-2 h-2 rounded-full", t.accent, "opacity-40 bg-current")} />
                <div className={cn("w-2 h-2 rounded-full", t.accent, "bg-current")} />
                <div className={cn("w-2 h-2 rounded-full", t.accent, "opacity-40 bg-current")} />
              </div>
            </motion.div>
          )}

          {/* ── NOW PLAYING ── */}
          {profile.music?.songTitle ? (
            <motion.div variants={fadeUp} className="px-4 pb-5">
              <div className={cn("rounded-2xl border p-4", t.surface, t.surfaceBorder)}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", t.accent)}>
                      Now Playing
                    </span>
                    {/* Animated eq bars */}
                    <div className="flex items-end gap-px h-3">
                      {[0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8].map((h, i) => (
                        <motion.div
                          key={i}
                          className={cn("w-0.5 rounded-full", t.eqColor)}
                          animate={{ scaleY: [h, 1, h * 0.4, h * 0.8, h] }}
                          transition={{ repeat: Infinity, duration: 1 + i * 0.12, ease: "easeInOut" }}
                          style={{ height: "100%", originY: 1 }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Eq icon right */}
                  <div className="flex items-end gap-px h-4">
                    {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
                      <motion.div
                        key={i}
                        className={cn("w-1 rounded-sm", t.eqColor, "opacity-60")}
                        animate={{ scaleY: [h, 1, h * 0.5, h] }}
                        transition={{ repeat: Infinity, duration: 0.9 + i * 0.15, ease: "easeInOut" }}
                        style={{ height: "100%", originY: 1 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Content row */}
                <div className="flex gap-3 items-center">
                  {profile.music.albumArt && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <Image src={profile.music.albumArt} alt="Album" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate uppercase tracking-wide">
                      {profile.music.songTitle}
                    </p>
                    <p className={cn("text-xs mt-0.5", t.muted)}>Spotify</p>
                    {/* Fake timestamp */}
                    <p className={cn("text-xs mt-1", t.muted)}>1:24 / 4:03</p>
                  </div>
                </div>

                {/* Fake progress bar */}
                <div className="mt-3">
                  <div className={cn("w-full h-1 rounded-full relative", t.progressTrack)}>
                    <div
                      className={cn("h-full rounded-full", t.progressFill)}
                      style={{ width: "34%" }}
                    />
                    {/* Scrubber dot */}
                    <div
                      className={cn("absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-md border-2 border-white", t.progressFill)}
                      style={{ left: "calc(34% - 6px)" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="px-4 pb-5">
              <div className={cn(
                "rounded-2xl border border-dashed p-4 text-center",
                t.surface, t.surfaceBorder
              )}>
                <p className={cn("text-xs", t.muted)}>Paste a Spotify URL to show what you&apos;re listening to.</p>
              </div>
            </motion.div>
          )}

          {/* ── FOOTER ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("px-6 py-4 border-t text-center", t.surfaceBorder)}
          >
            <Link
              href="/"
              className={cn("inline-flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity", t.muted)}
            >
              Made with
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-4 h-4 rounded bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">B</span>
                </span>
                BioCard
              </span>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
