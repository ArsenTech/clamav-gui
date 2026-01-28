import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props{
     hasErr: boolean,
     isStartup: boolean
}
export default function ScanFinishedLoader({hasErr,isStartup}: Props){
     return (
          <>
               <Skeleton className="size-32"/>
               <Skeleton className="h-[18px] sm:h-5 md:h-6 w-52"/>
               <Skeleton className="h-[18px] sm:h-5 w-28"/>
               {hasErr && (
                    <Skeleton className="h-4 w-1/3"/>
               )}
               <Skeleton className={cn("h-9",isStartup ? "w-[82px]" : "w-40")}/>
               <Skeleton className="h-4 w-1/2"/>
          </>
     )
}