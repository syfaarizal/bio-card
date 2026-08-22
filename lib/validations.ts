import { z } from "zod"
import { isReservedSlug } from "./reserved-slugs"
import { normalizeSpotifyTrackUrl } from "./spotify"
import { normalizeUrl, validateUrl } from "./links/detect"

const usernameRegex = /^[a-z0-9_-]+$/

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(usernameRegex, "Only lowercase letters, numbers, underscores, and dashes allowed")
    .refine((val) => !isReservedSlug(val), "This username is reserved"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const profileIdentitySchema = z.object({
  displayName: z.string().max(50, "Max 50 characters").optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(20, "Slug must be at most 20 characters")
    .regex(usernameRegex, "Slug must be lowercase letters, numbers, underscores, and dashes")
    .refine((val) => !isReservedSlug(val), "This URL is reserved and can't be used"),
  bio: z.string().max(100, "Max 100 characters").optional(),
  location: z.string().max(50, "Max 50 characters").optional(),
  birthdayDay: z.string().optional(),
  birthdayMonth: z.string().optional(),
  birthdayYear: z.string().optional(),
  tags: z.string().optional(),
  themeId: z.string().optional(),
})

export const socialLinksSchema = z.object({
  instagram: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  tiktok: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  twitter: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  youtube: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
})

export const musicSchema = z.object({
  spotifyUrl: z
    .string()
    .refine(
      (url) => url === "" || normalizeSpotifyTrackUrl(url) !== null,
      "Must be a Spotify track URL (e.g. https://open.spotify.com/track/...)"
    ),
})

// Dynamic link validation schema
export const linkSchema = z.object({
  title: z.string().min(1, "Label is required").max(50, "Max 50 characters"),
  url: z.string().min(1, "URL is required").refine(
    (url) => {
      const normalized = normalizeUrl(url)
      const result = validateUrl(normalized)
      return result.valid
    },
    { message: "Enter a valid URL" }
  ),
  provider: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileIdentityInput = z.infer<typeof profileIdentitySchema>
export type SocialLinksInput = z.infer<typeof socialLinksSchema>
export type MusicInput = z.infer<typeof musicSchema>
export type LinkInput = z.infer<typeof linkSchema>
