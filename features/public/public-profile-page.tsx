"use client"

import { useEffect, useState } from "react"
import type { FullProfile } from "@/types"
import type { DeviceMode } from "@/components/shared/device-switcher"
import { ProfilePreview } from "@/features/preview/profile-preview"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface Props {
  profile: FullProfile
}

const THEME_BG: Record<string, string> = {
  default: "bg-gray-100",
  midnight: "bg-[#070712]",
  rose: "bg-[#fce7e9]",
  cyber: "bg-[#010410]",
  glass: "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
}

function getDeviceMode(width: number): DeviceMode {
  if (width >= 1024) return "desktop"
  if (width >= 640) return "tablet"
  return "mobile"
}

export function PublicProfilePage({ profile }: Props) {
  const themeId = profile.themeId ?? "default"
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")
  const isDesktop = deviceMode === "desktop"

  useEffect(() => {
    const updateDeviceMode = () => setDeviceMode(getDeviceMode(window.innerWidth))
    updateDeviceMode()
    window.addEventListener("resize", updateDeviceMode)
    return () => window.removeEventListener("resize", updateDeviceMode)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${THEME_BG[themeId] ?? THEME_BG.default}`}>
      <div className={isDesktop ? "w-full h-full px-8 py-8" : "max-w-2xl mx-auto h-full px-4 py-12 md:py-20"}>
        <ProfilePreview profile={profile} deviceMode={deviceMode} />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-opacity hover:opacity-80"
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
        </div>
      </div>
    </div>
  )
}
