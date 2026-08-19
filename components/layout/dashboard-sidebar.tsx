"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/actions/auth"
import { User, Link2, Music, Image, BarChart2, Settings, LogOut, ChevronDown, Crown, Palette } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  username: string
  profileStatus: string
  slug: string
}

export function DashboardSidebar({ username, profileStatus, slug }: SidebarProps) {
  const pathname = usePathname()
  const [editorOpen, setEditorOpen] = useState(true)

  const editorLinks = [
    { href: "/dashboard/profile#identity", label: "Identity", icon: User },
    { href: "/dashboard/profile#theme", label: "Theme", icon: Palette },
    { href: "/dashboard/profile#social", label: "Social Links", icon: Link2 },
    { href: "/dashboard/profile#music", label: "Music", icon: Music },
    { href: "/dashboard/profile#images", label: "Images", icon: Image },
  ]

  const isEditorActive = pathname.startsWith("/dashboard/profile")

  const STATUS_DOT: Record<string, string> = {
    PUBLISHED: "bg-green-500",
    DRAFT: "bg-yellow-400",
    ARCHIVED: "bg-gray-300",
  }

  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-gray-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-950 lg:w-60 lg:border-b-0 lg:border-r">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-gray-200 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center dark:bg-white">
            <span className="text-white text-xs font-bold dark:text-zinc-950">B</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-zinc-50">BioCard</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:py-4 lg:space-y-1">

        {/* Edit Profile — collapsible */}
        <button
          onClick={() => setEditorOpen(!editorOpen)}
          className={cn(
            "flex min-w-max items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors lg:w-full",
            isEditorActive
              ? "bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          <span>Edit Profile</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              editorOpen && "rotate-180"
            )}
          />
        </button>

        {editorOpen && (
          <div className="flex gap-1 lg:block lg:pl-3 lg:space-y-0.5">
            {editorLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex min-w-max items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Analytics */}
        <Link
          href="/dashboard/analytics"
          className={cn(
            "flex min-w-max items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
            pathname === "/dashboard/analytics"
              ? "bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          <BarChart2 className="w-4 h-4" />
          Analytics
        </Link>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex min-w-max items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      {/* Bottom */}
      <div className="hidden p-3 border-t border-gray-200 space-y-2 dark:border-zinc-800 lg:block">

        {/* Profile status + public link */}
        <div className={cn("rounded-xl border px-3 py-2.5", "border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/70")}>
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[profileStatus] ?? "bg-gray-300")} />
            <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">
              {profileStatus === "PUBLISHED" ? "Live" : profileStatus === "DRAFT" ? "Draft" : "Archived"}
            </p>
          </div>
          {profileStatus === "PUBLISHED" && slug && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors truncate block dark:text-zinc-500 dark:hover:text-zinc-200"
            >
              biocard.app/{slug} ↗
            </a>
          )}
        </div>

        {/* Upgrade placeholder */}
        <div className="rounded-xl border border-dashed border-gray-200 px-3 py-2.5 opacity-40 cursor-not-allowed select-none dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-zinc-100">Upgrade to Pro</p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500">Coming soon</p>
            </div>
          </div>
        </div>

        {/* User + logout */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-400 truncate dark:text-zinc-500">@{username}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Log out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
