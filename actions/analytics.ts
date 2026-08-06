"use server"

import { prisma } from "@/lib/prisma"
import { parseReferrer } from "@/types"
import { headers } from "next/headers"

export async function recordView(profileId: string) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const referrer = headersList.get("referer") ?? null
  const userAgent = headersList.get("user-agent") ?? null

  // Anti-spam: check if same IP visited in last 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  const recentView = await prisma.viewLog.findFirst({
    where: {
      profileId,
      ip,
      viewedAt: { gte: thirtyMinutesAgo },
    },
  })

  if (recentView) return // already counted

  // Detect device type (simple heuristic)
  let device = "desktop"
  if (userAgent) {
    if (/mobile/i.test(userAgent)) device = "mobile"
    else if (/tablet|ipad/i.test(userAgent)) device = "tablet"
  }

  await prisma.viewLog.create({
    data: {
      profileId,
      ip,
      referrer,
      device,
    },
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
      select: { referrer: true },
    }),
  ])

  // Count referrer sources
  const referrerCounts: Record<string, number> = {}
  for (const view of allViews) {
    const source = parseReferrer(view.referrer)
    referrerCounts[source] = (referrerCounts[source] ?? 0) + 1
  }

  const topReferrer = Object.entries(referrerCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)

  return { total, today, thisWeek, thisMonth, topReferrer }
}
