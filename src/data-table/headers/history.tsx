import { useTranslation } from "react-i18next"
import SortableHeader from "./sortable-header"
import { Column } from "@tanstack/react-table"
import { IHistoryData } from "@/lib/types/data"

interface SortableHeaderProps{
     column: Column<IHistoryData<"state">>
}
export function TimestampHeader({column}: SortableHeaderProps) {
     const {t} = useTranslation("table",{
          keyPrefix: "heading.history"
     })
     return (
          <SortableHeader
               column={column}
               title={t("timestamp")}
          />
     )
}
export function EventHeader({column}: SortableHeaderProps){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.history"
     })
     return (
          <SortableHeader
               column={column}
               title={t("event")}
          />
     )
}
export function DetailsHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.history"
     })
     return t("details")
}
export function StatusHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading"
     });
     return t("status")
}
export function IdHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.history"
     });
     return t("id")
}