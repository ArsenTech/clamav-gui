import { Skeleton } from "@/components/ui/skeleton";
import useSettings from "@/hooks/use-settings";

export default function LogLoader(){
     const {settings} = useSettings()
     return (
          <div className="space-y-4">
               <Skeleton className="h-6 md:h-[30px] w-[150px]"/>
               {settings.developerMode && (
                    <Skeleton className="h-4 w-1/2"/>
               )}
               <Skeleton className="h-9 w-[75px]"/>
               <Skeleton className="h-3.5 w-1/5"/>
          </div>
     )
}