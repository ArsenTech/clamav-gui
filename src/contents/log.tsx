import LogText from "@/components/log";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings";
import { invoke } from "@tauri-apps/api/core";
import { ChevronLeft, ScrollText } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router";

interface Props{
     returnUrl: string
}
export default function LogContent({returnUrl}: Props){
     const {settings} = useSettings()
     const {logId} = useParams<{ logId: string }>();
     const [logs, setLogs] = useState<string[]>([]);
     const [isLoading, startTransition] = useTransition();
     const [searchParams] = useSearchParams();
     const category = searchParams.get("category");
     useEffect(()=>{
          startTransition(async()=>{
               if(!logId || !category){
                    setLogs([`[ERROR] Failed to load the log (Log ID: ${logId})`])
                    return;
               }
               try{
                    const logs = await invoke<string>("read_log",{
                         id: logId,
                         category
                    })
                    setLogs(logs.split("\n").filter(Boolean))
               } catch (err) {
                    setLogs([`[ERROR] Failed to load the log (Log ID: ${logId})`])
                    console.error(err)
               }
          })
     },[])
     const {t} = useTranslation()
     return (
          <div className="space-y-4">
               <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{t("log.page-name")}</h1>
               {settings.developerMode && (
                    <p className="text-muted-foreground flex items-center gap-2"><ScrollText className="size-5"/> {t("log.log-id")} {logId}</p>
               )}
               <Button asChild size="sm" variant="outline">
                    <Link to={returnUrl}>
                         <ChevronLeft/>
                         {t("log.back")}
                    </Link>
               </Button>
               <LogText
                    logs={logs}
                    isLoading={isLoading}
               />
          </div>
     )
}