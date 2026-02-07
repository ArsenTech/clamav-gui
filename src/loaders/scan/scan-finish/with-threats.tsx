import { Skeleton } from "@/components/ui/skeleton";
import { TableLoaderProps } from "@/lib/types/props";
import TableLoader from "@/components/loaders/table";

export default function ScanFinishedTableLoader({rows}: TableLoaderProps){
     return (
          <>
               <Skeleton className="size-32"/>
               <Skeleton className="h-[18px] sm:h-5 md:h-6 w-52"/>
               <Skeleton className="h-[18px] sm:h-5 w-28"/>
               <TableLoader
                    cols={4}
                    actionsAtEnd
                    rows={rows}
               />
               <Skeleton className="w-[276px] h-9"/>
               <Skeleton className="h-4 w-1/2"/>
          </>
     )
}