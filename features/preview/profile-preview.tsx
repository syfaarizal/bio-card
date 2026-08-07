"use client"

import type { FullProfile } from "@/types"
import type { DeviceMode } from "@/components/shared/device-switcher"
import { getActiveSinceYear } from "@/lib/utils"
import { AtSign, PlayCircle, Music2, MapPin, Calendar, Star } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Props {
  profile: FullProfile
  deviceMode?: DeviceMode
}

const THEME_CLASSES: Record<string, string> = {
  default: "bg-white text-gray-900",
  midnight: "bg-[#0f0f1a] text-[#e2e8f0]",
  rose: "bg-[#fff1f2] text-[#1f1f1f]",
  cyber: "bg-[#020617] text-[#e2f8ff]",
  glass: "bg-[#f8faff] text-[#1e1b4b]",
}

const THEME_SURFACE: Record<string, string> = {
  default: "bg-gray-50 border-gray-200",
  midnight: "bg-[#1a1a2e] border-[#2a2a45]",
  rose: "bg-[#ffe4e6] border-[#fecdd3]",
  cyber: "bg-[#0c1524] border-[#1e3a5f]",
  glass: "bg-white/60 border-white/30 backdrop-blur-sm",
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

export function ProfilePreview({ profile, deviceMode = "desktop" }: Props) {
  const themeId = profile.themeId ?? "default"
  const mainPhoto = profile.images?.find((img: { type: string; url: string }) => img.type === "MAIN")
  const secondaryPhoto = profile.images?.find((img: { type: string; url: string }) => img.type === "SECONDARY")
  const activeSince = getActiveSinceYear(profile.createdAt)

  const hasSocials =
    profile.links &&
    (profile.links.instagram || profile.links.tiktok || profile.links.twitter || profile.links.youtube)

  const isMobile = deviceMode === "mobile"
  const isTablet = deviceMode === "tablet"

  return (
    <div
      className={cn(
        "rounded-2xl p-5 transition-all duration-300",
        THEME_CLASSES[themeId] ?? THEME_CLASSES.default
      )}
    >
      {/* ── MOBILE layout ── */}
      {isMobile && (
        <div className="flex flex-col gap-3">
          {/* Header: photo + name + bio */}
          <div className={cn("rounded-xl border p-4 flex items-center gap-3", THEME_SURFACE[themeId])}>
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
              {mainPhoto ? (
                <Image src={mainPhoto.url} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className={cn("text-xl font-bold opacity-20", THEME_MUTED[themeId])}>
                    {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className={cn("text-[10px] mb-0.5", THEME_MUTED[themeId])}>REAL NAME</p>
              <p className="font-semibold text-sm truncate">
                {profile.displayName || <span className="opacity-30">Display Name</span>}
              </p>
              {profile.bio && (
                <p className={cn("text-xs mt-0.5 truncate", THEME_MUTED[themeId])}>{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Location + Tags */}
          {(profile.location || (profile.tags && profile.tags.length > 0)) && (
            <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
              {profile.location && (
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 opacity-50" />
                  <p className="text-xs font-medium">{profile.location}</p>
                </div>
              )}
              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", THEME_TAG[themeId])}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Social links */}
          {hasSocials && (
            <div className={cn("rounded-xl border p-3 flex gap-2", THEME_SURFACE[themeId])}>
              {profile.links?.instagram && (
                <a href={profile.links.instagram} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <AtSign className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.links?.tiktok && (
                <a href={profile.links.tiktok} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <Music2 className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.links?.twitter && (
                <a href={profile.links.twitter} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <AtSign className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.links?.youtube && (
                <a href={profile.links.youtube} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <PlayCircle className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Now Playing */}
          {profile.music?.songTitle ? (
            <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] font-medium uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>
                Now Playing
              </p>
              <div className="flex items-center gap-2">
                {profile.music.albumArt && (
                  <Image src={profile.music.albumArt} alt="Album" width={32} height={32} className="rounded-md flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{profile.music.songTitle}</p>
                  <p className={cn("text-[10px] truncate", THEME_MUTED[themeId])}>{profile.music.artistName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={cn("rounded-xl border border-dashed p-3", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] text-center", THEME_MUTED[themeId])}>
                Paste a Spotify URL to show your song
              </p>
            </div>
          )}

          {/* Birthday + Active Since row */}
          <div className="grid grid-cols-2 gap-3">
            {profile.birthday && (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 opacity-50" />
                  <p className={cn("text-[10px] uppercase tracking-wider", THEME_MUTED[themeId])}>Birthday</p>
                </div>
                <p className="text-base font-bold">
                  {new Date(profile.birthday).getDate()}{" "}
                  <span className="text-xs font-normal">
                    {new Date(profile.birthday).toLocaleString("en-US", { month: "short" })}
                  </span>
                </p>
              </div>
            )}
            <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] uppercase tracking-wider mb-1", THEME_MUTED[themeId])}>Active Since</p>
              <p className="text-base font-black">{activeSince}</p>
            </div>
          </div>

          {/* Secondary photo / gallery */}
          {secondaryPhoto && (
            <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>Gallery</p>
              <div className="relative w-full h-24 rounded-lg overflow-hidden">
                <Image src={secondaryPhoto.url} alt="Gallery" fill className="object-cover" />
              </div>
            </div>
          )}

          {/* Username slug */}
          <div className={cn("rounded-xl border p-3 text-center", THEME_SURFACE[themeId])}>
            <p className="text-base font-black tracking-widest uppercase opacity-80">
              {profile.slug || "username"}
            </p>
            <div className="flex justify-center gap-2 mt-1">
              <Star className="w-3 h-3 opacity-30" />
              <Star className="w-3 h-3 opacity-30" />
              <Star className="w-3 h-3 opacity-30" />
            </div>
          </div>
        </div>
      )}

      {/* ── TABLET layout ── */}
      {isTablet && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left col */}
          <div className="space-y-3">
            {/* Photo + name */}
            <div className={cn("rounded-xl border p-4 flex items-center gap-3", THEME_SURFACE[themeId])}>
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                {mainPhoto ? (
                  <Image src={mainPhoto.url} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className={cn("text-2xl font-bold opacity-20", THEME_MUTED[themeId])}>
                      {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className={cn("text-[10px] mb-0.5", THEME_MUTED[themeId])}>REAL NAME</p>
                <p className="font-semibold text-sm">
                  {profile.displayName || <span className="opacity-30">Display Name</span>}
                </p>
                {profile.bio && (
                  <p className={cn("text-xs mt-0.5", THEME_MUTED[themeId])}>{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Social */}
            {hasSocials && (
              <div className={cn("rounded-xl border p-3 flex flex-wrap gap-2", THEME_SURFACE[themeId])}>
                {profile.links?.instagram && (
                  <a href={profile.links.instagram} target="_blank" rel="noopener noreferrer"
                    className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                    <AtSign className="w-3.5 h-3.5" />
                  </a>
                )}
                {profile.links?.tiktok && (
                  <a href={profile.links.tiktok} target="_blank" rel="noopener noreferrer"
                    className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                    <Music2 className="w-3.5 h-3.5" />
                  </a>
                )}
                {profile.links?.youtube && (
                  <a href={profile.links.youtube} target="_blank" rel="noopener noreferrer"
                    className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                    <PlayCircle className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Birthday */}
            {profile.birthday && (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 opacity-50" />
                  <p className={cn("text-[10px] uppercase tracking-wider", THEME_MUTED[themeId])}>Birthday</p>
                </div>
                <p className="text-lg font-bold">
                  {new Date(profile.birthday).getDate()}{" "}
                  <span className="text-sm font-normal">
                    {new Date(profile.birthday).toLocaleString("en-US", { month: "long" })}
                  </span>
                </p>
                <p className={cn("text-xs", THEME_MUTED[themeId])}>{new Date(profile.birthday).getFullYear()}</p>
              </div>
            )}
          </div>

          {/* Right col */}
          <div className="space-y-3">
            {/* Location + Tags */}
            {(profile.location || (profile.tags && profile.tags.length > 0)) && (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                {profile.location && (
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 opacity-50" />
                    <p className="text-xs font-medium">{profile.location}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {profile.tags?.map((tag: string) => (
                    <span key={tag} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", THEME_TAG[themeId])}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Now Playing */}
            {profile.music?.songTitle ? (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <p className={cn("text-[10px] uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>Now Playing</p>
                <div className="flex items-center gap-2">
                  {profile.music.albumArt && (
                    <Image src={profile.music.albumArt} alt="Album" width={28} height={28} className="rounded-md flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{profile.music.songTitle}</p>
                    <p className={cn("text-[10px] truncate", THEME_MUTED[themeId])}>{profile.music.artistName}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn("rounded-xl border border-dashed p-3", THEME_SURFACE[themeId])}>
                <p className={cn("text-[10px] text-center", THEME_MUTED[themeId])}>Paste a Spotify URL to show your song</p>
              </div>
            )}

            {/* Active Since + Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <p className={cn("text-[10px] uppercase tracking-wider mb-1", THEME_MUTED[themeId])}>Active Since</p>
                <p className="text-xl font-black">{activeSince}</p>
              </div>
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <p className={cn("text-[10px] uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>Gallery</p>
                {secondaryPhoto ? (
                  <div className="relative w-full h-10 rounded-lg overflow-hidden">
                    <Image src={secondaryPhoto.url} alt="Gallery" fill className="object-cover" />
                  </div>
                ) : (
                  <div className={cn("w-full h-10 rounded-lg border border-dashed flex items-center justify-center", THEME_SURFACE[themeId])}>
                    <p className={cn("text-[9px] text-center", THEME_MUTED[themeId])}>No image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Slug */}
            <div className={cn("rounded-xl border p-3 text-center", THEME_SURFACE[themeId])}>
              <p className="text-base font-black tracking-widest uppercase opacity-80">
                {profile.slug || "username"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP layout (original) ── */}
      {!isMobile && !isTablet && (
        <div className="flex gap-4">
          {/* Left — social icons + username label */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <div className="text-center mb-1">
              <p className="text-xs font-bold tracking-widest opacity-60 uppercase">
                {profile.slug || "username"}
              </p>
              <p className={cn("text-[10px] tracking-wider uppercase", THEME_MUTED[themeId])}>profile</p>
            </div>
            <div className="flex flex-col gap-2">
              {profile.links?.instagram && (
                <a href={profile.links.instagram} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <AtSign className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.links?.tiktok && (
                <a href={profile.links.tiktok} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <Music2 className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.links?.twitter && (
                <a href={profile.links.twitter} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <AtSign className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.links?.youtube && (
                <a href={profile.links.youtube} target="_blank" rel="noopener noreferrer"
                  className={cn("p-1.5 rounded-full border", THEME_SURFACE[themeId])}>
                  <PlayCircle className="w-3.5 h-3.5" />
                </a>
              )}
              {!hasSocials && (
                <div className={cn("w-8 h-8 rounded-full border border-dashed", THEME_SURFACE[themeId])} />
              )}
            </div>
          </div>

          {/* Center — main card */}
          <div className="flex-1 space-y-3">
            <div className={cn("rounded-xl border p-4 flex items-center gap-3", THEME_SURFACE[themeId])}>
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                {mainPhoto ? (
                  <Image src={mainPhoto.url} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className={cn("text-2xl font-bold opacity-20", THEME_MUTED[themeId])}>
                      {(profile.displayName ?? profile.slug ?? "?")[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className={cn("text-xs mb-0.5", THEME_MUTED[themeId])}>REAL NAME</p>
                <p className="font-semibold text-sm">
                  {profile.displayName || <span className="opacity-30">Display Name</span>}
                </p>
                {profile.bio && (
                  <p className={cn("text-xs mt-0.5", THEME_MUTED[themeId])}>{profile.bio}</p>
                )}
              </div>
            </div>

            {profile.birthday && (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 opacity-50" />
                  <p className={cn("text-[10px] font-medium uppercase tracking-wider", THEME_MUTED[themeId])}>Birthday</p>
                </div>
                <p className="text-lg font-bold">
                  {new Date(profile.birthday).getDate()}{" "}
                  <span className="text-sm font-normal">
                    {new Date(profile.birthday).toLocaleString("en-US", { month: "long" })}
                  </span>
                </p>
                <p className={cn("text-xs", THEME_MUTED[themeId])}>{new Date(profile.birthday).getFullYear()}</p>
              </div>
            )}

            <div className={cn("rounded-xl border p-3 text-center", THEME_SURFACE[themeId])}>
              <p className="text-lg font-black tracking-widest uppercase opacity-80">
                {profile.slug || "username"}
              </p>
              <div className="flex justify-center gap-2 mt-1">
                <Star className="w-3.5 h-3.5 opacity-30" />
                <Star className="w-3.5 h-3.5 opacity-30" />
                <Star className="w-3.5 h-3.5 opacity-30" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-36 space-y-3">
            {profile.location && (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <div className="flex items-center gap-1 mb-1.5">
                  <MapPin className="w-3 h-3 opacity-50" />
                  <p className={cn("text-[10px] font-medium uppercase tracking-wider", THEME_MUTED[themeId])}>Hometown</p>
                </div>
                <p className="text-xs font-medium">{profile.location}</p>
              </div>
            )}

            {profile.tags && profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profile.tags.map((tag: string) => (
                  <span key={tag} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", THEME_TAG[themeId])}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {profile.music?.songTitle ? (
              <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
                <p className={cn("text-[10px] font-medium uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>Now Playing</p>
                <div className="flex items-center gap-2">
                  {profile.music.albumArt && (
                    <Image src={profile.music.albumArt} alt="Album" width={28} height={28} className="rounded-md flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{profile.music.songTitle}</p>
                    <p className={cn("text-[10px] truncate", THEME_MUTED[themeId])}>{profile.music.artistName}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn("rounded-xl border border-dashed p-3", THEME_SURFACE[themeId])}>
                <p className={cn("text-[10px] text-center", THEME_MUTED[themeId])}>Paste a Spotify URL to show your song</p>
              </div>
            )}

            <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] font-medium uppercase tracking-wider mb-1", THEME_MUTED[themeId])}>Active Since</p>
              <p className="text-xl font-black">{activeSince}</p>
            </div>

            <div className={cn("rounded-xl border p-3", THEME_SURFACE[themeId])}>
              <p className={cn("text-[10px] font-medium uppercase tracking-wider mb-2", THEME_MUTED[themeId])}>Gallery</p>
              {secondaryPhoto ? (
                <div className="relative w-full h-16 rounded-lg overflow-hidden">
                  <Image src={secondaryPhoto.url} alt="Gallery" fill className="object-cover" />
                </div>
              ) : (
                <div className={cn("w-full h-16 rounded-lg border border-dashed flex items-center justify-center", THEME_SURFACE[themeId])}>
                  <p className={cn("text-[10px] text-center px-2", THEME_MUTED[themeId])}>Upload your second image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
