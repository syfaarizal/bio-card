"use client"

import { cn } from "@/lib/utils"
import { Monitor, Tablet, Smartphone } from "lucide-react"

export type DeviceMode = "desktop" | "tablet" | "mobile"

interface DeviceSwitcherProps {
  current: DeviceMode
  onChange: (mode: DeviceMode) => void
}

const DEVICES: { mode: DeviceMode; icon: React.ElementType; label: string }[] = [
  { mode: "desktop", icon: Monitor, label: "Desktop" },
  { mode: "tablet", icon: Tablet, label: "Tablet" },
  { mode: "mobile", icon: Smartphone, label: "Mobile" },
]

export function DeviceSwitcher({ current, onChange }: DeviceSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {DEVICES.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          title={label}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md transition-all",
            current === mode
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  )
}
