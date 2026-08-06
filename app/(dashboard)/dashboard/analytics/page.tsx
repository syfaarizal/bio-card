import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAnalytics } from "@/actions/analytics"
import { redirect } from "next/navigation"
import { BarChart2, Eye, TrendingUp } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const analytics = await getAnalytics(user.id)

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <BarChart2 className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm font-medium">No data yet.</p>
        <p className="text-xs mt-1">Share your profile to get your first view.</p>
      </div>
    )
  }

  const stats = [
    { label: "Total Views", value: analytics.total, icon: Eye },
    { label: "Today", value: analytics.today, icon: TrendingUp },
    { label: "This Week", value: analytics.thisWeek, icon: TrendingUp },
    { label: "This Month", value: analytics.thisMonth, icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Track who&apos;s visiting your BioCard.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Top Referrers */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Referrers</h2>
        {analytics.topReferrer.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No referrer data yet.</p>
        ) : (
          <div className="space-y-3">
            {analytics.topReferrer.map(({ source, count }) => {
              const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{source}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {count} <span className="text-xs text-gray-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
