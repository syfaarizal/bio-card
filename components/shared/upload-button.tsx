"use client"

import { useUploadThing } from "@/lib/uploadthing-client"
import { saveImage, deleteImage } from "@/actions/profile"
import { cn } from "@/lib/utils"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface UploadButtonProps {
  type: "MAIN" | "SECONDARY"
  currentUrl?: string | null
  onUploadComplete: (url: string) => void
  onDelete: () => void
}

export function UploadButton({ type, currentUrl, onUploadComplete, onDelete }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: async (res) => {
      const url = res[0]?.ufsUrl ?? res[0]?.url
      if (!url) return
      await saveImage(type, url)
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

    // Client-side validation
    if (file.size > 2 * 1024 * 1024) {
      setError("File too large. Maximum size is 2MB.")
      return
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, and WebP are supported.")
      return
    }

    setError(null)
    setUploading(true)
    await startUpload([file])

    // Reset input so same file can be re-selected
    e.target.value = ""
  }

  const handleDelete = async () => {
    await deleteImage(type)
    onDelete()
  }

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative group w-full">
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={currentUrl}
              alt={type === "MAIN" ? "Main photo" : "Secondary photo"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-medium hover:bg-gray-100 transition-colors">
                <ImagePlus className="w-3.5 h-3.5" />
                Replace
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label className={cn(
          "flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border border-dashed cursor-pointer transition-colors",
          uploading
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}>
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              <span className="text-xs text-gray-400">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">
                Click to upload {type === "MAIN" ? "main photo" : "secondary photo"}
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, WebP · Max 2MB</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
