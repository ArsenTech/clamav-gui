import { Skeleton } from "@/components/ui/skeleton";

export function AboutContentLoader(){
     return (
          <div className="space-y-4.5 max-h-205">
               <Skeleton className="h-6 md:h-7.5 w-[256px]"/>
               <div className="flex items-center justify-center gap-4 flex-col">
                    <Skeleton className="pt-1.5 w-full max-w-125 h-32.5"/>
                    <Skeleton className="h-5 md:h-6 w-[256px]"/>
               </div>
               <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-3/4"/>
               </div>
               <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-3/4"/>
               </div>
               <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-3/4"/>
               </div>
               <div className="space-y-1.5 w-full">
                    <Skeleton className="h-3.5 w-full"/>
                    <Skeleton className="h-3.5 w-full"/>
                    <Skeleton className="h-3.5 w-full"/>
               </div>
               <Skeleton className="h-3.5 w-1/2"/>
               <Skeleton className="h-1 w-full"/>
               <Skeleton className="h-3.5 w-full"/>
               <div className="flex justify-center gap-2 flex-wrap">
                    <Skeleton className="h-9 flex-1"/>
                    <Skeleton className="h-9 flex-1"/>
                    <Skeleton className="h-9 flex-1"/>
                    <Skeleton className="h-9 flex-1"/>
               </div>
               <div className="flex items-center justify-center">
                    <Skeleton className="h-4.5 w-3/4"/>
               </div>
          </div>
     )
}
export function CreditsSectionLoader(){
     return (
          <div className="space-y-6 max-h-205">
               <Skeleton className="h-6 md:h-8 w-[256px]"/>
               {Array.from({length: 4}).map((_,i)=>(
                    <div className="space-y-1.5 mt-2" key={i+1}>
                         <Skeleton className="h-5 md:h-6 w-1/2"/>
                         <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                   <Skeleton className="size-3"/>
                                   <Skeleton className="h-4 md:h-4.5 w-full"/>
                              </div>
                              <div className="flex items-center gap-4">
                                   <Skeleton className="size-3"/>
                                   <Skeleton className="h-4 md:h-4.5 w-full"/>
                              </div>
                              <div className="flex items-center gap-4">
                                   <Skeleton className="size-3"/>
                                   <Skeleton className="h-4 md:h-4.5 w-full"/>
                              </div>
                              <div className="flex items-center gap-4">
                                   <Skeleton className="size-3"/>
                                   <Skeleton className="h-4 md:h-4.5 w-full"/>
                              </div>
                              <div className="flex items-center gap-4">
                                   <Skeleton className="size-3"/>
                                   <Skeleton className="h-4 md:h-4.5 w-full"/>
                              </div>
                         </div>
                    </div>
               ))}
               <div className="space-y-1.5 w-full">
                    <Skeleton className="h-3.5 w-full"/>
                    <Skeleton className="h-3.5 w-full"/>
                    <Skeleton className="h-3.5 w-3/4"/>
               </div>
          </div>
     )
}