import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GET_RAM_USAGE_CONFIG } from "@/lib/constants/chart";
import { ChartProps } from "@/lib/types/props";

export default function RAMChart({data,t}: ChartProps<{ usage: number }[]>) {
  return (
    <ChartContainer config={GET_RAM_USAGE_CONFIG(t)}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" hideLabel />}
        />
        <defs>
          <linearGradient id="fillUsage" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-usage)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-usage)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="usage"
          type="natural"
          fill="url(#fillUsage)"
          fillOpacity={0.4}
          stroke="var(--color-usage)"
          stackId="a"
          animateNewValues={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
