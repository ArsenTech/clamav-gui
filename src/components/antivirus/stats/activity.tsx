import { LineChart } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ACTIVITY_STATS_CONFIG } from "@/lib/constants/chart"

const chartData = [
  { month: "January", unresolved: 186, resolved: 80 },
  { month: "February", unresolved: 305, resolved: 200 },
  { month: "March", unresolved: 237, resolved: 120 },
  { month: "April", unresolved: 73, resolved: 190 },
  { month: "May", unresolved: 209, resolved: 130 },
  { month: "June", unresolved: 214, resolved: 140 },
]

export function ScanActivity() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LineChart className="size-5"/> Scan Activity</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ACTIVITY_STATS_CONFIG}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="resolved"
              type="natural"
              fill="var(--color-resolved)"
              fillOpacity={0.4}
              stroke="var(--color-resolved)"
              stackId="a"
            />
            <Area
              dataKey="unresolved"
              type="natural"
              fill="var(--color-unresolved)"
              fillOpacity={0.4}
              stroke="var(--color-unresolved)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
