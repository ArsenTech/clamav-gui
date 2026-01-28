import { Skeleton } from "@/components/ui/skeleton";
import { SCAN_TYPES } from "@/lib/constants";

export default function ScanMenuLoader(){
     return (
          <>
               <Skeleton className="h-6 md:h-[30px] lg:h-9 w-20"/>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-col">
                    {SCAN_TYPES.map(({type})=>(
                         <Skeleton key={type} className="min-h-[114px]"/>
                    ))}
                    <Skeleton className="h-9 w-36"/>
               </div>
          </>
     )
}