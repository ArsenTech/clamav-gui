import { cn } from "@/lib/utils"
import { useRef } from "react"

interface Props{
     logs: string[],
     isLoading?: boolean
}
export default function LogText({logs, isLoading}: Props){
     const logRef = useRef<HTMLPreElement>(null);
     return (
          <div className="min-h-[calc(100vh-200px)] overflow-y-auto">
               <pre className="whitespace-pre-wrap text-sm" ref={logRef}>{isLoading ? (
                    <code className="inline-block w-full break-all">Loading...</code>
               ) : logs.map((val,i)=>(
                    <code key={`log-${i+1}`} className={cn(
                         "inline-block w-full break-all",
                         val.includes("WARNING") && "text-amber-600",
                         (val.includes("OK") || val.includes("updated")) && "text-emerald-700",
                         (val.includes("FOUND") || val.includes("ERROR")) && "text-destructive"
                    )}>{val}</code>
               ))}</pre>
          </div>
     )
}