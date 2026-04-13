import { IThreatsData } from "@/lib/types/data";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import SortableHeader from "./sortable-header";

interface SortableHeaderProps{
     column: Column<IThreatsData>
}
export function DisplayNameHeader({column}: SortableHeaderProps){
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
export function DetectedHeader(){
     const {t} = useTranslation("table");
     return t("heading.threats.detected-at")
}
export function StatusHeader(){
     const {t} = useTranslation("table");
     return t("heading.status")
}
export function IdHeader(){
     const {t} = useTranslation("table");
     return t("heading.threats.id")
}