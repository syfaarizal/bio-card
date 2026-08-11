"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"

const THEME_CHANGE_EVENT = "biocard-theme-change"

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light"

  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function subscribeToThemeChange(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToThemeChange, getThemeSnapshot, () => "light")

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    applyTheme(nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
