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

export default function StatsContent(){
     const [isPending, startTransition] = useTransition()
     const {stats, refresh} = useAntivirusStats(startTransition);
     return (
          <>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Statistics</h1>
               <Button disabled={isPending} onClick={refresh}>
                    <RotateCw className={cn(isPending && "animate-spin")}/>
                    {isPending ? "Refreshing..." : "Refresh Antivirus Stats"}
               </Button>
               <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                         <DeviceInfo/>
                         <ScanActivity data={stats.activity}/>
                         <ScanTypes data={stats.scanTypes}/>
                         <div className="grid gris-cols-1 xl:grid-cols-2 w-full gap-2">
                              <VirusTypes data={stats.virusTypes}/>
                              <ThreatsStats data={stats.threatStatus}/>
                         </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                         <CPUStats/>
                         <RAMStats/>
                         <DiskStats/>
                    </div>
               </div>
          </>
     )
}