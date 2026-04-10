import { Bug, BugOff, ShieldCheck } from "lucide-react";
import { ThreatStatus } from "@/lib/types/data";
import { getThreatStatusBadges } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusCellProps{
     threatStatus: ThreatStatus
}
export default function StatusCell({threatStatus}: StatusCellProps){
     const {t} = useTranslation("table");
     const {settings} = useSettings();
     const iconClassName = cn(
          threatStatus === "deleted" && "text-primary",
          threatStatus === "detected" && "text-destructive",
          threatStatus === "quarantined" && "text-muted-foreground",
          "text-center"
     )
     const icon = threatStatus === "deleted" ? (
          <ShieldCheck/>
     ) : threatStatus === "detected" ? (
          <Bug/>
     ) : (
          <BugOff/>
     )
     return settings.badgeVisibility === "icon" ? (
          <Tooltip>
               <TooltipTrigger className={iconClassName} asChild>
                    {icon}
               </TooltipTrigger>
               <TooltipContent>
                    {t(`status.threats.${threatStatus}`)}
               </TooltipContent>
          </Tooltip>
     ) : (
          <Badge variant={getThreatStatusBadges(threatStatus)} className="gap-1.5">
               {settings.badgeVisibility==="icon-text" && icon}
               {t(`status.threats.${threatStatus}`)}
          </Badge>
     )
}