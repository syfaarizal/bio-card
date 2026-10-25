"use client"

import { useState } from "react"
import { AvatarDecorationPicker, type DecorationId } from "@/components/shared/avatar-decoration"
import { SaveStatus } from "@/components/shared/save-status"
import type { FullProfile } from "@/types"
import { saveProfileDecoration } from "@/actions/profile"
import { Lock } from "lucide-react"

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function DecorationSection({ profile, onUpdate }: Props) {
  const current = (profile.profileEffect ?? "none") as DecorationId
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const handleSelect = async (id: DecorationId) => {
    const effect = id === "none" ? null : id
    onUpdate({ profileEffect: effect })
    setStatus("saving")
    try {
      const result = await saveProfileDecoration(effect)
      if (!result.success) throw new Error("Failed to save profile decoration")
      setStatus("saved")
      setTimeout(() => setStatus("idle"), 2000)
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="decoration" className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 space-y-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Avatar Decoration</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Add a decoration around your profile photo.</p>
        </div>
        <SaveStatus status={status} />
      </div>

      <AvatarDecorationPicker current={current} onSelect={handleSelect} />

      {/* Verified badge — pro placeholder */}
      <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-600" />
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">Aktifkan Verified?</p>
              <p className="text-[10px] text-gray-300 dark:text-zinc-600">Fitur Pro — coming soon</p>
            </div>
          </div>
          {/* Toggle placeholder — non-interactive */}
          <div
            className="w-10 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center px-1 cursor-not-allowed opacity-40"
            title="Pro feature — coming soon"
          >
            <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-zinc-600 shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  )
}
