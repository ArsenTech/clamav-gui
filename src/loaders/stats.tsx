import { Skeleton } from "@/components/ui/skeleton";

export default function StatsLoader(){
     return (
          <>
               <Skeleton className="h-6 md:h-[30px] lg:h-9 w-36"/>
               <Skeleton className="h-9 w-48"/>
               <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                         <Skeleton className="w-full min-h-40"/>
                         <Skeleton className="w-full h-[477px]"/>
                         <Skeleton className="w-full h-[457px]"/>
                         <div className="grid gris-cols-1 xl:grid-cols-2 w-full gap-2">
                              <Skeleton className="w-full aspect-square"/>
                              <Skeleton className="w-full aspect-square"/>
                         </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                         <Skeleton className="w-full h-[483px]"/>
                         <Skeleton className="w-full h-[483px]"/>
                         <Skeleton className="w-full h-[483px]"/>
                    </div>
               </div>
          </>
     )
}