import { ColumnDef } from "@tanstack/react-table";
import { IThreatsData, ThreatStatus } from "@/lib/types/data";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import SortableHeader from "../cells/sortable-header";
import StatusCell from "../cells/threats/status";
import ActionsCell from "../cells/threats/actions";

export const GET_THREATS_COLS = (
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     setState: (overrides: Partial<IFinishScanState>) => void,
     isDevMode: boolean
): ColumnDef<IThreatsData>[] => {
     const baseCols: ColumnDef<IThreatsData>[] = [
          {
               accessorKey: "displayName",
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
               accessorKey: "filePath",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.threats.path")
               }
          },
          {
               accessorKey: "detectedAt",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.threats.detected-at")
               },
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(getValue<string>())
               }
          },
          {
               accessorKey: "status",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.status")
               },
               cell: ({getValue}) => <StatusCell threatStatus={getValue<ThreatStatus>()}/>
          },
          {
               id: "actions",
               cell: ({ row }) => (
                    <ActionsCell
                         threat={row.original}
                         setScanState={setScanState}
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