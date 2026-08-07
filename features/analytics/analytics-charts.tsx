"use client"

interface DayData {
  date: string
  count: number
}

interface Props {
  data: DayData[]
}

export function AnalyticsCharts({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map(({ date, count }) => {
        const pct = Math.round((count / max) * 100)
        const label = new Date(date).toLocaleDateString("en-US", { weekday: "short" })

        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="w-full flex items-end justify-center h-16">
              <div
                className="w-full rounded-t-md bg-gray-900 transition-all duration-500 group-hover:bg-gray-600 min-h-[2px]"
                style={{ height: `${Math.max(pct, 2)}%` }}
                title={`${count} view${count !== 1 ? "s" : ""}`}
              />
            </div>
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
