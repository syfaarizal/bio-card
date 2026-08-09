import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { recordView } from "@/actions/analytics"
import { PublicProfilePage } from "@/features/public/public-profile-page"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const profile = await prisma.profile.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { images: true },
  })

  if (!profile) return { title: "Profile not found" }

  const mainPhoto = profile.images.find(
    (img: { type: string; url: string }) => img.type === "MAIN"
  )

  const title = profile.displayName ?? profile.slug
  const description =
    profile.bio ?? `Check out ${title}'s BioCard.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: mainPhoto ? [{ url: mainPhoto.url, width: 1200, height: 630, alt: title }] : [],
      type: "profile",
      siteName: "BioCard",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainPhoto ? [mainPhoto.url] : [],
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const profile = await prisma.profile.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      links: true,
      music: true,
      images: true,
      user: { select: { username: true, email: true } },
    },
  })

  if (!profile) notFound()

  // Fire and forget — don't block render
  recordView(profile.id).catch(() => {})

  return <PublicProfilePage profile={profile} />
}
