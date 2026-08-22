"use client"

import { useState } from "react"
import type { FullProfile } from "@/types"
import { IdentitySection } from "./sections/identity-section"
import { SocialSection } from "./sections/social-section"
import { MusicSection } from "./sections/music-section"
import { ImagesSection } from "./sections/images-section"
import { ThemeSection } from "./sections/theme-section"
import { DecorationSection } from "./sections/decoration-section"
import { ProfilePreview } from "@/features/preview/profile-preview"
import { DeviceSwitcher, type DeviceMode } from "@/components/shared/device-switcher"

interface ProfileEditorProps {
  profile: FullProfile
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const [liveProfile, setLiveProfile] = useState<FullProfile>(profile)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")

  const updatePreview = (updates: Partial<FullProfile>) => {
    setLiveProfile((prev: FullProfile) => ({ ...prev, ...updates }))
  }

  return (
    <div className="flex h-full min-w-0 flex-col gap-6 xl:flex-row">
      {/* ── Editor Panel ── */}
      <div className="min-w-0 flex-1 space-y-6 pb-6 pr-2 sm:pr-4 xl:max-w-xl xl:overflow-y-auto">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">Edit Profile</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Customize your information and appearance</p>
        </div>

        <ThemeSection profile={liveProfile} onUpdate={updatePreview} />
        <DecorationSection profile={liveProfile} onUpdate={updatePreview} />
        <ImagesSection profile={liveProfile} onUpdate={updatePreview} />
        <IdentitySection profile={liveProfile} onUpdate={updatePreview} />
        <SocialSection profile={liveProfile} onUpdate={updatePreview} />
        <MusicSection profile={liveProfile} />
      </div>

      {/* ── Live Preview Panel ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex flex-shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Live Preview</span>
          </div>
          <DeviceSwitcher current={deviceMode} onChange={setDeviceMode} />
        </div>

        <div className="flex min-h-[520px] flex-1 items-start justify-center overflow-auto rounded-xl bg-gray-100 p-3 dark:bg-zinc-900 sm:p-4">
          <div
            className="transition-all duration-300 w-full"
            style={{
              maxWidth:
                deviceMode === "mobile" ? "390px"
                : deviceMode === "tablet" ? "768px"
                : "100%",
            }}
          >
            <ProfilePreview profile={liveProfile} deviceMode={deviceMode} />
          </div>
        </div>
      </div>
    </div>
  )
}
