"use server"

import { prisma } from "@/lib/prisma"
import { parseReferrer } from "@/types"
import { headers } from "next/headers"

export async function recordView(profileId: string) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const referrer = headersList.get("referer") ?? null
  const userAgent = headersList.get("user-agent") ?? null

  // Anti-spam: 30 min cooldown per IP per profile
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  const recentView = await prisma.viewLog.findFirst({
    where: {
      profileId,
      ip,
      viewedAt: { gte: thirtyMinutesAgo },
    },
  })

  if (recentView) return

  // Detect device
  let device = "desktop"
  if (userAgent) {
    if (/mobile/i.test(userAgent)) device = "mobile"
    else if (/tablet|ipad/i.test(userAgent)) device = "tablet"
  }

  await prisma.viewLog.create({
    data: { profileId, ip, referrer, device },
  })
}

export async function getAnalytics(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return null

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [total, today, thisWeek, thisMonth, allViews] = await Promise.all([
    prisma.viewLog.count({ where: { profileId: profile.id } }),
    prisma.viewLog.count({ where: { profileId: profile.id, viewedAt: { gte: todayStart } } }),
    prisma.viewLog.count({ where: { profileId: profile.id, viewedAt: { gte: weekStart } } }),
    prisma.viewLog.count({ where: { profileId: profile.id, viewedAt: { gte: monthStart } } }),
    prisma.viewLog.findMany({
      where: { profileId: profile.id },
      select: { referrer: true, device: true, viewedAt: true },
    }),
  ])

  // ── Top referrers ──
  const referrerCounts: Record<string, number> = {}
  for (const view of allViews) {
    const source = parseReferrer(view.referrer)
    referrerCounts[source] = (referrerCounts[source] ?? 0) + 1
  }
  const topReferrer = Object.entries(referrerCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)

  // ── Device breakdown ──
  const deviceCounts: Record<string, number> = {}
  for (const view of allViews) {
    const d = view.device ?? "desktop"
    deviceCounts[d] = (deviceCounts[d] ?? 0) + 1
  }
  const deviceBreakdown = Object.entries(deviceCounts)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count)

  // ── Weekly views (last 7 days, one bucket per day) ──
  const weeklyMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0] // "YYYY-MM-DD"
    weeklyMap[key] = 0
  }
  for (const view of allViews) {
    if (view.viewedAt >= weekStart) {
      const key = view.viewedAt.toISOString().split("T")[0]
      if (key in weeklyMap) {
        weeklyMap[key] = (weeklyMap[key] ?? 0) + 1
      }
    }
  }
  const weeklyViews = Object.entries(weeklyMap).map(([date, count]) => ({ date, count }))

  return {
    total,
    today,
    thisWeek,
    thisMonth,
    topReferrer,
    deviceBreakdown,
    weeklyViews,
  }
}
