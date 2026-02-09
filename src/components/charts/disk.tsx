import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GET_DISK_USAGE_CONFIG } from "@/lib/constants/chart";
import { ChartProps } from "@/lib/types/props";

export default function DiskChart({data,t}: ChartProps<{read: number; write: number }[]>) {
  return (
    <ChartContainer config={GET_DISK_USAGE_CONFIG(t)}>
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
          <linearGradient id="fillRead" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-read)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-read)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillWrite" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-write)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-write)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="read"
          type="natural"
          fill="url(#fillRead)"
          fillOpacity={0.4}
          stroke="var(--color-read)"
          stackId="a"
          animateNewValues={false}
          isAnimationActive={false}
        />
        <Area
          dataKey="write"
          type="natural"
          fill="url(#fillWrite)"
          fillOpacity={0.4}
          stroke="var(--color-write)"
          stackId="a"
          animateNewValues={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
