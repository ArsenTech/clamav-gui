import { cn } from "@/lib/utils";
import { CheckCircle, SearchCheck, ShieldAlert, ShieldCheck, ShieldClose } from "lucide-react"

interface Props{
     type: "safe" | "warning" | "alert"
}
export default function SafetyIndicator({type}: Props){
     const Icon = type==="safe" ? ShieldCheck : type==="warning" ? ShieldAlert : ShieldClose;
     const text = type==="safe" ? "The Device is safe!" : type==="alert" ? "The Device is Vulnerable!" : "Some Protection settings are disabled.";
     return (
          <div className={cn(
               "h-72 bg-linear-to-b from-transparent w-full rounded-bl-[128px] flex justify-center md:justify-between items-center px-10 flex-col md:flex-row",
               type==="safe" && "to-emerald-200",
               type==="alert" && "to-red-200",
               type==="warning" && "to-amber-200"
          )}>
               <Icon className={cn("size-24 md:size-48 md:flex-1",type==="safe" && "text-emerald-950",type==="alert" && "text-red-950",type==="warning" && "text-amber-950")}/>
               <div className="flex flex-col items-center justify-center gap-2 flex-wrap md:flex-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight font-medium mt-2 md:mt-0 text-center w-full">{text}</h1>
                    <ul className="flex justify-center items-center gap-4 flex-wrap flex-col lg:flex-row w-full md:w-3/4">
                         <li className="flex items-center gap-2 text-base md:text-lg flex-1 md:flex-none!"><SearchCheck className="size-5 md:size-6"/> Last Scan: 2 hours ago</li>
                         <li className="flex items-center gap-2 text-base md:text-lg flex-1 md:flex-none!"><CheckCircle className="size-5 md:size-6"/> Definitions: Up to date</li>
                    </ul>
               </div>
          </div>
     )
}