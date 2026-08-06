"use client"

import { useState } from "react"
import type { FullProfile } from "@/types"
import { IdentitySection } from "./sections/identity-section"
import { SocialSection } from "./sections/social-section"
import { MusicSection } from "./sections/music-section"
import { ImagesSection } from "./sections/images-section"
import { ThemeSection } from "./sections/theme-section"
import { ProfilePreview } from "@/features/preview/profile-preview"

interface ProfileEditorProps {
  profile: FullProfile
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const [liveProfile, setLiveProfile] = useState<FullProfile>(profile)

  const updatePreview = (updates: Partial<FullProfile>) => {
    setLiveProfile((prev: FullProfile) => ({ ...prev, ...updates }))
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Editor Panel */}
      <div className="flex-1 max-w-xl overflow-y-auto space-y-6 pb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500">Customize your information and appearance</p>
        </div>

        <ThemeSection profile={liveProfile} onUpdate={updatePreview} />
        <IdentitySection profile={liveProfile} onUpdate={updatePreview} />
        <SocialSection profile={liveProfile} onUpdate={updatePreview} />
        <MusicSection profile={liveProfile} onUpdate={updatePreview} />
        <ImagesSection profile={liveProfile} onUpdate={updatePreview} />
      </div>

      {/* Live Preview Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
          </div>
          <p className="text-xs text-gray-400">This is how your BioCard will look.</p>
        </div>
        <div className="flex-1 bg-gray-100 rounded-xl p-4 overflow-auto">
          <ProfilePreview profile={liveProfile} />
        </div>
      </div>
    </div>
  )
}
