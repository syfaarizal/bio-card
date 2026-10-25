"use client"

import type { FullProfile } from "@/types"
import { ProfileLayout } from "@/features/shared/profile-layout"

interface Props {
  profile: FullProfile
}

export function PublicProfilePage({ profile }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 p-2 sm:p-3">
      <div className="w-full">
        <ProfileLayout profile={profile} mode="responsive" />
      </div>
    </div>
  )
}
