import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { THREAT_STATUS_CONFIG } from "@/lib/constants/chart"
import { IThreatStatusStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "./no-data"

export default function ThreatsChart({data}: ChartProps<IThreatStatusStat[]>) {
  const totalThreats = React.useMemo(() => data.reduce((acc, curr) => acc + curr.threats, 0), [data])
  return (!data.length || totalThreats===0) ? (
    <NoData/>
  ) : (
    <ChartContainer
      config={THREAT_STATUS_CONFIG}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="threats"
          nameKey="status"
          innerRadius={60}
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
                      {totalThreats.toLocaleString()}
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
  )
}
