"use client"

import type { FullProfile } from "@/types"
import { ProfileLayout } from "@/features/shared/profile-layout"

interface Props {
  profile: FullProfile
}

export function PublicProfilePage({ profile }: Props) {
  // The theme backdrop fills the viewport; the card stays portrait and
  // centred. There is no separate desktop layout — see ADR 006.
  return <ProfileLayout profile={profile} />
}
