import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProfilePreview } from "@/features/preview/profile-preview"
import { recordView } from "@/actions/analytics"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = await prisma.profile.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { images: true, user: true },
  })

  if (!profile) return { title: "Profile not found" }

  const mainPhoto = profile.images.find((img: { type: string; url: string; id: string }) => img.type === "MAIN")

  return {
    title: profile.displayName ?? profile.slug,
    description: profile.bio ?? `Check out ${profile.displayName ?? profile.slug}'s BioCard.`,
    openGraph: {
      title: profile.displayName ?? profile.slug,
      description: profile.bio ?? `Check out ${profile.displayName ?? profile.slug}'s BioCard.`,
      images: mainPhoto ? [{ url: mainPhoto.url }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: profile.displayName ?? profile.slug,
      description: profile.bio ?? undefined,
      images: mainPhoto ? [mainPhoto.url] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
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

  // Record view (fire and forget)
  recordView(profile.id).catch(() => {})

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <ProfilePreview profile={profile} />
        <p className="text-center text-xs text-gray-400 mt-4">
          Made with{" "}
          <a href="/" className="underline hover:text-gray-600 transition-colors">
            BioCard
          </a>
        </p>
      </div>
    </div>
  )
}
