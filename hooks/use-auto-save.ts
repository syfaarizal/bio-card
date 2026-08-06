"use client"

import { useState, useEffect, useRef } from "react"
import { useDebounce } from "./use-debounce"

type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number
  enabled?: boolean
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 1500,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const debouncedData = useDebounce(data, delay)
  const isFirstRender = useRef(true)
  const savedDataRef = useRef<T>(data)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!enabled) return

    // Skip if data hasn't changed
    if (JSON.stringify(debouncedData) === JSON.stringify(savedDataRef.current)) return

    const save = async () => {
      setStatus("saving")
      try {
        await onSave(debouncedData)
        savedDataRef.current = debouncedData
        setStatus("saved")
        setTimeout(() => setStatus("idle"), 2000)
      } catch {
        setStatus("error")
      }
    }

    save()
  }, [debouncedData, enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return { status }
}
