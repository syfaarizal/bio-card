import { createServerSupabaseClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { user: true },
  })

  if (!profile) redirect("/login")

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar
        username={profile.user.username}
        profileStatus={profile.status}
        slug={profile.slug}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
