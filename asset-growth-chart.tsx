"use client"

import { useMemo } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAssetStore } from "@/lib/asset-store"

export function AssetGrowthChart() {
  const { assets } = useAssetStore()

  const chartData = useMemo(() => {
    const monthlyCounts: { [key: string]: number } = {} // "YYYY-MM" -> count

    assets.forEach((asset) => {
      const dateKey = asset.purchaseDate.substring(0, 7) // "YYYY-MM"
      monthlyCounts[dateKey] = (monthlyCounts[dateKey] || 0) + 1
    })

    const sortedMonths = Object.keys(monthlyCounts).sort()

    let cumulativeCount = 0
    return sortedMonths.map((month) => {
      cumulativeCount += monthlyCounts[month]
      const [year, monthNum] = month.split("-")
      const monthName = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1, 1).toLocaleString("default", {
        month: "short",
      })
      return {
        date: `${monthName} ${year}`,
        totalAssets: cumulativeCount,
      }
    })
  }, [assets])

  return (
    <Card className="bg-[#1E1E1E] text-white border border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">Asset Growth Over Time</CardTitle>
        <CardDescription className="text-gray-400">Cumulative number of assets added to inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            totalAssets: {
              label: "Total Assets",
              color: "hsl(var(--chart-1))", // Using shadcn chart color variable
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.split(" ")[0]} // Show only month for brevity
              />
              <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="totalAssets"
                stroke="var(--color-totalAssets)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-totalAssets)",
                  stroke: "var(--color-totalAssets)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: "var(--color-totalAssets)",
                  stroke: "var(--color-totalAssets)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
