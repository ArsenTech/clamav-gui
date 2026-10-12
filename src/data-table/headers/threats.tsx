import { IThreatsData } from "@/lib/types/data";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import SortableHeader from "./sortable-header";

interface SortableHeaderProps{
     column: Column<IThreatsData>
}
export function DisplayNameHeader({column}: SortableHeaderProps){
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
export function DetectedHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.threats"
     });
     return t("detected-at")
}
export function StatusHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading"
     });
     return t("status")
}
export function IdHeader(){
     const {t} = useTranslation("table",{
          keyPrefix: "heading.threats"
     });
     return t("id")
}