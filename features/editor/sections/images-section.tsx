"use client"

import type { FullProfile } from "@/types"
import { ImagePlus } from "lucide-react"
import Image from "next/image"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function ImagesSection({ profile }: Props) {
  const mainPhoto = profile.images.find((img: { type: string; url: string; id: string }) => img.type === "MAIN")
  const secondaryPhoto = profile.images.find((img: { type: string; url: string; id: string }) => img.type === "SECONDARY")

  // UploadThing integration will be wired here in Sprint 2
  return (
    <section id="images" className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Images</h2>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Main Photo</label>
        {mainPhoto ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
            <Image src={mainPhoto.url} alt="Main photo" fill className="object-cover" />
          </div>
        ) : (
          <button className="flex items-center gap-2 w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
            <ImagePlus className="w-4 h-4" />
            Upload main photo
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Secondary Photo</label>
        {secondaryPhoto ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
            <Image src={secondaryPhoto.url} alt="Secondary photo" fill className="object-cover" />
          </div>
        ) : (
          <button className="flex items-center gap-2 w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
            <ImagePlus className="w-4 h-4" />
            Upload secondary photo
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">JPG, PNG, or WebP. Max 2MB each. Upload integration coming in Sprint 2.</p>
    </section>
  )
}
