import type { FullProfile } from "@/types"

/** Parent → frame: the profile to render. */
export const PREVIEW_PROFILE_MESSAGE = "biocard:preview-profile"

/** Frame → parent: "send me the current profile" (covers a late-mounting frame). */
export const PREVIEW_REQUEST_MESSAGE = "biocard:preview-request"

export interface PreviewProfileMessage {
  type: typeof PREVIEW_PROFILE_MESSAGE
  profile: FullProfile
}

export interface PreviewRequestMessage {
  type: typeof PREVIEW_REQUEST_MESSAGE
}
