"use client"

import type { FullProfile } from "@/types"
import type { DeviceMode } from "@/components/shared/device-switcher"
import { ProfileLayout } from "@/features/shared/profile-layout"

interface Props {
  profile: FullProfile
  deviceMode?: DeviceMode
}

export function ProfilePreview({ profile, deviceMode = "desktop" }: Props) {
  const maxWidth = deviceMode === "mobile" ? 390 : "100%"

  return (
    <div className="w-full rounded-xl bg-gray-100 p-2 dark:bg-zinc-900 sm:p-3">
      <div className="mx-auto w-full transition-all duration-300" style={{ maxWidth }}>
        <ProfileLayout profile={profile} mode={deviceMode} />
      </div>
    </div>
  )
}
