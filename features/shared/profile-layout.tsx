import Image from "next/image"
import { AudioLines, BadgeCheck, CalendarDays, MapPin, Music2, Zap } from "lucide-react"
import { FocusedImage } from "@/components/shared/focused-image"
import type { FullProfile, ProfileLink } from "@/types"
import { THEMES } from "@/types"
import { getActiveSinceYear } from "@/lib/utils"
import { birthdayPartsFrom, MONTH_NAMES } from "@/lib/birthday"
import { DecorationOverlay, type DecorationId } from "@/components/shared/avatar-decoration"
import { avatarPhotoSize } from "@/lib/avatar-ring"
import { BrandIcon } from "@/components/shared/brand-icon"
import { GalleryLightbox } from "@/features/shared/gallery-lightbox"
import { MoreLinksDialog } from "@/features/shared/more-links-dialog"
import { zodiacFrom } from "@/lib/zodiac"
import { ZodiacIcon } from "@/features/shared/zodiac-icon"
import { BrandLogo } from "@/components/shared/brand-logo"

interface Props {
  profile: FullProfile
}

/**
 * The profile card. One layout, portrait only, always one column — see
 * docs/adr/006-mobile-first-portrait-preview.md.
 *
 * Width-dependent styling uses container queries (`@container` / `@sm:`) on the
 * card, never viewport breakpoints, so the card adapts to the space it is
 * given instead of to the width of the window that happens to contain it.
 * That is what makes the editor preview (390px iframe) and the public page
 * agree.
 */
export function ProfileLayout({ profile }: Props) {
  const themeId = THEMES.some((t) => t.id === profile.themeId) ? profile.themeId! : "default"
  const images = profile.images ?? []
  const image = (type: string) => images.find((item) => item.type === type)
  const avatar = image("PROFILE")
  const banner = image("BANNER")
  const gallery = [image("GALLERY_1"), image("GALLERY_2"), image("GALLERY_3")].filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  )
  const links = (profile.profileLinks ?? [])
    .filter((link: ProfileLink) => link.isActive)
    .sort((a: ProfileLink, b: ProfileLink) => a.sortOrder - b.sortOrder)
  const activeSince = getActiveSinceYear(profile.createdAt)
  const decoration = (profile.profileEffect ?? "none") as DecorationId
  const birthday = profile.birthday ? birthdayPartsFrom(profile.birthday) : null
  const zodiac = birthday ? zodiacFrom(Number(birthday.month), Number(birthday.day)) : null

  return (
    <div data-theme={themeId} className="flex min-h-dvh w-full bg-[var(--theme-page)]">
      {/* Auto margins centre the card and collapse to zero when the content
          is taller than the viewport, so the top of the card never becomes
          unreachable. */}
      <div className="mx-auto my-auto w-full max-w-md px-3 py-4">
        <article className="@container flex flex-col overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] text-[var(--theme-text)] shadow-sm">
          {/* ── Banner ── */}
          <div className="relative h-28 overflow-hidden @sm:h-36">
            {banner ? (
              <FocusedImage
                src={banner.url}
                alt="Profile banner"
                focusX={banner.focusX}
                focusY={banner.focusY}
                zoom={banner.zoom}
                sizes="(max-width: 640px) 100vw, 448px"
                priority
              />
            ) : (
              <div className="h-full w-full" style={{ background: "var(--theme-banner)" }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
          </div>

          {/* ── Identity ── */}
          <div
            className="-mt-7 rounded-t-[28px] bg-[var(--theme-panel)]"
            style={{ backdropFilter: "blur(var(--theme-panel-blur))" }}
          >
            <div className="flex flex-col items-center gap-3 px-4 pt-4">
              {/* The decoration *is* the avatar border — Discord-style. The photo
                  is inset so it ends exactly where the decoration's band
                  starts, so the band frames the image instead of being a stroke
                  drawn over it. */}
              <div className="relative h-[76px] w-[76px] shrink-0 rounded-full shadow-md @sm:h-[88px] @sm:w-[88px]">
                <div className="absolute inset-0 m-auto overflow-hidden rounded-full bg-slate-700"
                  style={{ width: `${avatarPhotoSize(decoration)}%`, height: `${avatarPhotoSize(decoration)}%` }}
                >
                  {avatar ? (
                    <FocusedImage
                      src={avatar.url}
                      alt={profile.displayName ?? profile.slug}
                      focusX={avatar.focusX}
                      focusY={avatar.focusY}
                      zoom={avatar.zoom}
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-black text-white/70">
                      {(profile.displayName ?? profile.slug)[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <DecorationOverlay id={decoration} />
                <span className="absolute left-[83.6%] top-[83.6%] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--theme-panel)] bg-emerald-400" />
              </div>

              <div className="w-full min-w-0 text-center">
                <p className="text-[10px] font-semibold tracking-widest text-[var(--theme-accent)]">@{profile.slug}</p>
                <h1 className="truncate text-xl font-bold text-[var(--theme-text)]">
                  {profile.displayName ?? profile.slug}
                  {profile.verifiedBadge && <BadgeCheck className="ml-1 inline h-4 w-4 text-[var(--theme-accent)]" />}
                </h1>
                <p className="truncate text-xs text-[var(--theme-muted)]">{profile.bio ?? "Add a short bio to introduce yourself."}</p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px]">
                  {profile.location && (
                    <p className="flex items-center gap-1 text-[var(--theme-accent)]">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </p>
                  )}
                  <p className="flex items-center gap-1 text-[var(--theme-muted)]">
                    <Zap className="h-3 w-3" />
                    Active since {activeSince} <span className="text-[var(--theme-accent)]">★★★</span>
                  </p>
                </div>
              </div>
            </div>

            {(profile.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 px-4 pt-4">
                {(profile.tags ?? []).slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-soft)] px-2.5 py-1 text-[9px] font-medium text-[var(--theme-accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 px-4 pt-4">
                {links.slice(0, 6).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    title={link.title}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-soft)] text-[var(--theme-accent)] transition-transform hover:scale-105"
                  >
                    <BrandIcon provider={link.provider} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}

            <div className="px-4">
              <MoreLinksDialog links={links.slice(6)} />
            </div>

            <div className="mx-4 my-4 border-t border-[var(--theme-border)]" />

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 gap-3 px-4">
              {birthday && (
                <div className="flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-soft)] p-3">
                  <div>
                    <p className="flex items-center gap-1 text-[9px] uppercase text-[var(--theme-muted)]">
                      <CalendarDays className="h-3 w-3" />
                      Birthday
                    </p>
                    <p className="mt-1 text-sm font-bold">{birthday.day}</p>
                    <p className="text-[9px] text-[var(--theme-muted)]">
                      {MONTH_NAMES[Number(birthday.month) - 1]} {birthday.year}
                    </p>
                  </div>
                  {zodiac && <span role="img" title={zodiac.name} aria-label={zodiac.name}><ZodiacIcon name={zodiac.name} /></span>}
                </div>
              )}
              <div className="flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-soft)] p-3">
                <div>
                  <p className="flex items-center gap-1 text-[9px] uppercase text-[var(--theme-muted)]">
                    <Zap className="h-3 w-3" />
                    Active Since
                  </p>
                  <p className="mt-1 text-sm font-bold">{activeSince}</p>
                  <p className="text-[9px] text-[var(--theme-accent)]">★★★</p>
                </div>
                <span className="text-lg text-[var(--theme-accent)]">✧</span>
              </div>
            </div>

            {/* ── Gallery ── */}
            {gallery.length > 0 && (
              <section id="gallery" className="px-4 pt-4">
                <h2 className="mb-2 flex items-center justify-between text-xs font-semibold">Gallery</h2>
                <GalleryLightbox images={gallery} themeId={themeId} />
              </section>
            )}

            {/* ── Now playing ── */}
            <section className="px-4 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-soft)] p-3">
                {profile.music?.albumArt ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={profile.music.albumArt} alt="Album cover" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-soft)]">
                    <Music2 className="h-4 w-4 text-[var(--theme-accent)]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--theme-accent)]">Now Playing</p>
                  <p className="truncate text-[10px] font-semibold">{profile.music?.songTitle ?? "Add a Spotify track"}</p>
                  <p className="truncate text-[9px] text-[var(--theme-muted)]">{profile.music?.artistName ?? "Spotify"}</p>
                </div>
                <AudioLines className="h-4 w-4 mr-3 shrink-0 text-[var(--theme-accent)]" aria-hidden />
              </div>
            </section>

            <p className="py-4 text-center text-[9px] text-[var(--theme-muted)]">
              Made with{" "}
              <a
                href="https://biocard-pro.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                <span className="inline-flex items-center gap-1"><BrandLogo className="h-4 w-4 rounded-full" />BioCard</span>
              </a>
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
