import { useTranslation } from "react-i18next"
import SortableHeader from "./sortable-header"
import { Column } from "@tanstack/react-table"
import { IHistoryData } from "@/lib/types/data"

interface SortableHeaderProps{
     column: Column<IHistoryData<"state">>
}
export function TimestampHeader({column}: SortableHeaderProps) {
     const {t} = useTranslation("table")
     return (
          <SortableHeader
               column={column}
               title={t("heading.history.timestamp")}
          />
     )
}
export function EventHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table")
     return (
          <SortableHeader
               column={column}
               title={t("heading.history.event")}
          />
     )
}
export function DetailsHeader(){
     const {t} = useTranslation("table")
     return t("heading.history.details")
}
export function StatusHeader(){
     const {t} = useTranslation("table");
     return t("heading.status")
}
export function IdHeader(){
     const {t} = useTranslation("table");
     return t("heading.history.id")
}