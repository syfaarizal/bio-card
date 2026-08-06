import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://biocard.app"

  const profiles = await prisma.profile.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  })

  const profileUrls = profiles.map(({ slug, updatedAt }: { slug: string; updatedAt: Date }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    ...profileUrls,
  ]
}
