import { cn } from "@/lib/utils"
import { useRef } from "react"
import { ScrollArea } from "./ui/scroll-area";

interface Props{
     logs: string[],
     isLoading?: boolean
}
export default function LogText({logs, isLoading}: Props){
     const logRef = useRef<HTMLPreElement>(null);
     return (
          <ScrollArea className="min-h-[calc(100vh-200px)]">
               <pre className="whitespace-pre-wrap text-sm" ref={logRef}>{isLoading ? (
                    <code className="inline-block w-full break-all">Loading...</code>
               ) : logs.map((val,i)=>(
                    <code key={`log-${i+1}`} className={cn(
                         "inline-block w-full break-all",
                         val.includes("WARNING") && "text-amber-600 dark:text-amber-400",
                         (val.includes("OK") || val.includes("updated")) && "text-emerald-700 dark:text-emerald-400",
                         (val.includes("FOUND") || val.includes("ERROR")) && "text-destructive"
                    )}>{val}</code>
               ))}</pre>
          </ScrollArea>
     )
}