"use client"

import { useLayoutEffect } from "react"

export function ThemeInitializer() {
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark" || (!savedTheme && prefersDark),
    )
  }, [])

  return null
}
