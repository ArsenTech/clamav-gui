import { Skeleton } from "@/components/ui/skeleton";

export function SafetyIndicatorLoader(){
     return (
          <div className="h-48 xs:h-56 sm:h-60 lg:h-64 bg-linear-to-b from-card to-transparent w-full rounded-none xs:rounded-bl-[64px] md:rounded-bl-[100px] flex justify-center md:justify-between items-center px-10 flex-col md:flex-row gap-0 md:gap-24">
               <Skeleton className="size-16 sm:size-24 md:size-32 lg:size-45 md:flex-1"/>
               <div className="flex flex-col items-center justify-center gap-2 flex-wrap md:flex-3 w-full">
                    <Skeleton className="h-5 md:h-6 lg:h-8 xl:h-12 w-full mt-2 md:mt-0"/>
                    <div className="flex justify-center items-center gap-4 flex-wrap flex-col lg:flex-row w-full">
                         <Skeleton className="h-3 sm:h-3.5 md:h-4 w-full md:w-64 lg:w-[210px]"/>
                         <Skeleton className="h-3 sm:h-3.5 md:h-4 w-full md:w-64 lg:w-[210px]"/>
                    </div>
               </div>
          </div>
     )
}
export default function OverviewLoader(){
     return (
          <>
               <SafetyIndicatorLoader/>
               <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full p-4 gap-4">
                    {Array.from({length: 8}).map((_,i)=>(
                         <Skeleton key={`item-${i+1}`} className="w-full h-36"/>
                    ))}
               </div>
          </>
     )
}