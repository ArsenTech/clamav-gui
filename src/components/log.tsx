import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { ScrollArea } from "./ui/scroll-area";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";

interface Props{
     logs: string[],
     isLoading?: boolean
}
export default function LogText({logs, isLoading}: Props){
     const {settings} = useSettings();
     const logRef = useRef<HTMLPreElement>(null);
     useEffect(()=>{
          if(!logRef.current) return;
          if(settings.autoScrollText && logs.length > 0){
               logRef.current.scrollIntoView({behavior: "smooth"})
          }
     },[settings.autoScrollText, logs]);
     const {t} = useTranslation()
     return (
          <ScrollArea className="min-h-[calc(100vh-200px)]">
               <pre className="whitespace-pre-wrap text-sm"> {isLoading ? (
                    <code className="inline-block w-full break-all">{t("log.please-wait")}</code>
               ) : logs.slice(-settings.maxLogLines).map((val,i)=>{
                    const isLast = i === logs.length-1;
                    const line = val.toLowerCase();
                    return (
                         <code key={`log-${i+1}`} ref={isLast ? logRef : undefined} className={cn(
                              "inline-block w-full break-all",
                              line.includes("warning") && "text-amber-600 dark:text-amber-400",
                              (line.includes("ok") || line.includes("updated")) && "text-emerald-700 dark:text-emerald-400",
                              (line.includes("found") || line.includes("error")) && "text-destructive"
                         )}>{val}</code>
                    )
               })}</pre>
          </ScrollArea>
     )
}