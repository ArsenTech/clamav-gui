import { Microchip } from "lucide-react";
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
import { formatBytes } from "@/lib/helpers";
import { RAM_USAGE_CONFIG } from "@/lib/constants/chart";

export function RAMStats() {
  const [data, setData] = useState<{ usage: number }[]>([]);
  const [total, setTotal] = useState("");
  const ram = useSystemStats("ram_total", "ram_used");
  useEffect(() => {
    setData((prev) =>[...prev, { usage: (ram.ram_used / ram.ram_total) * 100 }].slice(-30));
    setTotal(`${formatBytes(ram.ram_total)} (${formatBytes(ram.ram_used)} Used)`);
  }, [ram]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microchip className="size-5" /> Memory
        </CardTitle>
        <CardDescription>The Current RAM usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={RAM_USAGE_CONFIG}>
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-base md:text-lg font-semibold flex items-center gap-2 leading-none">
              <Microchip /> {total}
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
