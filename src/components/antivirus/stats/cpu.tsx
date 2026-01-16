import { Cpu, Dot, Gauge } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useSystemStats } from "@/hooks/use-sys-stats";
import { CPU_STATS_CONFIG } from "@/lib/constants/chart";

export function CPUStats() {
  const [data, setData] = useState<{ util: number }[]>([]);
  const [currStats, setCurrStats] = useState<{ util: number; freq: number }>({
    util: 0,
    freq: 0,
  });
  const cpu = useSystemStats("cpu_frequency", "cpu_usage");
  useEffect(() => {
    setData((prev) => [...prev, { util: cpu.cpu_usage }].slice(-30));
    setCurrStats((prev) => ({
      ...prev,
      util: cpu.cpu_usage,
      freq: cpu.cpu_frequency/1000,
    }));
  }, [cpu]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="size-5" /> CPU Activity
        </CardTitle>
        <CardDescription>The Current CPU Activiry Based on the Base Frequency</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CPU_STATS_CONFIG}>
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
              <linearGradient id="fillUtil" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-util)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-util)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="util"
              type="natural"
              fill="url(#fillUtil)"
              fillOpacity={0.4}
              stroke="var(--color-util)"
              stackId="a"
              animateNewValues={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-base md:text-lg font-semibold flex items-center gap-0.5 leading-none">
              <span className="flex items-center gap-2">
                <Gauge className="size-5 md:size-6" /> Speed:{" "}
                {isNaN(currStats.freq) ? 0 : currStats.freq} GHz{" "}
              </span>
              <Dot />
              <span className="flex items-center gap-2">
                <Cpu /> Utilization: {currStats.util}%
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Last 30 Seconds
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
