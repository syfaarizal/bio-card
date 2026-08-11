"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"

  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
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
