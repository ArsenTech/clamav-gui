import { ColumnDef } from "@tanstack/react-table";
import { IQuarantineData } from "@/lib/types/data";
import ActionsCell from "../actions/quarantine";
import { FilePathHeader, IdHeader, QuarantineDateHeader, SizeHeader, ThreatNameHeader } from "../headers/quarantine";
import { DateCell, SizeCell } from "../cells";

export const GET_QUARANTINE_COLS = (isDevMode: boolean): ColumnDef<IQuarantineData>[] => {
     const baseCols: ColumnDef<IQuarantineData>[] = [
          {
               accessorKey: "threat_name",
               header: ({column}) => <ThreatNameHeader column={column}/>
          },
          {
               accessorKey: "file_path",
               header: () => <FilePathHeader/>
          },
          {
               accessorKey: "quarantined_at",
               header: ({column}) => <QuarantineDateHeader column={column}/>,
               cell: ({getValue}) => <DateCell value={getValue<string>()}/>
          },
          {
               accessorKey: "size",
               header: ({column}) => <SizeHeader column={column}/>,
               cell: ({getValue}) => <SizeCell value={getValue<number>()}/>
          },
          {
               id: "actions",
               cell: ({ row }) => (
                    <ActionsCell
                         threat={row.original}
                    />
               ),
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