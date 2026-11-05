import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getActiveSinceYear(date: Date | string): number {
  return new Date(date).getUTCFullYear()
}
