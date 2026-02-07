import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SCAN_TYPE_CONFIG } from "@/lib/constants/chart"
import { IScanTypeStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "./no-data"

export default function ScanChart({data}: ChartProps<IScanTypeStat[]>) {
  return !data.length ? (
    <NoData/>
  ) : (
    <ChartContainer config={SCAN_TYPE_CONFIG}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
      >
        <YAxis
          dataKey="scan_type"
          type="category"
          tickLine={false}
          tickMargin={2}
          axisLine={false}
          tickFormatter={(value) =>SCAN_TYPE_CONFIG[value as keyof typeof SCAN_TYPE_CONFIG]?.label}
        />
        <XAxis dataKey="threats" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="threats" layout="vertical" radius={5} />
      </BarChart>
    </ChartContainer>
  )
}
