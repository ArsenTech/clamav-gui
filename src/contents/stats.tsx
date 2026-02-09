import {
     ScanActivity,
     CPUStats,
     DeviceInfo,
     DiskStats,
     RAMStats,
     ScanTypes,
     ThreatsStats,
     VirusTypes
} from "@/components/stats"
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { useAntivirusStats } from "@/hooks/use-stats";
import { useTranslation } from "react-i18next";

export default function StatsContent(){
     const [isPending, startTransition] = useTransition()
     const {stats, refresh} = useAntivirusStats(startTransition);
     const {t} = useTranslation("stats")
     return (
          <>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               <Button disabled={isPending} onClick={refresh}>
                    <RotateCw className={cn(isPending && "animate-spin")}/>
                    {isPending ? t("refresh.loading") : t("refresh.original")}
               </Button>
               <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                         <DeviceInfo t={t}/>
                         <ScanActivity data={stats.activity} t={t}/>
                         <ScanTypes data={stats.scanTypes} t={t}/>
                         <div className="grid gris-cols-1 xl:grid-cols-2 w-full gap-2">
                              <VirusTypes data={stats.virusTypes} t={t}/>
                              <ThreatsStats data={stats.threatStatus} t={t}/>
                         </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                         <CPUStats t={t}/>
                         <RAMStats t={t}/>
                         <DiskStats t={t}/>
                    </div>
               </div>
          </>
     )
}