import LogText from "@/components/log";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings";
import { fetchLogs } from "@/data/logs";
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
               const fetched = await fetchLogs(logId,category);
               setLogs(fetched)
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