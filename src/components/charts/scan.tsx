import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { GET_SCAN_TYPE_CONFIG } from "@/lib/constants/chart"
import { IScanTypeStat } from "@/lib/types/stats"
import { ChartProps } from "@/lib/types/props"
import { NoData } from "./no-data"

export default function ScanChart({data,t}: ChartProps<IScanTypeStat[]>) {
  const config = GET_SCAN_TYPE_CONFIG(t)
  return !data.length ? (
    <NoData label={t("no-data")}/>
  ) : (
    <ChartContainer config={config}>
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
          tickFormatter={(value) =>config[value as keyof typeof config]?.label}
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
