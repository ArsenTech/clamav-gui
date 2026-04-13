import { CalendarSearch } from "lucide-react";
import { IntervalType } from "@/lib/types/data";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { SCAN_TYPES } from "@/lib/constants";
import { ScanType } from "@/lib/types/enums";
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

export function IntervalCell({type}: {type: IntervalType}){
     const {t} = useTranslation("table");
     const {settings} = useSettings();
     return (
          <Badge>
               {settings.badgeVisibility==="icon-text" && (
                    <CalendarSearch />
               )}
               {t(`interval.${type}`)}
          </Badge>
     )
}
export function ScanTypeCell({scanType}: {scanType: ScanType}){
     const scanInfo = SCAN_TYPES.find(item=>item.type===scanType);
     const {t} = useTranslation("scan");
     const {settings} = useSettings();
     if(!scanInfo) return null;
     return scanInfo.type!==ScanType.None && (
          settings.badgeVisibility==="icon" ? (
               <Tooltip>
                    <TooltipTrigger asChild>
                         <scanInfo.Icon/>
                    </TooltipTrigger>
                    <TooltipContent>
                         {t(`scan-type.${scanInfo.type}.name`)}
                    </TooltipContent>
               </Tooltip>
          ) : (
               <Badge variant="outline">
                    {settings.badgeVisibility==="icon-text" && (
                         <scanInfo.Icon/>
                    )}
                    {t(`scan-type.${scanInfo.type}.name`)}
               </Badge>
          )
     )
}