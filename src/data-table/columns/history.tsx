import { IHistoryData, HistoryStatus } from "@/lib/types/data";
import { ColumnDef } from "@tanstack/react-table";
import { IHistoryPageState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { HistoryType } from "@/lib/types/enums";
import SortableHeader from "../cells/sortable-header";
import StatusCell from "../cells/history/status";
import ActionsCell from "../cells/history/actions";
import MarkAcknowledgedCell from "../cells/history/mark-acknowledged";

export const GET_HISTORY_COLS = (
     setHistoryState: React.Dispatch<React.SetStateAction<IHistoryPageState>>,
     isDevMode: boolean
): ColumnDef<IHistoryData<"state">>[] => {
     const baseCols: ColumnDef<IHistoryData<"state">>[] = [
          {
               accessorKey: "timestamp",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <SortableHeader
                              column={column}
                              title={t("heading.history.timestamp")}
                         />
                    )
               },
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(getValue<string>())
               }
          },
          {
               accessorKey: "action",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <SortableHeader
                              column={column}
                              title={t("heading.history.event")}
                         />
                    )
               },
               cell: ({getValue}) => {
                    const {t} = useTranslation("history");
                    return t(`events.${getValue<HistoryType>()}`)
               }
          },
          {
               accessorKey: "details",
               header: () => {
                    const {t} = useTranslation("table")
                    return t("heading.history.details")
               },
               cell: ({ getValue }) => (
                    <div className="max-w-xs truncate">
                         {getValue<string>()}
                    </div>
               )
          },
          {
               accessorKey: "status",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.status")
               },
               cell: ({getValue}) => <StatusCell historyStatus={getValue<HistoryStatus>()} />
          },
          {
               id: "actions",
               cell: ({row}) => (
                    <ActionsCell
                         item={row.original}
                         setHistoryState={setHistoryState}
                    />
               )
          }
     ];
     const acknowledgeCol: ColumnDef<IHistoryData<"state">> = {
          id: "isAcknowledged",
          cell: ({row}) => (
               <MarkAcknowledgedCell
                    item={row.original}
                    setHistoryState={setHistoryState}
               />
          )
     };
     return isDevMode ? [
          acknowledgeCol,
          {
               accessorKey: "id",
               header: "Entry ID"
          },
          ...baseCols
     ] : [
          acknowledgeCol,
          ...baseCols
     ];
}