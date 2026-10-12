import { IQuarantineData } from "@/lib/types/data";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import SortableHeader from "./sortable-header";

interface SortableHeaderProps{
     column: Column<IQuarantineData>
}
export function ThreatNameHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.threats"
     })
     return (
          <SortableHeader
               column={column}
               title={t("threat")}
          />
     )
}
export function FilePathHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.threats"
     });
     return t("path")
}
export function QuarantineDateHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.quarantine"
     })
     return (
          <SortableHeader
               column={column}
               title={t("quarantined-at")}
          />
     )
}
export function SizeHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.quarantine"
     })
     return (
          <SortableHeader
               column={column}
               title={t("size")}
          />
     )
}
export function IdHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.quarantine"
     });
     return t("id")
}