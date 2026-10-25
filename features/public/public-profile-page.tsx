"use client"

import type { FullProfile } from "@/types"
import { ProfileLayout } from "@/features/shared/profile-layout"

interface Props {
  profile: FullProfile
}

export function PublicProfilePage({ profile }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 p-2 sm:p-5 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <ProfileLayout profile={profile} mode="responsive" />
      </div>
    </div>
  )
}
