"use client"

import type { FullProfile } from "@/types"
import { UploadButton } from "@/components/shared/upload-button"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

type SlotType = "PROFILE" | "BANNER" | "GALLERY_1" | "GALLERY_2" | "GALLERY_3"

const SLOTS: { type: SlotType; label: string; hint: string }[] = [
  { type: "PROFILE", label: "Profile Photo", hint: "Your main avatar image" },
  { type: "BANNER", label: "Banner", hint: "Landscape banner behind your avatar" },
  { type: "GALLERY_1", label: "Post 1", hint: "Gallery image 1" },
  { type: "GALLERY_2", label: "Post 2", hint: "Gallery image 2" },
  { type: "GALLERY_3", label: "Post 3", hint: "Gallery image 3" },
]

export function ImagesSection({ profile, onUpdate }: Props) {
  type ImageItem = { id: string; profileId: string; type: string; url: string }

  const getPhoto = (type: SlotType) =>
    profile.images.find((img: ImageItem) => img.type === type)

  const handleUpload = (type: SlotType, url: string) => {
    const updatedImages = [
      ...profile.images.filter((img: ImageItem) => img.type !== type),
      { id: `temp-${type}`, profileId: profile.id, type, url },
    ]
    onUpdate({ images: updatedImages })
  }

  const handleDelete = (type: SlotType) => {
    const updatedImages = profile.images.filter((img: ImageItem) => img.type !== type)
    onUpdate({ images: updatedImages })
  }

  return (
    <section id="images" className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 space-y-5 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Images</h2>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
          Upload up to 5 images — profile photo, banner, and 3 gallery posts.
        </p>
      </div>

      {SLOTS.map(({ type, label, hint }) => (
        <div key={type}>
          <div className="mb-1.5">
            <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400">{label}</label>
            <p className="text-[10px] text-gray-400 dark:text-zinc-600">{hint}</p>
          </div>
          <UploadButton
            type={type}
            currentUrl={getPhoto(type)?.url}
            onUploadComplete={(url) => handleUpload(type, url)}
            onDelete={() => handleDelete(type)}
          />
        </div>
      ))}
    </section>
  )
}
