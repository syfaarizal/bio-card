"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, RotateCcw, X } from "lucide-react"
import { saveImageFocus } from "@/actions/profile"
import { FocusedImage } from "@/components/shared/focused-image"
import { type ImageSlotMeta } from "@/lib/image-slots"
import {
  clamp,
  normalizeFocus,
  roundFocus,
  ZOOM_MAX,
  ZOOM_MIN,
  type ImageFocusValues,
} from "@/lib/image-focus"
import { cn } from "@/lib/utils"

interface Props {
  slot: ImageSlotMeta
  src: string
  initial: ImageFocusValues
  onSaved: (slot: ImageSlotMeta["type"], focus: ImageFocusValues) => void
  onClose: () => void
}

export function FocalPointDialog({ slot, src, initial, onSaved, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const [focus, setFocus] = useState<ImageFocusValues>(initial)
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Dot offset in px relative to the drag surface — the image is letterboxed
  // inside the surface, so percentages of the surface would be wrong.
  const [dot, setDot] = useState({ left: 0, top: 0 })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
  }, [])

  const syncDot = useCallback(() => {
    const img = imgRef.current
    const surface = surfaceRef.current
    if (!img || !surface) return
    const rect = img.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const surfaceRect = surface.getBoundingClientRect()
    setDot({
      left: rect.left - surfaceRect.left + (focus.focusX / 100) * rect.width,
      top: rect.top - surfaceRect.top + (focus.focusY / 100) * rect.height,
    })
  }, [focus.focusX, focus.focusY])

  // The image is letterboxed inside the surface, so the dot is positioned in
  // pixels from the image's own box rather than as a percentage of the surface.
  useEffect(() => {
    syncDot()
  }, [syncDot])

  const [minFocus, maxFocus] = slot.focusRange

  const applyPointer = (clientX: number, clientY: number) => {
    const img = imgRef.current
    if (!img) return
    const rect = img.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    setFocus((prev) => ({
      ...prev,
      focusX: roundFocus(clamp(x, minFocus, maxFocus)),
      focusY: roundFocus(clamp(y, minFocus, maxFocus)),
    }))
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    draggingRef.current = true
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    applyPointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    applyPointer(e.clientX, e.clientY)
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await saveImageFocus({
      type: slot.type,
      focusX: focus.focusX,
      focusY: focus.focusY,
      zoom: focus.zoom,
    })
    setSaving(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    onSaved(slot.type, focus)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      className="fixed inset-0 m-auto p-0 rounded-xl border border-gray-200 bg-white shadow-2xl backdrop:bg-black/50 w-full max-w-2xl h-fit dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50">
              Adjust {slot.label.toLowerCase()}
            </h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Drag the dot to choose what stays in frame. The original file is never changed.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full image — the drag surface */}
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-zinc-600">
              Full image
            </p>
            <div
              ref={surfaceRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className={cn(
                "relative flex h-64 touch-none select-none items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900",
                dragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
              {/* Plain <img>: the drag math needs the element's natural box,
                  not next/image's optimized wrapper. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt=""
                draggable={false}
                onLoad={syncDot}
                className="block max-h-64 max-w-full select-none object-contain"
              />
              <div
                className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.6)]"
                style={{ left: dot.left, top: dot.top }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-gray-400 dark:text-zinc-600">
              Focus {focus.focusX.toFixed(0)}% / {focus.focusY.toFixed(0)}%
              {slot.type === "PROFILE" && " — kept inside the circle crop"}
            </p>
          </div>

          {/* Production preview */}
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-zinc-600">
              Preview
            </p>
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900",
                slot.aspect
              )}
            >
              <FocusedImage
                src={src}
                alt="Framing preview"
                focusX={focus.focusX}
                focusY={focus.focusY}
                zoom={focus.zoom}
                sizes="384px"
              />
            </div>
          </div>
        </div>

        {/* Zoom */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="focus-zoom" className="text-xs font-medium text-gray-600 dark:text-zinc-400">
              Zoom
            </label>
            <span className="text-xs tabular-nums text-gray-400 dark:text-zinc-500">
              {focus.zoom.toFixed(2)}×
            </span>
          </div>
          <input
            id="focus-zoom"
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={0.05}
            value={focus.zoom}
            onChange={(e) =>
              setFocus((prev) => ({ ...prev, zoom: clamp(parseFloat(e.target.value), ZOOM_MIN, ZOOM_MAX) }))
            }
            className="w-full accent-gray-900 dark:accent-zinc-100"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setFocus(normalizeFocus({ focusX: 50, focusY: 50, zoom: 1 }))}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
