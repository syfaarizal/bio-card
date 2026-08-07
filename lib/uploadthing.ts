import { createUploadthing, type FileRouter } from "uploadthing/next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const f = createUploadthing()

async function getAuthenticatedProfile() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) throw new Error("Profile not found")

  return profile
}

export const ourFileRouter = {
  // Used for both MAIN and SECONDARY image uploads
  profileImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const profile = await getAuthenticatedProfile()
      return { profileId: profile.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Return data to the client — actual DB write happens via saveImage action
      return { profileId: metadata.profileId, url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
