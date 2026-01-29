import { Skeleton } from "@/components/ui/skeleton";
import TableLoader from "./components/table";

export default function SchedulerLoader(){
     return (
          <>
          <Skeleton className="h-6 md:h-[30px] lg:h-9 w-1/6"/>
          <div className="flex items-center justify-between gap-4 w-full">
               <Skeleton className="w-52 h-9"/>
               <Skeleton className="w-20 h-9"/>
          </div>
          <TableLoader cols={6} rows={4} actionsAtEnd/>
          <Skeleton className="h-5 md:h-6 w-1/5 self-start"/>
          <div className="space-y-4 w-full">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                         <Skeleton className="h-4 w-1/2"/>
                         <Skeleton className="h-9"/>
                    </div>
                    <div className="space-y-2">
                         <Skeleton className="h-4 w-1/2"/>
                         <Skeleton className="h-9"/>
                    </div>
                    <div className="space-y-2">
                         <Skeleton className="h-4 w-1/2"/>
                         <Skeleton className="h-9"/>
                    </div>
               </div>
               <div className="flex gap-4 items-center justify-center w-full">
                    <div className="space-y-2 w-full">
                         <Skeleton className="h-4 w-1/2"/>
                         <Skeleton className="h-9"/>
                    </div>
                    <div className="space-y-2 w-full">
                         <Skeleton className="h-4 w-1/2"/>
                         <Skeleton className="h-9"/>
                    </div>
               </div>
               <Skeleton className="h-[18px] w-1/5"/>
               <Skeleton className="h-9 w-[105px]"/>
          </div>
          </>
     )
}