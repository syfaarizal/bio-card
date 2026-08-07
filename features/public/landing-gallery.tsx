"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface ProfileCard {
  slug: string
  displayName: string | null
  bio: string | null
  tags: string[]
  themeId: string
  images: { type: string; url: string }[]
}

interface Props {
  profiles: ProfileCard[]
}

const THEME_CARD: Record<string, string> = {
  default: "bg-white border-gray-200 text-gray-900",
  midnight: "bg-[#0f0f1a] border-[#2a2a45] text-[#e2e8f0]",
  rose: "bg-[#fff1f2] border-[#fecdd3] text-[#1f1f1f]",
  cyber: "bg-[#020617] border-[#1e3a5f] text-[#e2f8ff]",
  glass: "bg-white/80 border-white/40 backdrop-blur-sm text-[#1e1b4b]",
}

const THEME_MUTED: Record<string, string> = {
  default: "text-gray-400",
  midnight: "text-[#64748b]",
  rose: "text-[#9f9f9f]",
  cyber: "text-[#4a6a8a]",
  glass: "text-[#6b7280]",
}

const THEME_TAG: Record<string, string> = {
  default: "bg-gray-100 text-gray-600",
  midnight: "bg-[#1e1e40] text-[#a5b4fc]",
  rose: "bg-[#ffe4e6] text-[#be185d]",
  cyber: "bg-[#0c1524] text-[#22d3ee]",
  glass: "bg-[#ede9fe] text-[#7c3aed]",
}

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
        const mainPhoto = profile.images.find((img) => img.type === "MAIN")

        return (
          <motion.div key={profile.slug} variants={fadeUp} transition={{ duration: 0.4, ease: "easeOut" }}>
            <Link href={`/${profile.slug}`} className="group block">
              <div
                className={cn(
                  "rounded-2xl border p-5 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5",
                  THEME_CARD[themeId] ?? THEME_CARD.default
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {mainPhoto ? (
                        <Image src={mainPhoto.url} alt={profile.displayName ?? profile.slug} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={cn("text-lg font-black opacity-30", THEME_MUTED[themeId])}>
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
                      <p className={cn("text-xs", THEME_MUTED[themeId])}>
                        biocard.app/{profile.slug}
                      </p>
                    </div>
                  </div>
                  {/* Arrow icon */}
                  <ArrowUpRight
                    className={cn(
                      "w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      THEME_MUTED[themeId]
                    )}
                  />
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className={cn("text-xs leading-relaxed mb-3 line-clamp-2", THEME_MUTED[themeId])}>
                    {profile.bio}
                  </p>
                )}

                {/* Tags */}
                {profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.tags.slice(0, 3).map((tag) => (
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
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
