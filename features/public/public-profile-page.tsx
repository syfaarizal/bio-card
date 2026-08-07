"use client"

import { motion } from "motion/react"
import type { FullProfile } from "@/types"
import { getActiveSinceYear } from "@/lib/utils"
import { AtSign, PlayCircle, Music2, MapPin, Calendar, Star, ExternalLink } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Props {
  profile: FullProfile
}

// ── Theme maps ──────────────────────────────────────────────────────────────

const THEME_BG: Record<string, string> = {
  default: "bg-gray-100",
  midnight: "bg-[#070712]",
  rose: "bg-[#fce7e9]",
  cyber: "bg-[#010410]",
  glass: "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
}

const THEME_CARD: Record<string, string> = {
  default: "bg-white text-gray-900",
  midnight: "bg-[#0f0f1a] text-[#e2e8f0]",
  rose: "bg-[#fff1f2] text-[#1f1f1f]",
  cyber: "bg-[#020617] text-[#e2f8ff]",
  glass: "bg-white/70 backdrop-blur-xl text-[#1e1b4b]",
}

const THEME_SURFACE: Record<string, string> = {
  default: "bg-gray-50 border border-gray-200",
  midnight: "bg-[#1a1a2e] border border-[#2a2a45]",
  rose: "bg-[#ffe4e6] border border-[#fecdd3]",
  cyber: "bg-[#0c1524] border border-[#1e3a5f]",
  glass: "bg-white/50 border border-white/40 backdrop-blur-sm",
}

const THEME_TAG: Record<string, string> = {
  default: "bg-gray-900 text-white",
  midnight: "bg-[#6366f1] text-white",
  rose: "bg-[#be185d] text-white",
  cyber: "bg-[#22d3ee] text-[#020617]",
  glass: "bg-[#7c3aed] text-white",
}

const THEME_MUTED: Record<string, string> = {
  default: "text-gray-400",
  midnight: "text-[#64748b]",
  rose: "text-[#9f9f9f]",
  cyber: "text-[#4a6a8a]",
  glass: "text-[#6b7280]",
}

const THEME_DIVIDER: Record<string, string> = {
  default: "border-gray-100",
  midnight: "border-[#1e1e30]",
  rose: "border-[#fecdd3]",
  cyber: "border-[#0c1524]",
  glass: "border-white/20",
}

// ── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1 },
}

// ── Component ────────────────────────────────────────────────────────────────

export function PublicProfilePage({ profile }: Props) {
  const themeId = profile.themeId ?? "default"
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
    <div className={cn("min-h-screen transition-colors duration-300", THEME_BG[themeId])}>
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">

        {/* ── Main card ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className={cn("rounded-3xl overflow-hidden shadow-xl", THEME_CARD[themeId])}
        >
          {/* Header strip — photo + identity */}
          <motion.div variants={fadeUp} className="relative p-6 pb-0">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <motion.div
                variants={scaleIn}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg"
              >
                {mainPhoto ? (
                  <Image
                    src={mainPhoto.url}
                    alt={profile.displayName ?? profile.slug}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className={cn("w-full h-full flex items-center justify-center", THEME_SURFACE[themeId])}>
                    <span className={cn("text-4xl font-black opacity-20", THEME_MUTED[themeId])}>
                      {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Identity text */}
              <div className="flex-1 min-w-0 pt-1">
                <motion.p
                  variants={fadeUp}
                  className={cn("text-[10px] font-semibold tracking-widest uppercase mb-1", THEME_MUTED[themeId])}
                >
                  {profile.slug}
                </motion.p>
                <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  {profile.displayName || profile.slug}
                </motion.h1>
                {profile.bio && (
                  <motion.p variants={fadeUp} className={cn("text-sm mt-1.5", THEME_MUTED[themeId])}>
                    {profile.bio}
                  </motion.p>
                )}
                {profile.location && (
                  <motion.div variants={fadeUp} className={cn("flex items-center gap-1.5 mt-2 text-xs", THEME_MUTED[themeId])}>
                    <MapPin className="w-3 h-3" />
                    <span>{profile.location}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tags */}
            {profile.tags && profile.tags.length > 0 && (
              <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5 mt-4">
                {profile.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className={cn("text-xs font-medium px-3 py-1 rounded-full", THEME_TAG[themeId])}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <motion.div variants={fadeUp} className="flex gap-2 mt-4">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-110 active:scale-95",
                      THEME_SURFACE[themeId]
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className={cn("mx-6 my-5 border-t", THEME_DIVIDER[themeId])} />

          {/* ── Info grid ── */}
          <motion.div variants={stagger} className="px-6 pb-6 grid grid-cols-2 md:grid-cols-3 gap-3">

            {/* Birthday */}
            {profile.birthday && (
              <motion.div variants={fadeUp} className={cn("rounded-2xl p-4", THEME_SURFACE[themeId])}>
                <div className={cn("flex items-center gap-1.5 mb-2 text-[10px] font-semibold uppercase tracking-wider", THEME_MUTED[themeId])}>
                  <Calendar className="w-3 h-3" />
                  Birthday
                </div>
                <p className="text-2xl font-black leading-none">
                  {new Date(profile.birthday).getDate()}
                </p>
                <p className={cn("text-xs mt-0.5", THEME_MUTED[themeId])}>
                  {new Date(profile.birthday).toLocaleString("en-US", { month: "long" })}{" "}
                  {new Date(profile.birthday).getFullYear()}
                </p>
              </motion.div>
            )}

            {/* Active Since */}
            <motion.div variants={fadeUp} className={cn("rounded-2xl p-4", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>
                Active Since
              </p>
              <p className="text-2xl font-black leading-none">{activeSince}</p>
              <div className="flex gap-1 mt-2">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", THEME_MUTED[themeId])} fill="currentColor" />
                ))}
              </div>
            </motion.div>

            {/* Gallery / Secondary photo */}
            {secondaryPhoto && (
              <motion.div variants={scaleIn} className={cn("rounded-2xl overflow-hidden col-span-2 md:col-span-1", THEME_SURFACE[themeId])}>
                <div className="relative w-full h-32">
                  <Image src={secondaryPhoto.url} alt="Gallery" fill className="object-cover" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── Now Playing ── */}
          {profile.music?.songTitle && (
            <>
              <motion.div variants={fadeUp} className={cn("mx-6 border-t", THEME_DIVIDER[themeId])} />
              <motion.div variants={fadeUp} className="px-6 py-5">
                <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-3", THEME_MUTED[themeId])}>
                  Now Playing
                </p>
                <div className="flex items-center gap-3">
                  {profile.music.albumArt && (
                    <motion.div
                      variants={scaleIn}
                      className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md"
                    >
                      <Image src={profile.music.albumArt} alt="Album art" fill className="object-cover" />
                    </motion.div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{profile.music.songTitle}</p>
                    <p className={cn("text-xs truncate mt-0.5", THEME_MUTED[themeId])}>
                      {profile.music.artistName}
                    </p>
                  </div>
                  {/* Animated bars */}
                  <div className="flex items-end gap-0.5 h-5 flex-shrink-0">
                    {[0.4, 0.7, 1, 0.6, 0.8].map((h, i) => (
                      <motion.div
                        key={i}
                        className={cn("w-1 rounded-full", THEME_TAG[themeId])}
                        animate={{ scaleY: [h, 1, h * 0.5, h] }}
                        transition={{ repeat: Infinity, duration: 1.2 + i * 0.15, ease: "easeInOut" }}
                        style={{ height: "100%", originY: 1, opacity: 0.8 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* ── Footer watermark ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80",
              THEME_MUTED[themeId]
            )}
          >
            Made with
            <span className="flex items-center gap-1 font-semibold">
              <span className="w-4 h-4 rounded bg-gray-900 flex items-center justify-center">
                <span className="text-white text-[8px] font-black">B</span>
              </span>
              BioCard
            </span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
