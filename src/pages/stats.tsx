import { CPUStats } from "@/components/antivirus/stats/cpu";
import { AppLayout } from "@/components/layout";

export default function StatsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Statistics</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                         <CPUStats/>
                    </div>
               </div>
          </AppLayout>
     )
}