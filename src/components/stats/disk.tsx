import { HardDrive, GaugeCircle, Dot } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense, useEffect, useRef, useState, lazy } from "react";
import { useSystemStats } from "@/hooks/use-stats";
import { formatBytes } from "@/lib/helpers/formating";
import { NoData } from "@/components/charts/no-data";
import { useTranslation } from "react-i18next";
import { RealTimeChartProps } from "@/lib/types/props";
const DiskChart = lazy(()=>import("@/components/charts/disk"));

export function DiskStats({t}: RealTimeChartProps) {
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
    setData((prev) => [
      ...prev,
      {
        read: Math.max(0, readDelta),
        write: Math.max(0, writeDelta),
      },
    ].slice(-30));
    setCurrStats((prev) => ({
      ...prev,
      read: Math.max(0, readDelta),
      write: Math.max(0, writeDelta),
    }));
  }, [disk]);
  const {t: mainTxt} = useTranslation();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive />
          {t("disk.title")}
        </CardTitle>
        <CardDescription>{t("disk.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NoData label={t("loading")}/>}>
          <DiskChart data={data} t={t}/>
        </Suspense>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-base md:text-lg font-semibold flex items-center gap-0.5 leading-none">
              <span className="flex items-center gap-2">
                <GaugeCircle />
                {t("disk.read-stat",{
                  read: formatBytes(currStats.read,mainTxt)
                })}
              </span>
              <Dot />
              <span className="flex items-center gap-2">
                {t("disk.write-stat",{
                  write: formatBytes(currStats.write,mainTxt)
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
