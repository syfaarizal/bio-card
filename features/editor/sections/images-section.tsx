"use client"

import type { FullProfile } from "@/types"
import { UploadButton } from "@/components/shared/upload-button"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function ImagesSection({ profile, onUpdate }: Props) {
  type ImageItem = { id: string; profileId: string; type: string; url: string }

  const mainPhoto = profile.images.find((img: ImageItem) => img.type === "MAIN")
  const secondaryPhoto = profile.images.find((img: ImageItem) => img.type === "SECONDARY")

  const handleUpload = (type: "MAIN" | "SECONDARY", url: string) => {
    const updatedImages = [
      ...profile.images.filter((img: ImageItem) => img.type !== type),
      { id: `temp-${type}`, profileId: profile.id, type, url },
    ]
    onUpdate({ images: updatedImages })
  }

  const handleDelete = (type: "MAIN" | "SECONDARY") => {
    const updatedImages = profile.images.filter((img: ImageItem) => img.type !== type)
    onUpdate({ images: updatedImages })
  }

  return (
    <section id="images" className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Images</h2>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Main Photo</label>
        <UploadButton
          type="MAIN"
          currentUrl={mainPhoto?.url}
          onUploadComplete={(url) => handleUpload("MAIN", url)}
          onDelete={() => handleDelete("MAIN")}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Secondary Photo</label>
        <UploadButton
          type="SECONDARY"
          currentUrl={secondaryPhoto?.url}
          onUploadComplete={(url) => handleUpload("SECONDARY", url)}
          onDelete={() => handleDelete("SECONDARY")}
        />
      </div>
    </section>
  )
}
