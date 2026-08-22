import type { ProviderId } from "./providers"
import { PROVIDERS } from "./providers"

/**
 * Validate URL for safety
 * - Must be valid URL
 * - Only allow safe protocols (https, http)
 * - Reject dangerous protocols (javascript:, data:, vbscript:, etc.)
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { valid: false, error: "URL is required" }
  }

  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: "Invalid URL format" }
  }
}

/**
 * Detect provider from URL hostname
 * Returns the provider ID or 'custom' if not recognized
 */
export function detectProvider(url: string): ProviderId {
  if (!url) return "custom"

  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()

    for (const [providerId, config] of Object.entries(PROVIDERS)) {
      if (providerId === "custom" || providerId === "portfolio") continue

      for (const pattern of config.patterns) {
        if (hostname === pattern.toLowerCase() || hostname.endsWith("." + pattern.toLowerCase())) {
          return providerId as ProviderId
        }
      }
    }

    return "custom"
  } catch {
    return "custom"
  }
}

/**
 * Get default label for a provider
 */
export function getDefaultLabel(provider: ProviderId): string {
  return PROVIDERS[provider]?.label ?? "Link"
}

/**
 * Format URL to ensure it has a protocol
 */
export function normalizeUrl(url: string): string {
  if (!url) return ""

  url = url.trim()

  // If no protocol, add https://
  if (!url.match(/^https?:\/\//i)) {
    return "https://" + url
  }

  return url
}
