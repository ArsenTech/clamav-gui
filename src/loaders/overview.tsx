import { Skeleton } from "@/components/ui/skeleton";
import { QUICK_ACCESS_LINKS } from "@/lib/constants/links";

export default function OverviewLoader(){
     return (
          <>
               <div className="h-72 bg-linear-to-b from-transparent w-full rounded-bl-[128px] flex justify-center md:justify-between items-center px-10 flex-col md:flex-row gap-0 md:gap-24">
                    <Skeleton className="size-24 md:size-48 md:flex-1"/>
                    <div className="flex flex-col items-center justify-center gap-2 flex-wrap md:flex-3 w-full">
                         <Skeleton className="h-6 sm:h-[30px] md:h-8 lg:h-12 w-full mt-2 md:mt-0"/>
                         <div className="flex justify-center items-center gap-4 flex-wrap flex-col lg:flex-row w-full">
                              <Skeleton className="h-4 md:h-[18px] w-full md:w-64 lg:w-[210px]"/>
                              <Skeleton className="h-4 md:h-[18px] w-full md:w-64 lg:w-[210px]"/>
                         </div>
                    </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full p-4 gap-4">
                    {QUICK_ACCESS_LINKS.map((_,i)=>(
                         <Skeleton key={`item-${i+1}`} className="w-full h-36"/>
                    ))}
               </div>
          </>
     )
}