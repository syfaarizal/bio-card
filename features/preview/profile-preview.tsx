"use client"

import type { FullProfile } from "@/types"
import type { DeviceMode } from "@/components/shared/device-switcher"
import { getActiveSinceYear } from "@/lib/utils"
import { AtSign, PlayCircle, Music2, MapPin, Calendar, Zap, BadgeCheck } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { DecorationOverlay, type DecorationId } from "@/components/shared/avatar-decoration"

interface Props {
  profile: FullProfile
  deviceMode?: DeviceMode
}

const THEME_CONFIG: Record<string, {
  bg: string; card: string; surface: string; surfaceBorder: string
  tag: string; tagBorder: string; tagText: string; muted: string; accent: string
  glow: string; ring: string; socialBg: string; socialBorder: string
  progressFill: string; eqColor: string; bannerFallback: string
}> = {
  default: {
    bg: "bg-gray-100", card: "bg-white text-gray-900", surface: "bg-gray-50",
    surfaceBorder: "border-gray-200", tag: "bg-gray-900", tagBorder: "border-gray-700",
    tagText: "text-white", muted: "text-gray-400", accent: "text-gray-900",
    glow: "shadow-gray-400/30", ring: "ring-gray-300", socialBg: "bg-gray-100",
    socialBorder: "border-gray-200", progressFill: "bg-gray-900",
    eqColor: "bg-gray-700", bannerFallback: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100",
  },
  midnight: {
    bg: "bg-[#07070f]", card: "bg-[#0f0f1a] text-[#e2e8f0]", surface: "bg-[#16162a]",
    surfaceBorder: "border-[#2a2a45]", tag: "bg-[#1e1e38]", tagBorder: "border-[#4a4a7a]",
    tagText: "text-[#a5b4fc]", muted: "text-[#64748b]", accent: "text-[#a5b4fc]",
    glow: "shadow-indigo-500/30", ring: "ring-[#6366f1]", socialBg: "bg-[#1a1a2e]",
    socialBorder: "border-[#2a2a45]", progressFill: "bg-[#6366f1]",
    eqColor: "bg-[#818cf8]", bannerFallback: "bg-gradient-to-br from-[#1a1a3e] via-[#2d1b69] to-[#0f0f1a]",
  },
  rose: {
    bg: "bg-[#fce7e9]", card: "bg-[#fff1f2] text-[#1f1f1f]", surface: "bg-[#ffe4e6]",
    surfaceBorder: "border-[#fecdd3]", tag: "bg-[#fce7f3]", tagBorder: "border-[#fbcfe8]",
    tagText: "text-[#be185d]", muted: "text-[#9f9f9f]", accent: "text-[#be185d]",
    glow: "shadow-pink-400/30", ring: "ring-[#f43f5e]", socialBg: "bg-[#ffe4e6]",
    socialBorder: "border-[#fecdd3]", progressFill: "bg-[#be185d]",
    eqColor: "bg-[#be185d]", bannerFallback: "bg-gradient-to-br from-[#fce7f3] via-[#fda4af] to-[#fff1f2]",
  },
  cyber: {
    bg: "bg-[#010410]", card: "bg-[#020617] text-[#e2f8ff]", surface: "bg-[#0c1524]",
    surfaceBorder: "border-[#1e3a5f]", tag: "bg-[#0c1e35]", tagBorder: "border-[#164e73]",
    tagText: "text-[#22d3ee]", muted: "text-[#4a6a8a]", accent: "text-[#22d3ee]",
    glow: "shadow-cyan-500/30", ring: "ring-[#22d3ee]", socialBg: "bg-[#0c1524]",
    socialBorder: "border-[#1e3a5f]", progressFill: "bg-[#22d3ee]",
    eqColor: "bg-[#06b6d4]", bannerFallback: "bg-gradient-to-br from-[#020617] via-[#0c1e35] to-[#020617]",
  },
  glass: {
    bg: "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
    card: "bg-white/80 text-[#1e1b4b] backdrop-blur-xl", surface: "bg-white/50",
    surfaceBorder: "border-white/40", tag: "bg-[#ede9fe]", tagBorder: "border-[#ddd6fe]",
    tagText: "text-[#7c3aed]", muted: "text-[#6b7280]", accent: "text-[#7c3aed]",
    glow: "shadow-violet-400/30", ring: "ring-[#7c3aed]", socialBg: "bg-white/60",
    socialBorder: "border-white/40", progressFill: "bg-[#7c3aed]",
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

function ProfileCard({ profile, compact = false }: { profile: FullProfile; compact?: boolean }) {
  const themeId = profile.themeId ?? "default"
  const t = THEME_CONFIG[themeId] ?? THEME_CONFIG.default
  const decoration = (profile.profileEffect ?? "none") as DecorationId

  type Img = { type: string; url: string }
  const getImg = (type: string) => profile.images?.find((img: Img) => img.type === type)

  const profilePhoto = getImg("PROFILE")
  const bannerPhoto  = getImg("BANNER")
  const gallery1     = getImg("GALLERY_1")
  const gallery2     = getImg("GALLERY_2")
  const gallery3     = getImg("GALLERY_3")
  const gallerySlots = [gallery1, gallery2, gallery3].filter(Boolean)

  const activeSince = getActiveSinceYear(profile.createdAt)

  const socialLinks = [
    { href: profile.links?.instagram, icon: AtSign },
    { href: profile.links?.tiktok,    icon: Music2 },
    { href: profile.links?.twitter,   icon: AtSign },
    { href: profile.links?.youtube,   icon: PlayCircle },
  ].filter((l) => Boolean(l.href))

  const bannerH    = compact ? "h-24" : "h-32"
  const avatarSize = compact ? 72 : 88
  const avatarTop  = compact ? "-top-9 left-4" : "-top-12 left-5"
  const spacerH    = compact ? "h-8" : "h-12"
  const nameSize   = compact ? "text-xl" : "text-2xl"
  const px         = compact ? "px-4" : "px-5"

  return (
    <div className={cn("rounded-2xl overflow-hidden shadow-xl w-full", t.card)}>
      {/* Banner */}
      <div className={cn("relative w-full overflow-hidden", bannerH)}>
        {bannerPhoto ? (
          <Image src={bannerPhoto.url} alt="Banner" fill className="object-cover" />
        ) : (
          <div className={cn("w-full h-full", t.bannerFallback)} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      {/* Avatar */}
      <div className={cn("relative", px)}>
        <div className={cn("absolute", avatarTop)}>
          <div className="relative" style={{ width: avatarSize, height: avatarSize }}>
            <div
              className={cn("relative w-full h-full rounded-full p-[2.5px] ring-4 shadow-xl", t.ring, t.glow)}
              style={{ background: RING_GRADIENTS[themeId] ?? RING_GRADIENTS.default }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                {profilePhoto ? (
                  <Image src={profilePhoto.url} alt="Profile" fill className="object-cover rounded-full" />
                ) : (
                  <div className={cn("w-full h-full flex items-center justify-center", t.surface)}>
                    <span className={cn("font-black text-xl opacity-30", t.muted)}>
                      {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <DecorationOverlay id={decoration} size={avatarSize} />
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white z-10" />
          </div>
        </div>
        <div className={spacerH} />
      </div>

      {/* Identity */}
      <div className={cn("text-center pb-2", px)}>
        <p className={cn("text-[10px] font-semibold tracking-[0.2em] uppercase mb-0.5", t.accent)}>· {profile.slug} ·</p>
        <div className="flex items-center justify-center gap-1.5">
          <h2 className={cn("font-black tracking-tight", nameSize)}>
            {profile.displayName || <span className="opacity-30">Display Name</span>}
          </h2>
          {profile.verifiedBadge && (
            <BadgeCheck className={cn("w-5 h-5 flex-shrink-0", t.accent)} fill="currentColor" />
          )}
        </div>
        {profile.bio && <p className={cn("text-xs mt-1", t.muted)}>{profile.bio}</p>}
        {profile.location && (
          <div className={cn("flex items-center justify-center gap-1 mt-1.5 text-[11px]", t.muted)}>
            <MapPin className="w-2.5 h-2.5" />{profile.location}
          </div>
        )}
      </div>

      {/* Tags */}
      {profile.tags && profile.tags.length > 0 && (
        <div className={cn("flex flex-wrap justify-center gap-1.5 py-2", px)}>
          {profile.tags.map((tag: string) => (
            <span key={tag} className={cn("flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border", t.tag, t.tagBorder, t.tagText)}>
              {TAG_ICONS[tag.toLowerCase()] && <span className="text-[9px]">{TAG_ICONS[tag.toLowerCase()]}</span>}
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Social */}
      {socialLinks.length > 0 && (
        <div className={cn("flex justify-center gap-2 pb-3", px)}>
          {socialLinks.map(({ href, icon: Icon }, i) => (
            <span key={i} className={cn("flex items-center justify-center w-8 h-8 rounded-full border", t.socialBg, t.socialBorder)}>
              <Icon className="w-3.5 h-3.5" />
            </span>
          ))}
        </div>
      )}

      {/* Birthday + Active Since */}
      {(profile.birthday || activeSince) && (
        <div className={cn("pb-3", px)}>
          <div className={cn("rounded-xl border p-3 grid grid-cols-2 gap-3", t.surface, t.surfaceBorder)}>
            {profile.birthday && (
              <div>
                <div className={cn("flex items-center gap-1 text-[9px] uppercase tracking-wider mb-1", t.muted)}>
                  <Calendar className="w-2.5 h-2.5" />Birthday
                </div>
                <p className="text-2xl font-black leading-none">{new Date(profile.birthday).getUTCDate()}</p>
                <p className={cn("text-[10px] mt-0.5", t.muted)}>
                  {new Date(profile.birthday).toLocaleString("en-US", { month: "long", timeZone: "UTC" })}{" "}
                  {new Date(profile.birthday).getUTCFullYear()}
                </p>
              </div>
            )}
            <div className={profile.birthday ? cn("border-l pl-3", t.surfaceBorder) : ""}>
              <div className={cn("flex items-center gap-1 text-[9px] uppercase tracking-wider mb-1", t.muted)}>
                <Zap className="w-2.5 h-2.5" />Active Since
              </div>
              <p className="text-2xl font-black leading-none">{activeSince}</p>
              <div className="flex gap-0.5 mt-1">{[...Array(3)].map((_, i) => <span key={i} className={cn("text-xs", t.accent)}>★</span>)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {gallerySlots.length > 0 && (
        <div className={cn("pb-3", px)}>
          <p className={cn("text-[9px] font-semibold uppercase tracking-wider mb-1.5", t.muted)}>Gallery</p>
          <div className={cn("grid gap-1.5", gallerySlots.length === 1 ? "grid-cols-1" : gallerySlots.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {gallerySlots.map((img, i) => img && (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={img.url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Now Playing */}
      {profile.music?.songTitle ? (
        <div className={cn("pb-4", px)}>
          <div className={cn("rounded-xl border p-3", t.surface, t.surfaceBorder)}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", t.accent)}>Now Playing</span>
                <div className="flex items-end gap-px h-2.5">
                  {[0.5, 0.9, 0.6, 1, 0.7].map((h, i) => (
                    <motion.div key={i} className={cn("w-0.5 rounded-full", t.eqColor)}
                      animate={{ scaleY: [h, 1, h * 0.4, h] }}
                      transition={{ repeat: Infinity, duration: 0.9 + i * 0.12, ease: "easeInOut" }}
                      style={{ height: "100%", originY: 1 }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {profile.music.albumArt && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                  <Image src={profile.music.albumArt} alt="Album" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate uppercase">{profile.music.songTitle}</p>
                <p className={cn("text-[10px]", t.muted)}>{profile.music.artistName}</p>
                <p className={cn("text-[10px]", t.muted)}>Spotify</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cn("pb-4", px)}>
          <div className={cn("rounded-xl border border-dashed p-3 text-center", t.surface, t.surfaceBorder)}>
            <p className={cn("text-[10px]", t.muted)}>Paste a Spotify URL to show what you&apos;re listening to.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProfilePreview({ profile, deviceMode = "desktop" }: Props) {
  const themeId = profile.themeId ?? "default"
  const t = THEME_CONFIG[themeId] ?? THEME_CONFIG.default
  const isMobile = deviceMode === "mobile"
  const isTablet = deviceMode === "tablet"

  return (
    <div className={cn("rounded-xl p-3 min-h-[400px] flex items-start justify-center", t.bg)}>
      <div className="w-full transition-all duration-300"
        style={{ maxWidth: isMobile ? "320px" : isTablet ? "480px" : "100%" }}>
        <ProfileCard profile={profile} compact={!isMobile && !isTablet} />
      </div>
    </div>
  )
}
