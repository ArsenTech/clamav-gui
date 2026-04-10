import { ColumnDef } from "@tanstack/react-table";
import { IQuarantineData } from "@/lib/types/data";
import { IQuarantineState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { formatBytes } from "@/lib/helpers/formating";
import SortableHeader from "../cells/sortable-header";
import ActionsCell from "../cells/quarantine/actions";

export const GET_QUARANTINE_COLS = (
     setState: (overrides: Partial<IQuarantineState>) => void,
     isDevMode: boolean
): ColumnDef<IQuarantineData>[] => {
     const baseCols: ColumnDef<IQuarantineData>[] = [
          {
               accessorKey: "threat_name",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <SortableHeader
                              column={column}
                              title={t("heading.threats.threat")}
                         />
                    )
               }
          },
          {
               accessorKey: "file_path",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.threats.path")
               }
          },
          {
               accessorKey: "quarantined_at",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <SortableHeader
                              column={column}
                              title={t("heading.quarantine.quarantined-at")}
                         />
                    )
               },
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(getValue<string>())
               }
          },
          {
               accessorKey: "size",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <SortableHeader
                              column={column}
                              title={t("heading.quarantine.size")}
                         />
                    )
               },
               cell: ({getValue}) => {
                    const {t} = useTranslation()
                    return formatBytes(getValue<number>(),t)
               }
          },
          {
               id: "actions",
               cell: ({ row }) => (
                    <ActionsCell
                         threat={row.original}
                         setState={setState}
                    />
               ),
          }
     ];
     return isDevMode ? [
          {
               accessorKey: "id",
               header: "Threat ID"
          },
          ...baseCols
     ] : baseCols;
}