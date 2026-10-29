"use client"

import { useUploadThing } from "@/lib/uploadthing-client"
import { saveImage, deleteImage } from "@/actions/profile"
import { cn } from "@/lib/utils"
import { ImagePlus, Loader2, Trash2, Crosshair } from "lucide-react"
import { useState } from "react"
import { FocusedImage } from "@/components/shared/focused-image"
import type { ImageSlotType } from "@/lib/image-slots"
import type { ImageFocusValues } from "@/lib/image-focus"

// Legacy support for old MAIN/SECONDARY refs during migration
type AllowedType = ImageSlotType | "MAIN" | "SECONDARY"

interface UploadButtonProps {
  type: AllowedType
  currentUrl?: string | null
  focus?: ImageFocusValues
  onAdjust?: () => void
  onUploadComplete: (url: string) => void
  onDelete: () => void
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

function toDbType(type: AllowedType): ImageSlotType {
  if (type === "MAIN") return "PROFILE"
  if (type === "SECONDARY") return "GALLERY_1"
  return type
}

export function UploadButton({
  type,
  currentUrl,
  focus,
  onAdjust,
  onUploadComplete,
  onDelete,
}: UploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: async (res) => {
      const url = res[0]?.ufsUrl ?? res[0]?.url
      if (!url) return
      await saveImage(toDbType(type), url)
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
    await deleteImage(toDbType(type))
    onDelete()
  }

  const heightClass = HEIGHT[type] ?? "h-28"

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative group w-full">
          <div className={cn("relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800", heightClass)}>
            <FocusedImage
              src={currentUrl}
              alt={type}
              focusX={focus?.focusX}
              focusY={focus?.focusY}
              zoom={focus?.zoom}
              sizes="384px"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100">
                <ImagePlus className="w-3.5 h-3.5" />
                Replace
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
              {onAdjust && (
                <button
                  type="button"
                  onClick={onAdjust}
                  className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  Adjust
                </button>
              )}
              <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600">
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors",
          heightClass,
          uploading
            ? "cursor-not-allowed border-gray-300 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
        )}>
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
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
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
