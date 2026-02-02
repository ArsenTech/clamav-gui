import { useSettings } from "@/context/settings";
import TableLoader from "./components/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoader(){
     const {settings} = useSettings()
     return (
          <div className="space-y-4">
               <Skeleton className="h-6 md:h-[30px] w-[100px]"/>
               <div className="flex items-center justify-between gap-4 w-full">
                    <Skeleton className="w-[385px] h-9"/>
                    <Skeleton className="w-[168px] h-9"/>
               </div>
               <TableLoader cols={settings.developerMode ? 5 : 4} rows={10} actionsAtEnd actionsAtStart/>
          </div>
     )
}