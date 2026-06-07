import { ColumnDef } from "@tanstack/react-table";
import { IThreatsData, ThreatStatus } from "@/lib/types/data";
import ActionsCell from "../actions/threats";
import StatusCell from "../cells/threats";
import { DetectedHeader, DisplayNameHeader, FilePathHeader, IdHeader, StatusHeader } from "../headers/threats";
import { DateCell } from "../cells";

export const GET_THREATS_COLS = (isDevMode: boolean): ColumnDef<IThreatsData>[] => {
     const baseCols: ColumnDef<IThreatsData>[] = [
          {
               accessorKey: "displayName",
               header: ({column}) => <DisplayNameHeader column={column}/>
          },
          {
               accessorKey: "filePath",
               header: () => <FilePathHeader/>
          },
          {
               accessorKey: "detectedAt",
               header: () => <DetectedHeader/>,
               cell: ({getValue}) => <DateCell value={getValue<string>()}/>
          },
          {
               accessorKey: "status",
               header: () => <StatusHeader/>,
               cell: ({getValue}) => <StatusCell threatStatus={getValue<ThreatStatus>()}/>
          },
          {
               id: "actions",
               cell: ({ row }) => <ActionsCell threat={row.original}/>
          }
     ];
     return isDevMode ? [
          {
               accessorKey: "id",
               header: () => <IdHeader/>
          },
          ...baseCols
     ] : baseCols;
}