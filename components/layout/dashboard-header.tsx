"use client"

import { publishProfile, unpublishProfile } from "@/actions/profile"
import { cn } from "@/lib/utils"
import { Check, ExternalLink, RefreshCw, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardHeaderProps {
  profile: {
    slug: string
    status: string
  }
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-yellow-100 text-yellow-800" },
  PUBLISHED: { label: "Published", className: "bg-green-100 text-green-800" },
  ARCHIVED: { label: "Archived", className: "bg-gray-100 text-gray-600" },
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(profile.status)
  const [error, setError] = useState<string | null>(null)

  const status = STATUS_LABELS[currentStatus] ?? STATUS_LABELS.DRAFT

  const handlePublishToggle = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = currentStatus === "PUBLISHED"
        ? await unpublishProfile()
        : await publishProfile()

      if (!result?.success || !result.status) {
        throw new Error("Profile status could not be updated.")
      }

      setCurrentStatus(result.status)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile status could not be updated.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", status.className)}>
          {status.label}
        </span>
        {profile.slug && (
          <a
            href={`/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            biocard.app/{profile.slug}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          onClick={handlePublishToggle}
          disabled={loading || currentStatus === "ARCHIVED"}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50",
            currentStatus === "PUBLISHED"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-900 text-white hover:bg-gray-700"
          )}
        >
          {currentStatus === "PUBLISHED" ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {loading ? "Saving..." : currentStatus === "PUBLISHED" ? "Published" : "Publish"}
        </button>
      </div>
      {error && <p className="absolute top-14 right-6 text-xs text-red-600">{error}</p>}
    </header>
  )
}
