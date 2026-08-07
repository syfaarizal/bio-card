import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAnalytics } from "@/actions/analytics"
import { redirect } from "next/navigation"
import { Eye, TrendingUp, Calendar, BarChart2, Smartphone, Monitor } from "lucide-react"
import { AnalyticsCharts } from "@/features/analytics/analytics-charts"

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const analytics = await getAnalytics(user.id)

  // ── Empty state ──
  if (!analytics || analytics.total === 0) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Track who&apos;s visiting your BioCard.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <BarChart2 className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-700">No data yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Share your profile link to start tracking views. Data appears here within minutes.
          </p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Views",
      value: analytics.total,
      icon: Eye,
      desc: "All time",
    },
    {
      label: "Today",
      value: analytics.today,
      icon: Calendar,
      desc: "Last 24 hours",
    },
    {
      label: "This Week",
      value: analytics.thisWeek,
      icon: TrendingUp,
      desc: "Last 7 days",
    },
    {
      label: "This Month",
      value: analytics.thisMonth,
      icon: TrendingUp,
      desc: "Last 30 days",
    },
  ]

  // Build device breakdown from analytics
  const deviceData = analytics.deviceBreakdown ?? []
  const referrerData = analytics.topReferrer ?? []

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Track who&apos;s visiting your BioCard.</p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, desc }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {value.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Top Referrers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Referrers</h2>
          {referrerData.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">No referrer data yet.</p>
          ) : (
            <div className="space-y-3">
              {referrerData.map(({ source, count }) => {
                const pct = analytics.total > 0
                  ? Math.round((count / analytics.total) * 100)
                  : 0
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-700 font-medium">{source}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Devices</h2>
          {deviceData.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">No device data yet.</p>
          ) : (
            <div className="space-y-3">
              {deviceData.map(({ device, count }: { device: string; count: number }) => {
                const pct = analytics.total > 0
                  ? Math.round((count / analytics.total) * 100)
                  : 0
                const Icon = device === "mobile" ? Smartphone : Monitor
                return (
                  <div key={device}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium capitalize">{device}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-700"
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

      {/* ── Weekly chart ── */}
      {analytics.weeklyViews && analytics.weeklyViews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Views — Last 7 Days</h2>
          <AnalyticsCharts data={analytics.weeklyViews} />
        </div>
      )}
    </div>
  )
}
