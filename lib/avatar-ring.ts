/**
 * Geometry of the avatar ring, shared by the profile card and the decoration
 * picker.
 *
 * The decoration overlays all draw into the same 120×120 viewBox, stretched
 * over the avatar box, so the avatar's outer edge is the circle of radius 60.
 * The ring band sits a couple of units inside that, and the avatar photo has
 * to stop where the band starts — otherwise the image spills out past its own
 * border and the band reads as a stroke drawn over the image rather than as
 * the image's edge.
 */

export type DecorationId = "none" | "sakura" | "cyber" | "angel" | "ember" | "moon"

/** Radius of the ring's centre line, in viewBox units. */
const RING_R = 57

/** Width of the ring band, in viewBox units. */
const RING_W = 5

/**
 * Radius, in viewBox units, at which the photo has to stop for each
 * decoration, so the decoration's own band becomes the photo's border.
 *
 * Each decoration draws its band at a slightly different width, so each one
 * has its own photo radius.
 */
const PHOTO_INNER_R: Record<DecorationId, number> = {
  none: RING_R - RING_W / 2, // 54.5 — the plain ring
  sakura: RING_R - 1.5, // 55.5 — the base ring is thinner
  cyber: RING_R - RING_W / 2, // 54.5
  angel: RING_R - RING_W / 2, // 54.5
  ember: RING_R - RING_W / 2, // 54.5
  moon: RING_R - 1.25, // 55.75 — the slim rim
}

/**
 * Diameter of the photo circle as a percentage of the avatar box, sized so the
 * photo ends exactly where the decoration's band begins.
 */
export function avatarPhotoSize(id: DecorationId): number {
  return (PHOTO_INNER_R[id] / 60) * 100
}
