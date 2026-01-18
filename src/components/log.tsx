import { cn } from "@/lib/utils"
import { useRef } from "react"

interface Props{
     logs: string[]
}
export default function LogText({logs}: Props){
     const logRef = useRef<HTMLPreElement>(null)
     return (
          <pre className="whitespace-normal text-sm" ref={logRef}>{logs.map((val,i)=>(
               <code key={`log-${i+1} break-all`} className={cn(
                    "inline-block w-full",
                    val.includes("WARNING") && "text-amber-600",
                    val.includes("OK") && "text-emerald-700",
                    val.includes("FOUND") && "text-destructive"
               )}>{val}</code>
          ))}</pre>
     )
}