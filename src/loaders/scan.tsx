import { Skeleton } from "@/components/ui/skeleton";
import { ScanType } from "@/lib/types";

interface Props{
     type: ScanType
}
export default function ScanLoader({type}: Props){
     return (
          <>
          <Skeleton className="h-4 w-1/2"/>
          <div className="flex justify-center items-center gap-4 flex-col">
               {type!=="full" && (
                    <Skeleton className="h-2 w-full"/>
               )}
               <Skeleton className="h-7 w-2/5"/>
               {type==="full" && (
                    <Skeleton className="self-start h-4 w-1/2"/>
               )}
               {(type==="custom" || type==="file") && (
                    <Skeleton className="w-full h-24"/>
               )}
               <Skeleton className="w-full h-24"/>
               <Skeleton className="w-full h-24"/>
               <Skeleton className="h-6 w-36"/>
          </div>
          </>
     )
}