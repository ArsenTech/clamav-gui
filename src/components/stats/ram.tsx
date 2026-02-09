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
import { useTranslation } from "react-i18next";
import { RealTimeChartProps } from "@/lib/types/props";
const RAMChart = lazy(()=>import("@/components/charts/ram"))

export function RAMStats({t}: RealTimeChartProps) {
  const [data, setData] = useState<{ usage: number }[]>([]);
  const [total, setTotal] = useState("");
  const ram = useSystemStats("ram_total", "ram_used");
  const {t: mainTxt} = useTranslation()
  useEffect(() => {
    setData((prev) =>[...prev, { usage: Math.round((ram.ram_used / ram.ram_total) * 100) }].slice(-30));
    setTotal(t("ram.stat",{
      total: formatBytes(ram.ram_total,mainTxt),
      used: formatBytes(ram.ram_used,mainTxt)
    }))
  }, [ram]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microchip className="size-5" />
          {t("ram.title")}
        </CardTitle>
        <CardDescription>{t("ram.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <RAMChart data={data} t={t}/>
        </Suspense>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-base md:text-lg font-semibold flex items-center gap-2 leading-none">
              <Microchip /> {total}
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
