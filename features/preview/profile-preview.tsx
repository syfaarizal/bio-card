"use client"

import { useCallback, useEffect, useRef } from "react"
import type { FullProfile } from "@/types"
import {
  PREVIEW_PROFILE_MESSAGE,
  PREVIEW_REQUEST_MESSAGE,
} from "@/features/preview/preview-protocol"

interface Props {
  profile: FullProfile
}

/** Fixed phone viewport width — matches the CSS breakpoint of a real phone. */
const FRAME_WIDTH = 390
/** Fixed phone viewport height; the card scrolls inside the frame. */
const FRAME_HEIGHT = 780

/**
 * Live preview rendered inside a phone-sized iframe.
 *
 * The iframe gives the preview its own viewport, so viewport-based media
 * queries evaluate against 390px instead of the editor window's width. The
 * result is the same card the visitor sees on a phone, not a squeezed
 * desktop layout.
 */
export function ProfilePreview({ profile }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  const postProfile = useCallback((next: FullProfile) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_PROFILE_MESSAGE, profile: next },
      window.location.origin,
    )
  }, [])

  // Push every editor change into the frame, theme changes included.
  useEffect(() => {
    postProfile(profile)
  }, [profile, postProfile])

  // A frame that mounted before this listener was attached asks for the
  // current profile itself.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === PREVIEW_REQUEST_MESSAGE) postProfile(profile)
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [profile, postProfile])

  return (
    <div className="flex justify-center overflow-x-auto">
      <div className="overflow-hidden rounded-[2rem] border-[10px] border-gray-900 bg-black shadow-xl dark:border-zinc-950">
        <iframe
          ref={frameRef}
          src="/preview-frame"
          title="BioCard preview"
          className="block border-0 bg-white"
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
