"use client"

import { useEffect, useState } from "react"
import type { FullProfile } from "@/types"
import { ProfileLayout } from "@/features/shared/profile-layout"
import {
  PREVIEW_PROFILE_MESSAGE,
  PREVIEW_REQUEST_MESSAGE,
} from "@/features/preview/preview-protocol"

/**
 * Renders inside the preview iframe. The editor owns the profile state and
 * pushes it over postMessage; this component only ever draws what it is
 * given, so the frame cannot drift from the editor.
 *
 * Because this is a real document with its own viewport, any viewport-based
 * media query inside evaluates against the frame's width (390px), not the
 * width of the editor window.
 */
export function PreviewFrame() {
  const [profile, setProfile] = useState<FullProfile | null>(null)

  useEffect(() => {
    document.documentElement.dataset.previewFrame = "true"

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!data || typeof data !== "object") return

      if (data.type === PREVIEW_PROFILE_MESSAGE) {
        setProfile(data.profile as FullProfile)
      } else if (data.type === PREVIEW_REQUEST_MESSAGE) {
        window.parent.postMessage({ type: PREVIEW_REQUEST_MESSAGE }, window.location.origin)
      }
    }

    window.addEventListener("message", onMessage)
    window.parent.postMessage({ type: PREVIEW_REQUEST_MESSAGE }, window.location.origin)

    return () => {
      window.removeEventListener("message", onMessage)
      delete document.documentElement.dataset.previewFrame
    }
  }, [])

  if (!profile) {
    return <div className="min-h-dvh w-full bg-[var(--theme-page)]" />
  }

  return <ProfileLayout profile={profile} />
}
