"use client"

import { motion } from "motion/react"
import type { FullProfile } from "@/types"
import { getActiveSinceYear } from "@/lib/utils"
import { AtSign, PlayCircle, Music2, MapPin, Calendar, Zap, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { DecorationOverlay, type DecorationId } from "@/components/shared/avatar-decoration"

interface Props {
  profile: FullProfile
}

// ── Theme system ─────────────────────────────────────────────────────────────

const THEME_CONFIG: Record<string, {
  bg: string; card: string; surface: string; surfaceBorder: string
  tag: string; tagBorder: string; tagText: string; muted: string; accent: string
  glow: string; ring: string; socialBg: string; socialBorder: string
  progressTrack: string; progressFill: string; eqColor: string; bannerFallback: string
}> = {
  default: {
    bg: "bg-gray-100", card: "bg-white text-gray-900", surface: "bg-gray-50",
    surfaceBorder: "border-gray-200", tag: "bg-gray-900", tagBorder: "border-gray-700",
    tagText: "text-white", muted: "text-gray-400", accent: "text-gray-900",
    glow: "shadow-gray-400/40", ring: "ring-gray-300", socialBg: "bg-gray-100",
    socialBorder: "border-gray-200", progressTrack: "bg-gray-200", progressFill: "bg-gray-900",
    eqColor: "bg-gray-700", bannerFallback: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100",
  },
  midnight: {
    bg: "bg-[#07070f]", card: "bg-[#0f0f1a] text-[#e2e8f0]", surface: "bg-[#16162a]",
    surfaceBorder: "border-[#2a2a45]", tag: "bg-[#1e1e38]", tagBorder: "border-[#4a4a7a]",
    tagText: "text-[#a5b4fc]", muted: "text-[#64748b]", accent: "text-[#a5b4fc]",
    glow: "shadow-indigo-500/40", ring: "ring-[#6366f1]", socialBg: "bg-[#1a1a2e]",
    socialBorder: "border-[#2a2a45]", progressTrack: "bg-[#1a1a2e]", progressFill: "bg-[#6366f1]",
    eqColor: "bg-[#818cf8]", bannerFallback: "bg-gradient-to-br from-[#1a1a3e] via-[#2d1b69] to-[#0f0f1a]",
  },
  rose: {
    bg: "bg-[#fce7e9]", card: "bg-[#fff1f2] text-[#1f1f1f]", surface: "bg-[#ffe4e6]",
    surfaceBorder: "border-[#fecdd3]", tag: "bg-[#fce7f3]", tagBorder: "border-[#fbcfe8]",
    tagText: "text-[#be185d]", muted: "text-[#9f9f9f]", accent: "text-[#be185d]",
    glow: "shadow-pink-400/40", ring: "ring-[#f43f5e]", socialBg: "bg-[#ffe4e6]",
    socialBorder: "border-[#fecdd3]", progressTrack: "bg-[#fecdd3]", progressFill: "bg-[#be185d]",
    eqColor: "bg-[#be185d]", bannerFallback: "bg-gradient-to-br from-[#fce7f3] via-[#fda4af] to-[#fff1f2]",
  },
  cyber: {
    bg: "bg-[#010410]", card: "bg-[#020617] text-[#e2f8ff]", surface: "bg-[#0c1524]",
    surfaceBorder: "border-[#1e3a5f]", tag: "bg-[#0c1e35]", tagBorder: "border-[#164e73]",
    tagText: "text-[#22d3ee]", muted: "text-[#4a6a8a]", accent: "text-[#22d3ee]",
    glow: "shadow-cyan-500/40", ring: "ring-[#22d3ee]", socialBg: "bg-[#0c1524]",
    socialBorder: "border-[#1e3a5f]", progressTrack: "bg-[#0c1524]", progressFill: "bg-[#22d3ee]",
    eqColor: "bg-[#06b6d4]", bannerFallback: "bg-gradient-to-br from-[#020617] via-[#0c1e35] to-[#020617]",
  },
  glass: {
    bg: "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
    card: "bg-white/80 text-[#1e1b4b] backdrop-blur-xl", surface: "bg-white/50",
    surfaceBorder: "border-white/40", tag: "bg-[#ede9fe]", tagBorder: "border-[#ddd6fe]",
    tagText: "text-[#7c3aed]", muted: "text-[#6b7280]", accent: "text-[#7c3aed]",
    glow: "shadow-violet-400/40", ring: "ring-[#7c3aed]", socialBg: "bg-white/60",
    socialBorder: "border-white/40", progressTrack: "bg-violet-100", progressFill: "bg-[#7c3aed]",
    eqColor: "bg-[#7c3aed]", bannerFallback: "bg-gradient-to-br from-[#ddd6fe] via-[#c4b5fd] to-[#ede9fe]",
  },
}

const RING_GRADIENTS: Record<string, string> = {
  default: "linear-gradient(135deg, #374151, #6b7280, #374151)",
  midnight: "linear-gradient(135deg, #6366f1, #a855f7, #6366f1)",
  rose: "linear-gradient(135deg, #f43f5e, #ec4899, #f43f5e)",
  cyber: "linear-gradient(135deg, #22d3ee, #0ea5e9, #22d3ee)",
  glass: "linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed)",
}

const TAG_ICONS: Record<string, string> = {
  creator: "✏️", developer: "</>", "front-end": "🖥", frontend: "🖥",
  designer: "🎨", gamer: "🎮", anime: "⛩", streamer: "📡",
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, show: { opacity: 1, scale: 1 } }

// ── Component ────────────────────────────────────────────────────────────────

export function PublicProfilePage({ profile }: Props) {
  const themeId = profile.themeId ?? "default"
  const t = THEME_CONFIG[themeId] ?? THEME_CONFIG.default

  type Img = { type: string; url: string }
  const getImg = (type: string) => profile.images?.find((img: Img) => img.type === type)

  const profilePhoto = getImg("PROFILE")
  const bannerPhoto  = getImg("BANNER")
  const gallery1     = getImg("GALLERY_1")
  const gallery2     = getImg("GALLERY_2")
  const gallery3     = getImg("GALLERY_3")
  const gallerySlots = [gallery1, gallery2, gallery3].filter(Boolean)

  const activeSince = getActiveSinceYear(profile.createdAt)
  const decoration = (profile.profileEffect ?? "none") as DecorationId

  const socialLinks = [
    { href: profile.links?.instagram, icon: AtSign, label: "Instagram" },
    { href: profile.links?.tiktok,    icon: Music2,     label: "TikTok" },
    { href: profile.links?.twitter,   icon: AtSign,     label: "Twitter" },
    { href: profile.links?.youtube,   icon: PlayCircle, label: "YouTube" },
  ].filter((l) => Boolean(l.href))

  return (
    <div className={cn("min-h-screen transition-colors duration-300", t.bg)}>
      <div className="max-w-lg mx-auto px-4 py-8 md:py-14">
        <motion.div variants={stagger} initial="hidden" animate="show"
          className={cn("rounded-3xl overflow-hidden shadow-2xl", t.card)}>

          {/* ── BANNER ── */}
          <motion.div variants={scaleIn} className="relative w-full h-44 md:h-52 overflow-hidden">
            {bannerPhoto ? (
              <Image src={bannerPhoto.url} alt="Banner" fill className="object-cover" priority />
            ) : (
              <div className={cn("w-full h-full", t.bannerFallback)} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
          </motion.div>

          {/* ── AVATAR (overlaps banner) ── */}
          <div className="relative px-6">
            <motion.div variants={scaleIn}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="absolute -top-14 left-6">
              {/* Relative container for decoration overlay */}
              <div className="relative w-[104px] h-[104px]">
                {/* Glow ring */}
                <div
                  className={cn("relative w-full h-full rounded-full p-[3px] ring-4 shadow-2xl", t.ring, t.glow)}
                  style={{ background: RING_GRADIENTS[themeId] ?? RING_GRADIENTS.default }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                    {profilePhoto ? (
                      <Image src={profilePhoto.url} alt={profile.displayName ?? profile.slug} fill className="object-cover rounded-full" />
                    ) : (
                      <div className={cn("w-full h-full flex items-center justify-center", t.surface)}>
                        <span className={cn("text-3xl font-black", t.muted)}>
                          {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Avatar decoration overlay */}
                <DecorationOverlay id={decoration} size={104} />
                {/* Online dot */}
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-lg z-10" />
              </div>
            </motion.div>
            <div className="h-16" />
          </div>

          {/* ── IDENTITY ── */}
          <motion.div variants={stagger} className="px-6 pb-2 text-center">
            <motion.p variants={fadeUp} className={cn("text-xs font-semibold tracking-[0.25em] uppercase mb-1", t.accent)}>
              · {profile.slug} ·
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-black tracking-tight">
                {profile.displayName || profile.slug}
              </h1>
              {profile.verifiedBadge && (
                <BadgeCheck className={cn("w-6 h-6 flex-shrink-0", t.accent)} fill="currentColor" />
              )}
            </motion.div>
            {profile.bio && (
              <motion.p variants={fadeUp} className={cn("text-sm mt-1", t.muted)}>{profile.bio}</motion.p>
            )}
            {profile.location && (
              <motion.div variants={fadeUp} className={cn("flex items-center justify-center gap-1.5 mt-2 text-xs", t.muted)}>
                <MapPin className="w-3 h-3" />{profile.location}
              </motion.div>
            )}
          </motion.div>

          {/* ── TAGS ── */}
          {profile.tags && profile.tags.length > 0 && (
            <motion.div variants={fadeUp} className="px-6 py-3 flex flex-wrap justify-center gap-2">
              {profile.tags.map((tag: string) => (
                <span key={tag} className={cn("flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border", t.tag, t.tagBorder, t.tagText)}>
                  {TAG_ICONS[tag.toLowerCase()] && <span className="text-[10px]">{TAG_ICONS[tag.toLowerCase()]}</span>}
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* ── SOCIAL LINKS ── */}
          {socialLinks.length > 0 && (
            <motion.div variants={fadeUp} className="px-6 pb-5 flex justify-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href!} target="_blank" rel="noopener noreferrer" title={label}
                  className={cn("flex items-center justify-center w-11 h-11 rounded-full border transition-all hover:scale-110 active:scale-95", t.socialBg, t.socialBorder)}>
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
                      <Calendar className="w-3 h-3" />Birthday
                    </div>
                    <p className="text-3xl font-black leading-none">{new Date(profile.birthday).getUTCDate()}</p>
                    <p className={cn("text-sm mt-1", t.muted)}>
                      {new Date(profile.birthday).toLocaleString("en-US", { month: "long", timeZone: "UTC" })}{" "}
                      {new Date(profile.birthday).getUTCFullYear()}
                    </p>
                  </div>
                )}
                <div className={profile.birthday ? cn("border-l pl-4", t.surfaceBorder) : ""}>
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-2", t.muted)}>
                    <Zap className="w-3 h-3" />Active Since
                  </div>
                  <p className="text-3xl font-black leading-none">{activeSince}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(3)].map((_, i) => <span key={i} className={cn("text-sm", t.accent)}>★</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GALLERY (3 slots) ── */}
          {gallerySlots.length > 0 && (
            <motion.div variants={fadeUp} className="px-4 pb-4">
              <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2 px-1", t.muted)}>Gallery</p>
              <div className={cn(
                "grid gap-2",
                gallerySlots.length === 1 ? "grid-cols-1"
                : gallerySlots.length === 2 ? "grid-cols-2"
                : "grid-cols-3"
              )}>
                {gallerySlots.map((img, i) => img && (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image src={img.url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
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
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", t.accent)}>Now Playing</span>
                    <div className="flex items-end gap-px h-3">
                      {[0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8].map((h, i) => (
                        <motion.div key={i} className={cn("w-0.5 rounded-full", t.eqColor)}
                          animate={{ scaleY: [h, 1, h * 0.4, h * 0.8, h] }}
                          transition={{ repeat: Infinity, duration: 1 + i * 0.12, ease: "easeInOut" }}
                          style={{ height: "100%", originY: 1 }} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="flex gap-3 items-center">
                  {profile.music.albumArt && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <Image src={profile.music.albumArt} alt="Album" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate uppercase tracking-wide">{profile.music.songTitle}</p>
                    <p className={cn("text-xs mt-0.5", t.muted)}>{profile.music.artistName}</p>
                    <p className={cn("text-[10px] mt-0.5", t.muted)}>Spotify</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="px-4 pb-5">
              <div className={cn("rounded-2xl border border-dashed p-4 text-center", t.surface, t.surfaceBorder)}>
                <p className={cn("text-xs", t.muted)}>Paste a Spotify URL to show what you&apos;re listening to.</p>
              </div>
            </motion.div>
          )}

          {/* ── FOOTER ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className={cn("px-6 py-4 border-t text-center", t.surfaceBorder)}>
            <Link href="/" className={cn("inline-flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity", t.muted)}>
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
