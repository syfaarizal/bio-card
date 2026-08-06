"use server"

import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase"
import { profileIdentitySchema, socialLinksSchema, musicSchema } from "@/lib/validations"
import { fetchSpotifyOEmbed } from "@/lib/spotify"
import { isReservedSlug } from "@/lib/reserved-slugs"

import { revalidatePath } from "next/cache"
import type { ProfileIdentityInput, SocialLinksInput, MusicInput } from "@/lib/validations"

async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return user.id
}

export async function saveProfileIdentity(input: ProfileIdentityInput) {
  const parsed = profileIdentitySchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const userId = await getCurrentUserId()
  const { displayName, slug, bio, location, birthdayDay, birthdayMonth, birthdayYear, tags, themeId } = parsed.data

  // Check slug availability (exclude current user's profile)
  const existing = await prisma.profile.findFirst({
    where: { slug, NOT: { userId } },
  })
  if (existing) {
    return { error: "This URL is already taken. Try another." }
  }

  if (isReservedSlug(slug)) {
    return { error: "This URL is reserved and can't be used." }
  }

  // Parse birthday
  let birthday: Date | undefined
  if (birthdayDay && birthdayMonth && birthdayYear) {
    const date = new Date(`${birthdayYear}-${birthdayMonth}-${birthdayDay}`)
    if (!isNaN(date.getTime())) birthday = date
  }

  // Parse tags
  const tagsArray = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5)
    : []

  await prisma.profile.update({
    where: { userId },
    data: {
      displayName,
      slug,
      bio,
      location,
      birthday,
      tags: tagsArray,
      themeId,
    },
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

export async function publishProfile() {
  const userId = await getCurrentUserId()

  await prisma.profile.update({
    where: { userId },
    data: { status: "PUBLISHED" as const },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function unpublishProfile() {
  const userId = await getCurrentUserId()

  await prisma.profile.update({
    where: { userId },
    data: { status: "DRAFT" as const },
  })

  revalidatePath("/dashboard")
  return { success: true }
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

  // Soft delete
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
