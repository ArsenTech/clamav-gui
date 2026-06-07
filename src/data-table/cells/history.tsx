import { HistoryType } from "@/lib/types/enums";
import { useTranslation } from "react-i18next";
import { Ban, Check, CheckCheck, TriangleAlert } from "lucide-react";
import { HistoryStatus } from "@/lib/types/data";
import { Badge } from "@/components/ui/badge";
import { getHistoryStatusBadges } from "@/lib/helpers";
import { useSettings } from "@/context/settings";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";
import { IHistoryData } from "@/lib/types/data";
import { getErrorMessage } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { useAppHistory } from "@/context/antivirus/history";

interface MarkAcknowledgedCellProps{
     item: IHistoryData<"state">
}
export function MarkAcknowledgedCell({item}: MarkAcknowledgedCellProps){
     const {setHistoryState} = useAppHistory()
     const {t} = useTranslation("table")
     const {t: messageTxt} = useTranslation("messages")
     const markAsAcknowledged = async () => {
          try{
               await invoke("mark_as_acknowledged", {
                    id: item.id,
                    date: item.timestamp.split("T")[0]
               });
               setHistoryState(prev=>({
                    ...prev,
                    data: prev.data.map(val=>({
                         ...val,
                         status: val.id===item.id ? "acknowledged" : val.status
                    }))
               }))
               toast.success(messageTxt("acknowledge-history.success"))
          } catch (err){
               toast.error(messageTxt("acknowledge-history.error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     return (
          <Button variant="ghost" size="icon" title={t("mark-as-acknowledged")} onClick={markAsAcknowledged} disabled={item.status==="acknowledged"}>
               <CheckCircle/>
          </Button>
     )
}
export function StatusCell({historyStatus}: {historyStatus: HistoryStatus}){
     const {t} = useTranslation("table");
     const {settings} = useSettings();
     const iconClassName = cn(
          historyStatus==="success" && "text-emerald-600 dark:text-emerald-400",
          historyStatus === "error" && "text-destructive",
          historyStatus === "warning" && "text-amber-600 dark:text-amber-400",
          historyStatus === "acknowledged" && "text-muted-foreground",
          "text-center"
     )
     const icon = historyStatus==="success" ? (
          <Check/>
     ) : historyStatus === "error" ? (
          <Ban/>
     ) : historyStatus === "warning" ? (
          <TriangleAlert/>
     ) : (
          <CheckCheck/>
     )
     return settings.badgeVisibility === "icon" ? (
          <Tooltip>
               <TooltipTrigger className={iconClassName} asChild>
                    {icon}
               </TooltipTrigger>
               <TooltipContent>
                    {t(`status.history.${historyStatus}`)}
               </TooltipContent>
          </Tooltip>
     ) : (
          <Badge variant={getHistoryStatusBadges(historyStatus)} className="gap-1.5">
               {settings.badgeVisibility==="icon-text" && icon}
               {t(`status.history.${historyStatus}`)}
          </Badge>
     )
}
export function EventCell({historyType}: {historyType: HistoryType}){
     const {t} = useTranslation("history");
     return t(`events.${historyType}`)
}
export function DetailsCell({value}: {value: string}){
     return (
          <div className="max-w-xs truncate">
               {value}
          </div>
     )
}