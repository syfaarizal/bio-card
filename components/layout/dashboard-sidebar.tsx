"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/actions/auth"
import {
  User, Link2, Music, Image, BarChart2, Settings, LogOut, ChevronDown, Crown
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  username: string
}

export function DashboardSidebar({ username }: SidebarProps) {
  const pathname = usePathname()
  const [editorOpen, setEditorOpen] = useState(true)

  const editorLinks = [
    { href: "/dashboard/profile#identity", label: "Identity", icon: User },
    { href: "/dashboard/profile#theme", label: "Theme", icon: null },
    { href: "/dashboard/profile#social", label: "Social Links", icon: Link2 },
    { href: "/dashboard/profile#music", label: "Music", icon: Music },
    { href: "/dashboard/profile#images", label: "Images", icon: Image },
  ]

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="font-semibold text-gray-900">BioCard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Edit Profile collapsible */}
        <button
          onClick={() => setEditorOpen(!editorOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith("/dashboard/profile")
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <span>Edit Profile</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", editorOpen && "rotate-180")} />
        </button>

        {editorOpen && (
          <div className="pl-4 space-y-0.5">
            {editorLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/dashboard/analytics"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/dashboard/analytics"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <BarChart2 className="w-4 h-4" />
          Analytics
        </Link>

        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        {/* Upgrade placeholder */}
        <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2.5 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs font-medium text-gray-900">Upgrade to Pro</p>
              <p className="text-xs text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>

        {/* User + logout */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-500 truncate">@{username}</span>
          <form action={logoutAction}>
            <button type="submit" className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
