import { CalendarSearch } from "lucide-react";
import { IntervalType } from "@/lib/types/data";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";

interface IntervalCellProps{
     type: IntervalType
}
export default function IntervalCell({type}: IntervalCellProps){
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