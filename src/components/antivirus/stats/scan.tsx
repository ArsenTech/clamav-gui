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
} from "@/components/ui/chart"
import { SCAN_TYPE_CONFIG } from "@/lib/constants/chart"

const chartData = [
  { scanType: "main", threats: 275, fill: "var(--color-main)" },
  { scanType: "full", threats: 200, fill: "var(--color-full)" },
  { scanType: "custom", threats: 187, fill: "var(--color-custom)" },
  { scanType: "file", threats: 173, fill: "var(--color-file)" },
  { scanType: "real-time", threats: 90, fill: "var(--color-real-time)" },
]

export function ScanTypes() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="size-5"/> Scan Types</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={SCAN_TYPE_CONFIG}>
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
                SCAN_TYPE_CONFIG[value as keyof typeof SCAN_TYPE_CONFIG]?.label
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
