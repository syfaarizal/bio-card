"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { FocusedImage } from "@/components/shared/focused-image"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface ProfileCard {
  slug: string
  displayName: string | null
  bio: string | null
  tags: string[]
  themeId: string
  images: { type: string; url: string; focusX: number; focusY: number; zoom: number }[]
}

interface Props {
  profiles: ProfileCard[]
}

// Every theme exposes the same token names, so one class set works for all of
// them — the `data-theme` attribute on the card decides the actual colours.
const THEME_CARD = "bg-[var(--theme-panel)] border-[var(--theme-border)] text-[var(--theme-text)]"
const THEME_MUTED = "text-[var(--theme-muted)]"
const THEME_TAG = "bg-[var(--theme-soft)] text-[var(--theme-accent)]"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function LandingGallery({ profiles }: Props) {
  if (profiles.length === 0) return null

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {profiles.map((profile) => {
        const themeId = profile.themeId ?? "default"
        const mainPhoto = profile.images.find((img) => img.type === "PROFILE")

        return (
          <motion.div key={profile.slug} variants={fadeUp} transition={{ duration: 0.4, ease: "easeOut" }}>
            <Link href={`/${profile.slug}`} className="group block">
              <div
                data-theme={themeId}
                className={cn(
                  "rounded-2xl border p-5 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5",
                  THEME_CARD
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {mainPhoto ? (
                        <FocusedImage src={mainPhoto.url} alt={profile.displayName ?? profile.slug} focusX={mainPhoto.focusX} focusY={mainPhoto.focusY} zoom={mainPhoto.zoom} sizes="44px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={cn("text-lg font-black opacity-30", THEME_MUTED)}>
                            {(profile.displayName ?? profile.slug)[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Name */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {profile.displayName || profile.slug}
                      </p>
                      <p className={cn("text-xs", THEME_MUTED)}>
                        biocard.app/{profile.slug}
                      </p>
                    </div>
                  </div>
                  {/* Arrow icon */}
                  <ArrowUpRight
                    className={cn(
                      "w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      THEME_MUTED
                    )}
                  />
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className={cn("text-xs leading-relaxed mb-3 line-clamp-2", THEME_MUTED)}>
                    {profile.bio}
                  </p>
                )}

                {/* Tags */}
                {profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", THEME_TAG)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
