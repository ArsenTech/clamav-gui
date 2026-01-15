import { CPUStats } from "@/components/antivirus/stats/cpu";
import DeviceInfo from "@/components/antivirus/stats/device-info";
import { DiskStats } from "@/components/antivirus/stats/disk";
import { RAMStats } from "@/components/antivirus/stats/ram";
import { AppLayout } from "@/components/layout";

export default function StatsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Statistics</h1>
               <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                         <DeviceInfo/>
                         <CPUStats/>
                         <RAMStats/>
                         <DiskStats/>
                    </div>
               </div>
          </AppLayout>
     )
}