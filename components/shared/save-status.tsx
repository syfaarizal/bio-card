"use client"

import { cn } from "@/lib/utils"
import { Check, Loader2, AlertCircle } from "lucide-react"

interface SaveStatusProps {
  status: "idle" | "saving" | "saved" | "error"
}

export function SaveStatus({ status }: SaveStatusProps) {
  if (status === "idle") return null

  return (
    <div className={cn(
      "flex items-center gap-1 text-xs transition-all",
      status === "saving" && "text-gray-400",
      status === "saved" && "text-green-600",
      status === "error" && "text-red-600",
    )}>
      {status === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "saved" && <Check className="w-3 h-3" />}
      {status === "error" && <AlertCircle className="w-3 h-3" />}
      <span>
        {status === "saving" && "Saving…"}
        {status === "saved" && "Saved"}
        {status === "error" && "Failed to save. Retry?"}
      </span>
    </div>
  )
}
