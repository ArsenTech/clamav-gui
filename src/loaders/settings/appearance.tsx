import { Skeleton } from "@/components/ui/skeleton"

export default function AppearanceSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-2">
               <Skeleton className="h-[18px] sm:h-5 md:h-6 lg:h-[30px] w-28"/>
               <div className="flex justify-center items-center flex-wrap gap-3">
                    <Skeleton className="h-32 min-w-32 flex-1"/>
                    <Skeleton className="h-32 min-w-32 flex-1"/>
                    <Skeleton className="h-32 min-w-32 flex-1"/>
               </div>
               <Skeleton className="h-[18px] sm:h-5 md:h-6 lg:h-[30px] w-28"/>
               <div className="flex justify-center items-center flex-wrap gap-3">
                    <Skeleton className="h-32 min-w-32 flex-1"/>
                    <Skeleton className="h-32 min-w-32 flex-1"/>
                    <Skeleton className="h-32 min-w-32 flex-1"/>
               </div>
          </div>
     )
}