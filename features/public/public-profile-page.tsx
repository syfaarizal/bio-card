"use client"

import type { FullProfile } from "@/types"
import { ProfileLayout } from "@/features/shared/profile-layout"

interface Props {
  profile: FullProfile
}

export function PublicProfilePage({ profile }: Props) {
  return (
    // On phones and tablets the card fills the viewport edge to edge; on
    // desktop it keeps the page padding and its natural height.
    <div className="min-h-dvh bg-gray-950 lg:min-h-screen lg:p-3">
      <ProfileLayout profile={profile} mode="responsive" fillHeight />
    </div>
  )
}
