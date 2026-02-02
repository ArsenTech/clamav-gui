import { Skeleton } from "@/components/ui/skeleton";
import TableLoader from "./components/table";
import { useSettings } from "@/context/settings";
import { TableLoaderProps } from "@/lib/types";

export default function QuarantineLoader({rows}: TableLoaderProps){
     const {settings} = useSettings()
     return (
          <>
          <Skeleton className="h-6 md:h-[30px] lg:h-9 w-1/5"/>
          <Skeleton className="h-9 w-[311px]"/>
          <div className="flex items-center justify-between gap-4 w-full">
               <Skeleton className="w-[512px] h-9"/>
               <Skeleton className="w-20 h-9"/>
          </div>
          <TableLoader cols={settings.developerMode ? 5 : 4} actionsAtEnd rows={rows}/>
          </>
     )
}