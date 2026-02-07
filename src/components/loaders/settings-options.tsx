import { cn } from "@/lib/utils"

interface Props{
     optionType: "switch" | "input" | "choice",
     width?: number
}
export default function SettingsOptionLoader({optionType, width}: Props){
     return (
          <div className="flex flex-row items-center justify-between w-full">
               <div className="space-y-1 w-full">
                    <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                    <div className="h-3.5 bg-accent rounded-md w-1/4"/>
               </div>
               {optionType==="switch" ? (
                    <div className="w-8 h-[18px] bg-accent rounded-md"/>
               ) : optionType==="input" ? (
                    <div className="w-1/3 h-9 bg-accent rounded-md"/>
               ) : (
                    <div className={cn("h-9 bg-accent rounded-md", !width && "w-48")} style={{width}}/>
               )}
          </div>
     )
}