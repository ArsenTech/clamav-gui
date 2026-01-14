import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, ShieldClose } from "lucide-react"

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
               <Icon className={cn("size-24 md:size-48 flex-1",type==="safe" && "text-emerald-950",type==="alert" && "text-red-950",type==="warning" && "text-amber-950")}/>
               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-center md:text-right leading-tight flex-1 md:flex-3 font-medium">{text}</h1>
          </div>
     )
}