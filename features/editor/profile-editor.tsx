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
    <div className="flex gap-6 h-full">
      {/* ── Editor Panel ── */}
      <div className="flex-1 max-w-xl overflow-y-auto space-y-6 pb-6">
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
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Live Preview</span>
          </div>
          <DeviceSwitcher current={deviceMode} onChange={setDeviceMode} />
        </div>

        <div className="flex-1 bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-auto flex items-start justify-center p-4">
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
