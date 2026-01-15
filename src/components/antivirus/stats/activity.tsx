import { Bug, BugOff, LineChart } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", detected: 186, resolved: 80 },
  { month: "February", detected: 305, resolved: 200 },
  { month: "March", detected: 237, resolved: 120 },
  { month: "April", detected: 73, resolved: 190 },
  { month: "May", detected: 209, resolved: 130 },
  { month: "June", detected: 214, resolved: 140 },
]

const chartConfig = {
  detected: {
    label: "Detected",
    color: "var(--destructive)",
    icon: Bug,
  },
  resolved: {
    label: "Resolved",
    color: "oklch(0.723 0.219 149.579)",
    icon: BugOff,
  },
} satisfies ChartConfig

export function ScanActivity() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LineChart className="size-5"/> Scan Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
              dataKey="detected"
              type="natural"
              fill="var(--color-detected)"
              fillOpacity={0.4}
              stroke="var(--color-detected)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
