import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileEditor } from "@/features/editor/profile-editor"

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      links: true,
      profileLinks: { orderBy: { sortOrder: "asc" } },
      music: true,
      images: true,
      user: { select: { username: true, email: true } },
    },
  })

  if (!profile) redirect("/login")

  return <ProfileEditor profile={profile} />
}
