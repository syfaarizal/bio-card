import type { CSSProperties } from "react"

export const FOCUS_MIN = 0
export const FOCUS_MAX = 100
export const ZOOM_MIN = 1
export const ZOOM_MAX = 3

export const DEFAULT_FOCUS_X = 50
export const DEFAULT_FOCUS_Y = 50
export const DEFAULT_ZOOM = 1

export type ImageFocusValues = {
  focusX: number
  focusY: number
  zoom: number
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function roundFocus(value: number): number {
  return Math.round(value * 10) / 10
}

export function normalizeFocus(
  value: Partial<Record<keyof ImageFocusValues, number | null>> | null | undefined
): ImageFocusValues {
  return {
    focusX: clamp(roundFocus(value?.focusX ?? DEFAULT_FOCUS_X), FOCUS_MIN, FOCUS_MAX),
    focusY: clamp(roundFocus(value?.focusY ?? DEFAULT_FOCUS_Y), FOCUS_MIN, FOCUS_MAX),
    zoom: clamp(value?.zoom ?? DEFAULT_ZOOM, ZOOM_MIN, ZOOM_MAX),
  }
}

export function isDefaultFocus(value: ImageFocusValues): boolean {
  return (
    value.focusX === DEFAULT_FOCUS_X &&
    value.focusY === DEFAULT_FOCUS_Y &&
    value.zoom === DEFAULT_ZOOM
  )
}

export function buildObjectPosition(value: ImageFocusValues): string {
  return `${value.focusX}% ${value.focusY}%`
}

/**
 * Framing is applied by resizing the container that clips the image, not the
 * image itself. `transform: scale()` would scale the already-cropped raster
 * and expose empty bands whenever the focal point is off-center.
 *
 * Derivation for one axis. Frame length B, stage length S = zoom * B, stage
 * offset L inside the frame. `object-position: fx%` puts the fx-fraction point
 * of the image at the fx-fraction point of its box, so inside the stage the
 * focal point sits at fx * S. We want it at fx * B of the frame:
 *
 *   L + fx * S = fx * B  =>  L = fx * (1 - zoom) * B
 *
 * Expressed as a percentage of the frame (focusX is 0..100), that is
 * focusX * (1 - zoom)%. Since 0 <= fx <= 1 and zoom >= 1, L <= 0 and
 * L + S >= B, so the stage always covers the whole frame — no empty band is
 * ever exposed. zoom = 1 is an exact no-op (stage = 100% x 100% at offset 0).
 */
export function buildStageStyle(value: ImageFocusValues): CSSProperties {
  const { focusX, focusY, zoom } = value
  return {
    position: "absolute",
    left: `${focusX * (1 - zoom)}%`,
    top: `${focusY * (1 - zoom)}%`,
    width: `${zoom * 100}%`,
    height: `${zoom * 100}%`,
  }
}

/**
 * Scales the size list of a next/image `sizes` string so the browser fetches
 * a raster large enough for the magnified crop. Media conditions are left
 * untouched — only the size of each entry is scaled.
 */
export function scaleSizes(sizes: string, factor: number): string {
  if (factor <= 1) return sizes

  // Split on commas that are not inside a media condition.
  const entries: string[] = []
  let depth = 0
  let current = ""
  for (const char of sizes) {
    if (char === "(") depth++
    else if (char === ")") depth--
    if (char === "," && depth === 0) {
      entries.push(current)
      current = ""
      continue
    }
    current += char
  }
  entries.push(current)

  return entries
    .map((entry) => {
      const conditionEnd = entry.lastIndexOf(")")
      const head = conditionEnd === -1 ? "" : entry.slice(0, conditionEnd + 1)
      const size = conditionEnd === -1 ? entry : entry.slice(conditionEnd + 1)
      const scaled = size.replace(
        /(\d+(?:\.\d+)?)(px|vw)/g,
        (_, num: string, unit: string) => `${Math.round(parseFloat(num) * factor)}${unit}`
      )
      return head + scaled
    })
    .join(", ")
}
