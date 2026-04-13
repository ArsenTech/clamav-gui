import { IQuarantineData } from "@/lib/types/data";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import SortableHeader from "./sortable-header";

interface SortableHeaderProps{
     column: Column<IQuarantineData>
}
export function ThreatNameHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table")
     return (
          <SortableHeader
               column={column}
               title={t("heading.threats.threat")}
          />
     )
}
export function FilePathHeader(){
     const {t} = useTranslation("table");
     return t("heading.threats.path")
}
export function QuarantineDateHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table")
     return (
          <SortableHeader
               column={column}
               title={t("heading.quarantine.quarantined-at")}
          />
     )
}
export function SizeHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table")
     return (
          <SortableHeader
               column={column}
               title={t("heading.quarantine.size")}
          />
     )
}
export function IdHeader(){
     const {t} = useTranslation("table");
     return t("heading.quarantine.id")
}