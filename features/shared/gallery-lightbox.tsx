"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { FocusedImage } from "@/components/shared/focused-image"

export type GalleryImage = {
  id?: string | null
  url: string
  focusX: number
  focusY: number
  zoom: number
}

interface Props {
  images: GalleryImage[]
  themeId: string
}

/**
 * The gallery grid plus its lightbox.
 *
 * The card is the same markup in the editor preview and on the public page,
 * so the lightbox has to live here too.
 *
 * The overlay is portalled to <body> rather than rendered in place: the card
 * uses `backdrop-filter`, which makes it the containing block for any
 * `position: fixed` descendant — an in-place overlay would be clipped by the
 * card instead of covering the viewport. The theme's `data-theme` attribute
 * is copied onto the portal root so the overlay still reads the theme's
 * custom properties.
 */
export function GalleryLightbox({ images, themeId }: Props) {
  const [index, setIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lastIndex = useRef(0)
  const wasOpen = useRef(false)

  const isOpen = index !== null

  const close = useCallback(() => {
    setIndex(null)
  }, [])

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current
        return (current + delta + images.length) % images.length
      })
    },
    [images.length],
  )

  // Escape closes, arrows move between images.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        step(1)
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        step(-1)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, close, step])

  // The page behind the overlay must not scroll while it is open.
  useEffect(() => {
    if (!isOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Move focus into the overlay on open, and back to the thumbnail on close.
  useEffect(() => {
    if (isOpen) {
      lastIndex.current = index!
      if (!wasOpen.current) closeRef.current?.focus()
      wasOpen.current = true
    } else if (wasOpen.current) {
      wasOpen.current = false
      triggerRefs.current[lastIndex.current]?.focus()
    }
  }, [isOpen, index])

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, i) => (
          <button
            key={image.id ?? i}
            ref={(node) => {
              triggerRefs.current[i] = node
            }}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open gallery image ${i + 1}`}
            className="group relative aspect-[1.35] overflow-hidden rounded-lg border border-[var(--theme-border)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
          >
            <FocusedImage
              src={image.url}
              alt={`Gallery image ${i + 1}`}
              focusX={image.focusX}
              focusY={image.focusY}
              zoom={image.zoom}
              sizes="(max-width: 640px) 33vw, 150px"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
          </button>
        ))}
      </div>

      {isOpen &&
        createPortal(
          <div
            data-theme={themeId}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
            onClick={(event) => {
              if (event.target === event.currentTarget) close()
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg">
              <div className="relative aspect-[1.35] w-full overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-soft)] shadow-2xl">
                <FocusedImage
                  src={images[index!].url}
                  alt={`Gallery image ${index! + 1}`}
                  focusX={images[index!].focusX}
                  focusY={images[index!].focusY}
                  zoom={images[index!].zoom}
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-[var(--theme-muted)]">
                <span className="text-xs tabular-nums">
                  {index! + 1} / {images.length}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close gallery viewer"
                  className="flex items-center gap-1.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-panel)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-soft)]"
                >
                  <X className="h-3.5 w-3.5" />
                  Close
                </button>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-panel)] text-[var(--theme-accent)] transition-transform hover:scale-105"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-panel)] text-[var(--theme-accent)] transition-transform hover:scale-105"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
