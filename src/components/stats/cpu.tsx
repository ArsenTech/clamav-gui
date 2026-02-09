import { Cpu, Dot, Gauge } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, lazy, Suspense } from "react";
import { useSystemStats } from "@/hooks/use-stats";
import { NoData } from "@/components/charts/no-data";
import { RealTimeChartProps } from "@/lib/types/props";
const CPUChart = lazy(()=>import("@/components/charts/cpu"));

export function CPUStats({t}: RealTimeChartProps) {
  const [data, setData] = useState<{ util: number }[]>([]);
  const [currStats, setCurrStats] = useState<{ util: number; freq: number }>({ util: 0, freq: 0 });
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
          <Cpu className="size-5" />
          {t("cpu.title")}
        </CardTitle>
        <CardDescription>{t("cpu.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <CPUChart data={data} t={t}/>
        </Suspense>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-base md:text-lg font-semibold flex items-center gap-0.5 leading-none">
              <span className="flex items-center gap-2">
                <Gauge className="size-5 md:size-6" />
                {t("cpu.speed-stat",{
                  freq: isNaN(currStats.freq) ? 0 : currStats.freq
                })}
              </span>
              <Dot />
              <span className="flex items-center gap-2">
                <Cpu />
                {t("cpu.util-stat",{
                  util: currStats.util
                })}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {t("date.last-30-secs")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
