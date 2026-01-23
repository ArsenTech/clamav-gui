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
import { ChartProps, IActivityStat } from "@/lib/types"
import { useMemo } from "react"
import { NoData } from "./no-data"

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function ScanActivity({data}: ChartProps<IActivityStat[]>) {
  const hasData = useMemo(()=>data.some(d => d.resolved > 0 || d.unresolved > 0),[data])
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LineChart className="size-5"/> Scan Activity</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {(!data.length || !hasData) ? (
          <NoData/>
        ) : (
          <ChartContainer config={ACTIVITY_STATS_CONFIG}>
            <AreaChart
              accessibilityLayer
              data={data}
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
                tickFormatter={(value) => month[parseInt(value.slice(5))-1]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="unresolved"
                type="natural"
                fill="var(--color-unresolved)"
                fillOpacity={0.4}
                stroke="var(--color-unresolved)"
                stackId="a"
              />
              <Area
                dataKey="resolved"
                type="natural"
                fill="var(--color-resolved)"
                fillOpacity={0.4}
                stroke="var(--color-resolved)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
