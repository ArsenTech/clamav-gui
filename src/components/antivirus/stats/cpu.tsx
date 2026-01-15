"use client";

import { Cpu } from "lucide-react";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useSystemStats } from "@/hooks/use-cpu";

export const description = "The Current CPU Activiry Based on the Base Frequency";

const chartConfig = {
  util: {
    label: "Utilization (%)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function CPUStats() {
     const [data, setData] = useState<{util: number}[]>([])
     const cpu = useSystemStats("cpu_frequency","cpu_usage");
     useEffect(()=>{
          console.log(cpu)
     },[cpu])
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Cpu/> CPU Activity</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillUtil" x1="0" y1="0" x2="0" y2="1" >
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
            <div className="flex items-center gap-2 leading-none">
              Last 30 Seconds
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
