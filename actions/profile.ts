"use server"

import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { profileIdentitySchema, socialLinksSchema, musicSchema } from "@/lib/validations"
import { fetchSpotifyOEmbed } from "@/lib/spotify"
import { isReservedSlug } from "@/lib/reserved-slugs"
import { revalidatePath } from "next/cache"
import type { ProfileIdentityInput, SocialLinksInput, MusicInput } from "@/lib/validations"

async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return user.id
}

export async function saveProfileIdentity(input: ProfileIdentityInput) {
  const parsed = profileIdentitySchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const userId = await getCurrentUserId()
  const { displayName, slug, bio, location, birthdayDay, birthdayMonth, birthdayYear, tags, themeId } =
    parsed.data

  const existing = await prisma.profile.findFirst({
    where: { slug, NOT: { userId } },
  })
  if (existing) return { error: "This URL is already taken. Try another." }
  if (isReservedSlug(slug)) return { error: "This URL is reserved and can't be used." }

  let birthday: Date | undefined
  if (birthdayDay && birthdayMonth && birthdayYear) {
    const date = new Date(`${birthdayYear}-${birthdayMonth}-${birthdayDay}`)
    if (!isNaN(date.getTime())) birthday = date
  }

  const tagsArray = tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5)
    : []

  await prisma.profile.update({
    where: { userId },
    data: { displayName, slug, bio, location, birthday, tags: tagsArray, themeId },
  })

  revalidatePath("/dashboard/profile")
  return { success: true }
}

export async function saveSocialLinks(input: SocialLinksInput) {
  const parsed = socialLinksSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  await prisma.socialLinks.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, ...parsed.data },
    update: parsed.data,
  })

  revalidatePath("/dashboard/profile")
  return { success: true }
}

export async function saveMusic(input: MusicInput) {
  const parsed = musicSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  const { spotifyUrl } = parsed.data
  let songTitle: string | undefined
  let artistName: string | undefined
  let albumArt: string | undefined

  if (spotifyUrl) {
    try {
      const oembed = await fetchSpotifyOEmbed(spotifyUrl)
      songTitle = oembed.title
      artistName = oembed.author_name
      albumArt = oembed.thumbnail_url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Couldn't fetch song info. Try again later."
      return { error: message }
    }
  }

  await prisma.music.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, spotifyUrl, songTitle, artistName, albumArt },
    update: { spotifyUrl, songTitle, artistName, albumArt },
  })

  revalidatePath("/dashboard/profile")
  return { success: true }
}

// ─── Image actions (v2 — 5 slots) ────────────────────────────────────────────

type ImageSlotType = "PROFILE" | "BANNER" | "GALLERY_1" | "GALLERY_2" | "GALLERY_3"

export async function saveImage(type: ImageSlotType, url: string) {
  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  await prisma.image.deleteMany({ where: { profileId: profile.id, type } })
  await prisma.image.create({ data: { profileId: profile.id, type, url } })

  revalidatePath("/dashboard/profile")
  return { success: true }
}

export async function deleteImage(type: ImageSlotType) {
  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  await prisma.image.deleteMany({ where: { profileId: profile.id, type } })

  revalidatePath("/dashboard/profile")
  return { success: true }
}

// ─── Avatar decoration ────────────────────────────────────────────────────────

export async function saveProfileDecoration(effect: string | null) {
  const userId = await getCurrentUserId()
  await prisma.profile.update({
    where: { userId },
    data: { profileEffect: effect },
  })
  revalidatePath("/dashboard/profile")
  return { success: true }
}

// ─── Unchanged below ──────────────────────────────────────────────────────────

export async function publishProfile() {
  const userId = await getCurrentUserId()
  await prisma.profile.update({
    where: { userId },
    data: { status: "PUBLISHED" as const },
  })
  revalidatePath("/dashboard")
  return { success: true, status: "PUBLISHED" }
}

export async function unpublishProfile() {
  const userId = await getCurrentUserId()
  await prisma.profile.update({
    where: { userId },
    data: { status: "DRAFT" as const },
  })
  revalidatePath("/dashboard")
  return { success: true, status: "DRAFT" }
}

export async function archiveProfile() {
  const userId = await getCurrentUserId()
  await prisma.profile.update({
    where: { userId },
    data: { status: "ARCHIVED" as const },
  })
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteAccount(confirmUsername: string) {
  const userId = await getCurrentUserId()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: "User not found." }
  if (user.username !== confirmUsername) return { error: "Username doesn't match." }

  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      profile: {
        update: { status: "ARCHIVED" as const },
      },
    },
  })

  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()

  return { success: true }
}

// ─── ProfileLink CRUD actions ────────────────────────────────────────────────

import { validateUrl, detectProvider, normalizeUrl } from "@/lib/links/detect"
import type { ProviderId } from "@/lib/links/providers"

export type LinkInput = {
  title: string
  url: string
  provider?: ProviderId
}

export async function createLink(input: LinkInput) {
  // Validate URL
  const normalizedUrl = normalizeUrl(input.url)
  const validation = validateUrl(normalizedUrl)
  if (!validation.valid) {
    return { error: validation.error }
  }

  // Detect provider if not provided
  const provider = input.provider ?? detectProvider(normalizedUrl)

  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  // Get max sortOrder for this profile
  const maxOrder = await prisma.profileLink.aggregate({
    where: { profileId: profile.id },
    _max: { sortOrder: true },
  })

  const newLink = await prisma.profileLink.create({
    data: {
      profileId: profile.id,
      title: input.title.trim(),
      url: normalizedUrl,
      provider: provider,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath("/dashboard/profile")
  return { success: true, link: newLink }
}

export async function updateLink(linkId: string, input: Partial<LinkInput>) {
  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  // Verify ownership
  const existingLink = await prisma.profileLink.findUnique({ where: { id: linkId } })
  if (!existingLink || existingLink.profileId !== profile.id) {
    return { error: "Link not found." }
  }

  const data: {
    title?: string
    url?: string
    provider?: string
  } = {}

  if (input.title !== undefined) {
    data.title = input.title.trim()
  }

  if (input.url !== undefined) {
    const normalizedUrl = normalizeUrl(input.url)
    const validation = validateUrl(normalizedUrl)
    if (!validation.valid) {
      return { error: validation.error }
    }
    data.url = normalizedUrl

    // Re-detect provider if URL changes
    if (input.provider === undefined) {
      data.provider = detectProvider(normalizedUrl)
    }
  }

  if (input.provider !== undefined) {
    data.provider = input.provider
  }

  const updatedLink = await prisma.profileLink.update({
    where: { id: linkId },
    data,
  })

  revalidatePath("/dashboard/profile")
  return { success: true, link: updatedLink }
}

export async function deleteLink(linkId: string) {
  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  // Verify ownership
  const existingLink = await prisma.profileLink.findUnique({ where: { id: linkId } })
  if (!existingLink || existingLink.profileId !== profile.id) {
    return { error: "Link not found." }
  }

  await prisma.profileLink.delete({ where: { id: linkId } })

  revalidatePath("/dashboard/profile")
  return { success: true }
}

export async function reorderLinks(orderedIds: string[]) {
  const userId = await getCurrentUserId()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) return { error: "Profile not found." }

  // Verify all links belong to this profile
  const existingLinks = await prisma.profileLink.findMany({
    where: { id: { in: orderedIds }, profileId: profile.id },
  })

  if (existingLinks.length !== orderedIds.length) {
    return { error: "Invalid link IDs." }
  }

  // Update sort order for each link
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.profileLink.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )

  revalidatePath("/dashboard/profile")
  return { success: true }
}
