"use client"

import { useState } from "react"
import type { FullProfile, Image } from "@/types"
import { UploadButton } from "@/components/shared/upload-button"
import { FocalPointDialog } from "@/features/editor/focal-point-dialog"
import { IMAGE_SLOTS, type ImageSlotType } from "@/lib/image-slots"
import { DEFAULT_FOCUS_X, DEFAULT_FOCUS_Y, DEFAULT_ZOOM } from "@/lib/image-focus"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function ImagesSection({ profile, onUpdate }: Props) {
  const [adjusting, setAdjusting] = useState<ImageSlotType | null>(null)

  const getPhoto = (type: ImageSlotType) =>
    profile.images.find((img: Image) => img.type === type)

  const handleUpload = (type: ImageSlotType, url: string) => {
    const updatedImages = [
      ...profile.images.filter((img: Image) => img.type !== type),
      {
        id: `temp-${type}`,
        profileId: profile.id,
        type,
        url,
        focusX: DEFAULT_FOCUS_X,
        focusY: DEFAULT_FOCUS_Y,
        zoom: DEFAULT_ZOOM,
      },
    ]
    onUpdate({ images: updatedImages })
  }

  const handleDelete = (type: ImageSlotType) => {
    const updatedImages = profile.images.filter((img: Image) => img.type !== type)
    onUpdate({ images: updatedImages })
  }

  const handleFocusSaved = (type: ImageSlotType, focus: { focusX: number; focusY: number; zoom: number }) => {
    const updatedImages = profile.images.map((img: Image) =>
      img.type === type ? { ...img, ...focus } : img
    )
    onUpdate({ images: updatedImages })
  }

  const adjustingSlot = IMAGE_SLOTS.find((slot) => slot.type === adjusting)
  const adjustingPhoto = adjusting ? getPhoto(adjusting) : undefined

  return (
    <section id="images" className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Images</h2>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
          Upload up to 5 images — profile photo, banner, and 3 gallery posts.
        </p>
      </div>

      {IMAGE_SLOTS.map(({ type, label, hint }) => {
        const photo = getPhoto(type)
        return (
          <div key={type}>
            <div className="mb-1.5">
              <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400">{label}</label>
              <p className="text-[10px] text-gray-400 dark:text-zinc-600">{hint}</p>
            </div>
            <UploadButton
              type={type}
              currentUrl={photo?.url}
              focus={photo ? { focusX: photo.focusX, focusY: photo.focusY, zoom: photo.zoom } : undefined}
              onAdjust={photo ? () => setAdjusting(type) : undefined}
              onUploadComplete={(url) => handleUpload(type, url)}
              onDelete={() => handleDelete(type)}
            />
          </div>
        )
      })}

      {adjustingSlot && adjustingPhoto && (
        <FocalPointDialog
          slot={adjustingSlot}
          src={adjustingPhoto.url}
          initial={{
            focusX: adjustingPhoto.focusX,
            focusY: adjustingPhoto.focusY,
            zoom: adjustingPhoto.zoom,
          }}
          onSaved={handleFocusSaved}
          onClose={() => setAdjusting(null)}
        />
      )}
    </section>
  )
}
