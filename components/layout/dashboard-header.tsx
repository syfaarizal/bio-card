"use client"

import { publishProfile, unpublishProfile } from "@/actions/profile"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"
import { Check, ExternalLink, RefreshCw, Send } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  profile: {
    slug: string
    status: string
  }
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300" },
  PUBLISHED: { label: "Published", className: "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300" },
  ARCHIVED: { label: "Archived", className: "bg-gray-100 text-gray-600 dark:bg-zinc-900 dark:text-zinc-400" },
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
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white flex-shrink-0 transition-colors dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", status.className)}>
          {status.label}
        </span>
        {profile.slug && (
          <a
            href={`/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors dark:text-zinc-500 dark:hover:text-zinc-200"
          >
            biocard.app/{profile.slug}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          onClick={handlePublishToggle}
          disabled={loading}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50",
            currentStatus === "PUBLISHED"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
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
      {error && <p className="absolute top-14 right-6 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </header>
  )
}
