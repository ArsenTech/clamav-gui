import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { GET_ACTIVITY_STATS_CONFIG } from "@/lib/constants/chart"
import { IActivityStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { useMemo } from "react"
import { NoData } from "./no-data"

export default function ActivityChart({data,t}: ChartProps<IActivityStat[]>) {
  const hasData = useMemo(()=>data.some(d => d.resolved > 0 || d.unresolved > 0),[data]);
  const month = t("month",{returnObjects: true})
  return (!data.length || !hasData) ? (
    <NoData label={t("no-data")}/>
  ) : (
    <ChartContainer config={GET_ACTIVITY_STATS_CONFIG(t)}>
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
  )
}
