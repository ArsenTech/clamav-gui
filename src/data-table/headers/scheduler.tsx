import { ISchedulerData } from "@/lib/types/data";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import SortableHeader from "./sortable-header";

interface SortableHeaderProps{
     column: Column<ISchedulerData<"state">>
}
export function JobNameHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.scheduler"
     });
     return t("job-name")
}
export function IntervalHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.scheduler"
     });
     return t("interval")
}
export function ScanTypeHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.scheduler"
     });
     return t("scan-type")
}
export function LastScanHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.scheduler"
     });
     return (
          <SortableHeader
               column={column}
               title={t("last-scan")}
          />
     )
}
export function NextScanHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.scheduler"
     });
     return (
          <SortableHeader
               column={column}
               title={t("next-scan")}
          />
     )
}