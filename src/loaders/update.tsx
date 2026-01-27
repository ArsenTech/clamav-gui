import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateLoader(){
     return (
          <>
          <div className="space-y-4">
               <Skeleton className="h-6 md:h-[30px] w-1/4"/>
               <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center items-center gap-4 w-full">
                         <Skeleton className="size-12"/>
                         <div className="text-center space-y-1.5 w-40">
                              <Skeleton className="h-5 md:h-6 lg:h-[30px] xl:h-8 w-full"/>
                              <Skeleton className="h-3.5 w-full"/>
                         </div>
                    </div>
                    <Skeleton className="h-9 w-[157px]"/>
                    <Skeleton className="h-3.5 w-64"/>
               </div>
          </div>
          <Skeleton className="h-6 md:h-[30px] w-14"/>
          </>
     )
}