"use client"

import { useUploadThing } from "@/lib/uploadthing-client"
import { saveImage, deleteImage } from "@/actions/profile"
import { cn } from "@/lib/utils"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

type ImageSlotType = "PROFILE" | "BANNER" | "GALLERY_1" | "GALLERY_2" | "GALLERY_3"

// Legacy support for old MAIN/SECONDARY refs during migration
type AllowedType = ImageSlotType | "MAIN" | "SECONDARY"

interface UploadButtonProps {
  type: AllowedType
  currentUrl?: string | null
  onUploadComplete: (url: string) => void
  onDelete: () => void
}

const ASPECT: Record<AllowedType, string> = {
  PROFILE: "aspect-square",
  BANNER: "aspect-[3/1]",
  GALLERY_1: "aspect-square",
  GALLERY_2: "aspect-square",
  GALLERY_3: "aspect-square",
  MAIN: "aspect-square",
  SECONDARY: "aspect-square",
}

const HEIGHT: Record<AllowedType, string> = {
  PROFILE: "h-28",
  BANNER: "h-24",
  GALLERY_1: "h-28",
  GALLERY_2: "h-28",
  GALLERY_3: "h-28",
  MAIN: "h-28",
  SECONDARY: "h-28",
}

export function UploadButton({ type, currentUrl, onUploadComplete, onDelete }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: async (res) => {
      const url = res[0]?.ufsUrl ?? res[0]?.url
      if (!url) return
      // Map legacy types to new schema
      const dbType = type === "MAIN" ? "PROFILE" : type === "SECONDARY" ? "GALLERY_1" : type
      await saveImage(dbType as ImageSlotType, url)
      onUploadComplete(url)
      setUploading(false)
    },
    onUploadError: (err) => {
      setError(err.message ?? "Upload failed. Please try again or use a different file.")
      setUploading(false)
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError("File too large. Maximum size is 2MB."); return }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, and WebP are supported."); return
    }
    setError(null)
    setUploading(true)
    await startUpload([file])
    e.target.value = ""
  }

  const handleDelete = async () => {
    const dbType = type === "MAIN" ? "PROFILE" : type === "SECONDARY" ? "GALLERY_1" : type
    await deleteImage(dbType as ImageSlotType)
    onDelete()
  }

  const heightClass = HEIGHT[type] ?? "h-28"
  const isBanner = type === "BANNER"

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative group w-full">
          <div className={cn("relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800", heightClass)}>
            <Image
              src={currentUrl}
              alt={type}
              fill
              className={cn("object-cover", isBanner ? "object-center" : "object-cover")}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-medium hover:bg-gray-100 transition-colors">
                <ImagePlus className="w-3.5 h-3.5" />
                Replace
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
              <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label className={cn(
          "flex flex-col items-center justify-center gap-2 w-full rounded-xl border border-dashed cursor-pointer transition-colors",
          heightClass,
          uploading
            ? "border-gray-300 bg-gray-50 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
        )}>
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              <span className="text-xs text-gray-400">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-zinc-400">Click to upload</span>
              <span className="text-[10px] text-gray-400 dark:text-zinc-600">JPG, PNG, WebP · Max 2MB</span>
            </>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  )
}
