export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "login",
  "register",
  "dashboard",
  "logout",
  "forgot-password",
  "reset-password",
  "verify",
  "settings",
  "support",
  "docs",
  "privacy",
  "terms",
  "about",
  "contact",
  "blog",
  "help",
  "status",
  "health",
  "sitemap",
  "robots",
  "404",
  "500",
  "null",
  "undefined",
])

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase())
}
