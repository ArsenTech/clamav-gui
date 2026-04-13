import { ISchedulerData } from "@/lib/types/data";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import SortableHeader from "./sortable-header";

interface SortableHeaderProps{
     column: Column<ISchedulerData<"state">>
}
export function JobNameHeader(){
     const {t} = useTranslation("table");
     return t("heading.scheduler.job-name")
}
export function IntervalHeader(){
     const {t} = useTranslation("table");
     return t("heading.scheduler.interval")
}
export function ScanTypeHeader(){
     const {t} = useTranslation("table");
     return t("heading.scheduler.scan-type")
}
export function LastScanHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table");
     return (
          <SortableHeader
               column={column}
               title={t("heading.scheduler.last-scan")}
          />
     )
}
export function NextScanHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table");
     return (
          <SortableHeader
               column={column}
               title={t("heading.scheduler.next-scan")}
          />
     )
}