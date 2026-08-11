"use client"

import { THEMES } from "@/types"
import { saveProfileIdentity } from "@/actions/profile"
import { cn } from "@/lib/utils"
import type { FullProfile } from "@/types"

const THEME_COLORS: Record<string, string> = {
  default: "#ffffff",
  midnight: "#0f0f1a",
  rose: "#fff1f2",
  cyber: "#020617",
  glass: "#f8faff",
}

const THEME_DOT_COLORS: Record<string, string> = {
  default: "#111111",
  midnight: "#a5b4fc",
  rose: "#be185d",
  cyber: "#22d3ee",
  glass: "#7c3aed",
}

interface Props {
  profile: FullProfile
  onUpdate: (updates: Partial<FullProfile>) => void
}

export function ThemeSection({ profile, onUpdate }: Props) {
  const handleThemeChange = async (themeId: string) => {
    onUpdate({ themeId })
    await saveProfileIdentity({
      displayName: profile.displayName ?? "",
      slug: profile.slug,
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      birthdayDay: "",
      birthdayMonth: "",
      birthdayYear: "",
      tags: profile.tags.join(", "),
      themeId,
    })
  }

  return (
    <section id="theme" className="bg-white rounded-xl border border-gray-200 p-5 transition-colors dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-gray-900 mb-4 dark:text-zinc-50">Theme Color</h2>
      <div className="flex gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            title={theme.name}
            className={cn(
              "w-9 h-9 rounded-full border-2 transition-all",
              profile.themeId === theme.id
                ? "border-gray-900 scale-110 dark:border-zinc-100"
                : "border-gray-200 hover:border-gray-400 dark:border-zinc-700 dark:hover:border-zinc-500"
            )}
            style={{ backgroundColor: THEME_COLORS[theme.id] }}
          >
            <span
              className="block w-3 h-3 rounded-full mx-auto"
              style={{ backgroundColor: THEME_DOT_COLORS[theme.id] }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
