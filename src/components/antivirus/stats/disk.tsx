import { HardDrive, GaugeCircle, Dot } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
import { useSystemStats } from "@/hooks/use-sys-stats";
import { formatBytes } from "@/lib/helpers";
import { DISK_USAGE_CONFIG } from "@/lib/constants/chart";

export function DiskStats() {
  const prevRef = useRef<{
    read: number;
    write: number;
  } | null>(null);
  const [data, setData] = useState<{ read: number; write: number }[]>([]);
  const [currStats, setCurrStats] = useState<{ read: number; write: number }>({
    read: 0,
    write: 0,
  });
  const disk = useSystemStats("disk_read_bytes", "disk_written_bytes");
  useEffect(() => {
    if (disk.disk_read_bytes == null || disk.disk_written_bytes == null) return;

    if (!prevRef.current) {
      prevRef.current = {
        read: disk.disk_read_bytes,
        write: disk.disk_written_bytes,
      };
      return;
    }

    const readDelta = disk.disk_read_bytes - prevRef.current.read;
    const writeDelta = disk.disk_written_bytes - prevRef.current.write;
    prevRef.current = {
      read: disk.disk_read_bytes,
      write: disk.disk_written_bytes,
    };

    setData((prev) =>
      [
        ...prev,
        {
          read: Math.max(0, readDelta),
          write: Math.max(0, writeDelta),
        },
      ].slice(-30)
    );
    setCurrStats((prev) => ({
      ...prev,
      read: Math.max(0, readDelta),
      write: Math.max(0, writeDelta),
    }));
  }, [disk]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive /> Hard Drive
        </CardTitle>
        <CardDescription>The Hard Drive I/O</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={DISK_USAGE_CONFIG}>
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-base md:text-lg font-semibold flex items-center gap-0.5 leading-none">
              <span className="flex items-center gap-2">
                <GaugeCircle />
                Read: {formatBytes(currStats.read)}/s
              </span>
              <Dot />
              <span className="flex items-center gap-2">
                Write: {formatBytes(currStats.write)}/s
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
