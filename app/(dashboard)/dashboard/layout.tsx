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

  // Also check user hasn't been soft-deleted
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { user: true },
  })

  if (!profile || profile.user.deletedAt) {
    // Profile tidak ditemukan atau user di-delete — clear stale session
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50 text-gray-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 lg:h-screen lg:flex-row lg:overflow-hidden">
      <DashboardSidebar
        username={profile.user.username}
        profileStatus={profile.status}
        slug={profile.slug}
      />
      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <DashboardHeader profile={profile} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
