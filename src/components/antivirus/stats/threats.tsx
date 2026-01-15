import * as React from "react"
import { Bug } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

const chartData = [
  { status: "quarantined", threats: 275, fill: "var(--color-quarantined)" },
  { status: "ignored", threats: 200, fill: "var(--color-ignored)" },
  { status: "deleted", threats: 287, fill: "var(--color-deleted)" },
  { status: "unresolved", threats: 173, fill: "var(--color-unresolved)" },
]

const chartConfig = {
  threats: {
    label: "threats",
  },
  quarantined: {
    label: "Quarantined",
    color: "var(--chart-1)",
  },
  ignored: {
    label: "Skipped",
    color: "var(--chart-2)",
  },
  deleted: {
    label: "Cleaned",
    color: "var(--chart-3)",
  },
  unresolved: {
    label: "Unresolved",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

export function ThreatsStats() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.threats, 0)
  }, [])

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2"><Bug className="size-5"/> Overall Threats</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="threats"
              nameKey="status"
              innerRadius={75}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Threats
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
