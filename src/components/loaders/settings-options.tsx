import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"

interface Props{
     optionType: "switch" | "input" | "choice",
     width?: number,
     type?: "static" | "animated"
}
export default function SettingsOptionLoader({optionType, width, type="static"}: Props){
     return (
          <div className="flex flex-row items-center justify-between w-full">
               <div className="space-y-1 w-full">
                    {type==="animated" ? <Skeleton className="h-3.5 w-2/5"/> : <div className="h-3.5 bg-accent rounded-md w-2/5"/> }
                    {type==="animated" ? <Skeleton className="h-3.5 w-1/4"/> : <div className="h-3.5 bg-accent rounded-md w-1/4"/>}
               </div>
               {optionType==="switch" ? (
                    type==="animated" ? <Skeleton className="w-8 h-[18px]"/> : <div className="w-8 h-[18px] bg-accent rounded-md"/>
               ) : optionType==="input" ? (
                    type==="animated" ? <Skeleton className="w-1/3 h-9"/> : <div className="w-1/3 h-9 bg-accent rounded-md"/>
               ) : (
                    type==="animated" ? <Skeleton className={cn("h-9", !width && "w-48")} style={{width}}/> : <div className={cn("h-9 bg-accent rounded-md", !width && "w-48")} style={{width}}/>
               )}
          </div>
     )
}