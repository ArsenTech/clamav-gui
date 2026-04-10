import { Ban, Check, CheckCheck, TriangleAlert } from "lucide-react";
import { HistoryStatus } from "@/lib/types/data";
import { Badge } from "@/components/ui/badge";
import { getHistoryStatusBadges } from "@/lib/helpers";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusCellProps{
     historyStatus: HistoryStatus
}
export default function StatusCell({historyStatus}: StatusCellProps){
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