export const IMAGE_SLOT_TYPES = [
  "PROFILE",
  "BANNER",
  "GALLERY_1",
  "GALLERY_2",
  "GALLERY_3",
] as const

export type ImageSlotType = (typeof IMAGE_SLOT_TYPES)[number]

export type ImageSlotMeta = {
  type: ImageSlotType
  label: string
  hint: string
  /** Tailwind aspect class mirroring the production container. */
  aspect: string
  /** Max rendered width in px — feeds next/image `sizes`. */
  maxWidth: number
  /**
   * Allowed focal point range. The avatar is cropped to a circle, so a focus
   * near the corner would land on pixels the circle cuts away.
   */
  focusRange: [number, number]
}

export const IMAGE_SLOTS: ImageSlotMeta[] = [
  {
    type: "PROFILE",
    label: "Profile Photo",
    hint: "Your main avatar image",
    aspect: "aspect-square",
    maxWidth: 128,
    focusRange: [10, 90],
  },
  {
    type: "BANNER",
    label: "Banner",
    hint: "Landscape banner behind your avatar",
    aspect: "aspect-[3/1]",
    maxWidth: 768,
    focusRange: [0, 100],
  },
  {
    type: "GALLERY_1",
    label: "Post 1",
    hint: "Gallery image 1",
    aspect: "aspect-[1.35]",
    maxWidth: 384,
    focusRange: [0, 100],
  },
  {
    type: "GALLERY_2",
    label: "Post 2",
    hint: "Gallery image 2",
    aspect: "aspect-[1.35]",
    maxWidth: 384,
    focusRange: [0, 100],
  },
  {
    type: "GALLERY_3",
    label: "Post 3",
    hint: "Gallery image 3",
    aspect: "aspect-[1.35]",
    maxWidth: 384,
    focusRange: [0, 100],
  },
]

export function getImageSlot(type: string): ImageSlotMeta | undefined {
  return IMAGE_SLOTS.find((slot) => slot.type === type)
}
