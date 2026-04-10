import { ScanType } from "@/lib/types/enums";
import { Badge } from "@/components/ui/badge";
import { SCAN_TYPES } from "@/lib/constants";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ScanTypeCellProps{
     scanType: ScanType
}
export default function ScanTypeCell({scanType}: ScanTypeCellProps){
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