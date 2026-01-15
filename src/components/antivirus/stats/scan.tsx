"use client"

import { Search } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A mixed bar chart"

const chartData = [
  { scanType: "main", threats: 275, fill: "var(--color-main)" },
  { scanType: "full", threats: 200, fill: "var(--color-full)" },
  { scanType: "custom", threats: 187, fill: "var(--color-custom)" },
  { scanType: "file", threats: 173, fill: "var(--color-file)" },
  { scanType: "real-time", threats: 90, fill: "var(--color-real-time)" },
]

const chartConfig = {
  threats: {
    label: "Threats",
  },
  main: {
    label: "Main Scan",
    color: "var(--chart-1)",
  },
  full: {
    label: "Full Scan",
    color: "var(--chart-2)",
  },
  custom: {
    label: "Custom Scan",
    color: "var(--chart-3)",
  },
  file: {
    label: "File Scan",
    color: "var(--chart-4)",
  },
  "real-time": {
    label: "Real-Time",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ScanTypes() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="size-5"/> Scan Types</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
          >
            <YAxis
              dataKey="scanType"
              type="category"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="threats" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="threats" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
