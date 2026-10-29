import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  buildObjectPosition,
  buildStageStyle,
  normalizeFocus,
  scaleSizes,
  type ImageFocusValues,
} from "@/lib/image-focus"

type Props = {
  src: string
  alt: string
  focusX?: number | null
  focusY?: number | null
  zoom?: number | null
  sizes?: string
  priority?: boolean
  className?: string
}
/**
 * Single renderer for every framed image so the editor preview and the public
 * page can never drift apart.
 *
 * The focal point and zoom are applied by resizing the clipping container
 * (the "stage"), never by transforming the image — see lib/image-focus.ts.
 */
export function FocusedImage({
  src,
  alt,
  focusX,
  focusY,
  zoom,
  sizes = "100vw",
  priority,
  className,
}: Props) {
  const focus: ImageFocusValues = normalizeFocus({ focusX, focusY, zoom })

  return (
    <div style={buildStageStyle(focus)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={scaleSizes(sizes, focus.zoom)}
        className={cn("object-cover", className)}
        style={{ objectPosition: buildObjectPosition(focus) }}
      />
    </div>
  )
}
