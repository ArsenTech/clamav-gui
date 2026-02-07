import { Microchip } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense, useEffect, useState, lazy } from "react";
import { useSystemStats } from "@/hooks/use-stats";
import { formatBytes } from "@/lib/helpers/formating";
import { NoData } from "@/components/charts/no-data";
const RAMChart = lazy(()=>import("@/components/charts/ram"))

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
        <Suspense fallback={<NoData label="Loading..."/>}>
          <RAMChart data={data}/>
        </Suspense>
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
