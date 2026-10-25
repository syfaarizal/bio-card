import Image from "next/image"
import { BadgeCheck, CalendarDays, MapPin, Music2, Zap } from "lucide-react"
import type { FullProfile, ProfileLink } from "@/types"
import type { DeviceMode } from "@/components/shared/device-switcher"
import { getActiveSinceYear } from "@/lib/utils"
import { DecorationOverlay, type DecorationId } from "@/components/shared/avatar-decoration"
import { BrandIcon } from "@/components/shared/brand-icon"
import { cn } from "@/lib/utils"

type LayoutMode = DeviceMode | "responsive"

interface Props {
  profile: FullProfile
  mode: LayoutMode
}

const THEMES: Record<string, { page: string; panel: string; muted: string; accent: string; border: string; soft: string; identity: string; bannerFallback: string; avatarRing: string }> = {
  default: { page: "bg-gray-100", panel: "bg-white", muted: "text-gray-500", accent: "text-gray-900", border: "border-gray-200", soft: "bg-gray-50", identity: "text-gray-900", bannerFallback: "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900", avatarRing: "bg-gray-800" },
  midnight: { page: "bg-[#08090e]", panel: "bg-[#0d0f16]", muted: "text-slate-400", accent: "text-indigo-400", border: "border-slate-800", soft: "bg-[#151923]", identity: "text-slate-100", bannerFallback: "bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950", avatarRing: "bg-indigo-500" },
  rose: { page: "bg-rose-50", panel: "bg-white", muted: "text-rose-500", accent: "text-rose-600", border: "border-rose-200", soft: "bg-rose-50", identity: "text-gray-900", bannerFallback: "bg-gradient-to-r from-rose-950 via-rose-900 to-pink-950", avatarRing: "bg-rose-500" },
  cyber: { page: "bg-[#050914]", panel: "bg-[#080e19]", muted: "text-slate-400", accent: "text-cyan-400", border: "border-cyan-950", soft: "bg-[#0e1724]", identity: "text-slate-100", bannerFallback: "bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950", avatarRing: "bg-cyan-400" },
  glass: { page: "bg-violet-50", panel: "bg-white/70", muted: "text-violet-500", accent: "text-violet-600", border: "border-violet-200", soft: "bg-violet-50/70", identity: "text-violet-950", bannerFallback: "bg-gradient-to-r from-violet-950 via-indigo-900 to-purple-950", avatarRing: "bg-violet-600" },
}

export function ProfileLayout({ profile, mode }: Props) {
  const simulatedMobile = mode === "mobile"
  const responsive = mode === "responsive"
  const wide = !simulatedMobile
  const t = THEMES[profile.themeId ?? "default"] ?? THEMES.default
  const images = profile.images ?? []
  const image = (type: string) => images.find((item) => item.type === type)
  const avatar = image("PROFILE")
  const banner = image("BANNER")
  const gallery = [image("GALLERY_1"), image("GALLERY_2"), image("GALLERY_3")].filter(Boolean)
  const links = (profile.profileLinks ?? []).filter((link: ProfileLink) => link.isActive).sort((a: ProfileLink, b: ProfileLink) => a.sortOrder - b.sortOrder)
  const activeSince = getActiveSinceYear(profile.createdAt)
  const decoration = (profile.profileEffect ?? "none") as DecorationId
  const mainPad = responsive ? "p-3 md:p-5" : wide ? "p-5" : "p-3"
  const statsGrid = "grid-cols-2"
  const galleryGrid = "grid-cols-3"

  return (
    <div className={cn("w-full min-h-[420px] overflow-hidden rounded-xl border shadow-sm", t.page, t.border)}>
      <div className="min-h-[inherit]">
        <main id="profile" className={cn("min-w-0", t.panel, mainPad)}>
          <div className="relative overflow-hidden rounded-xl">
            <div className="relative h-28 overflow-hidden sm:h-32">
              {banner ? <Image src={banner.url} alt="Profile banner" fill priority className="object-cover" /> : <div className={cn("h-full", t.bannerFallback)} />}
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
            </div>

            <div className={cn("relative flex flex-wrap gap-4 px-4 pb-4", responsive ? "-mt-10 flex-col items-center pt-0 md:-mt-12 md:flex-row md:items-end md:px-6" : wide ? "-mt-12 flex-row items-end pt-0" : "-mt-10 flex-col items-center pt-0")}>
              <div className={cn("relative h-[76px] w-[76px] shrink-0 rounded-full p-[2px] shadow-md sm:h-[88px] sm:w-[88px]", t.avatarRing)}>
                <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-700">
                  {avatar ? <Image src={avatar.url} alt={profile.displayName ?? profile.slug} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-2xl font-black text-white/70">{(profile.displayName ?? profile.slug)[0]?.toUpperCase()}</div>}
                </div>
                <DecorationOverlay id={decoration} size={88} />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>
              <div className={cn("min-w-0 flex-1", simulatedMobile && "text-center", responsive && "text-center md:text-left")}>
                <p className={cn("text-[10px] font-semibold tracking-widest", t.accent)}>@{profile.slug}</p>
                <h1 className={cn("truncate text-xl font-bold", t.identity, responsive ? "md:text-white" : wide ? "text-white" : "")}>{profile.displayName ?? profile.slug}{profile.verifiedBadge && <BadgeCheck className={cn("ml-1 inline h-4 w-4", t.accent)} />}</h1>
                <p className={cn("truncate text-xs", t.muted)}>{profile.bio ?? "Add a short bio to introduce yourself."}</p>
                <div className={cn("mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]", responsive ? "justify-center md:justify-start" : simulatedMobile ? "justify-center" : "")}>
                  {profile.location && <p className={cn("flex items-center gap-1", t.accent)}><MapPin className="h-3 w-3" />{profile.location}</p>}
                  <p className={cn("flex items-center gap-1", t.muted)}><Zap className="h-3 w-3" />Active since {activeSince} <span className={t.accent}>★★★</span></p>
                </div>
              </div>
              {(profile.tags?.length ?? 0) > 0 && <div className={cn("flex flex-wrap gap-1.5", responsive ? "justify-center md:justify-start" : simulatedMobile ? "justify-center" : "")}>{(profile.tags ?? []).slice(0, 4).map((tag) => <span key={tag} className={cn("rounded-full border px-2.5 py-1 text-[9px]", t.border, t.soft, t.accent)}>{tag}</span>)}</div>}
              {links.length > 0 && <div className={cn("flex gap-2", responsive ? "justify-center md:justify-start" : simulatedMobile ? "justify-center" : "")}>
                {links.slice(0, 6).map((link) => <a key={link.id} href={link.url} title={link.title} target="_blank" rel="noreferrer" className={cn("flex h-8 w-8 items-center justify-center rounded-full border", t.border, t.soft, t.accent)}><BrandIcon provider={link.provider} className="h-3.5 w-3.5" /></a>)}
              </div>}
            </div>

            <div className={cn("mx-4 mb-4 border-t", t.border)} />

            <div className={cn("grid gap-3 px-4 pb-4", statsGrid)}>
              {profile.birthday && <div className={cn("flex items-center justify-between rounded-xl border p-3", t.border, t.soft)}><div><p className={cn("flex items-center gap-1 text-[9px] uppercase", t.muted)}><CalendarDays className="h-3 w-3" />Birthday</p><p className="mt-1 text-sm font-bold">{new Date(profile.birthday).getUTCDate()}</p><p className={cn("text-[9px]", t.muted)}>{new Date(profile.birthday).toLocaleString("en-US", { month: "long", timeZone: "UTC" })} {new Date(profile.birthday).getUTCFullYear()}</p></div><span className={cn("text-lg", t.accent)}>✦</span></div>}
              <div className={cn("flex items-center justify-between rounded-xl border p-3", t.border, t.soft)}><div><p className={cn("flex items-center gap-1 text-[9px] uppercase", t.muted)}><Zap className="h-3 w-3" />Active Since</p><p className="mt-1 text-sm font-bold">{activeSince}</p><p className={cn("text-[9px]", t.accent)}>★★★</p></div><span className={cn("text-lg", t.accent)}>✧</span></div>
            </div>

            {gallery.length > 0 && <section id="gallery" className="px-4 pb-4"><div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-semibold">Gallery</h2><span className={cn("text-[9px]", t.accent)}>View all →</span></div><div className={cn("grid gap-2", galleryGrid)}>{gallery.map((img, index) => img && <div key={img.id ?? index} className="relative aspect-[1.35] overflow-hidden rounded-lg"><Image src={img.url} alt={`Gallery image ${index + 1}`} fill className="object-cover" /></div>)}</div></section>}

            <section className="px-4 pb-4"><div className={cn("flex items-center gap-3 rounded-xl border p-3", t.border, t.soft)}>
              {profile.music?.albumArt ? <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"><Image src={profile.music.albumArt} alt="Album cover" fill className="object-cover" /></div> : <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", t.soft)}><Music2 className={cn("h-4 w-4", t.accent)} /></div>}
              <div className="min-w-0 flex-1"><p className={cn("text-[8px] font-bold uppercase tracking-wider", t.accent)}>Now Playing</p><p className="truncate text-[10px] font-semibold">{profile.music?.songTitle ?? "Add a Spotify track"}</p><p className={cn("truncate text-[9px]", t.muted)}>{profile.music?.artistName ?? "Spotify"}</p></div>
              <span className={cn("text-sm", t.accent)}>▷</span>
            </div></section>
          </div>
          <p className={cn("pt-3 text-center text-[9px]", t.muted)}>Made with BioCard</p>
        </main>
      </div>
    </div>
  )
}
