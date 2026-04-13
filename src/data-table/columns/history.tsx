import { IHistoryData, HistoryStatus } from "@/lib/types/data";
import { ColumnDef } from "@tanstack/react-table";
import { IHistoryPageState } from "@/lib/types/states";
import { HistoryType } from "@/lib/types/enums";
import ActionsCell from "../actions/history";
import { DetailsHeader, EventHeader, IdHeader, StatusHeader, TimestampHeader } from "../headers/history";
import { StatusCell, MarkAcknowledgedCell, EventCell, DetailsCell } from "../cells/history";
import { DateCell } from "../cells";

export const GET_HISTORY_COLS = (
     setHistoryState: React.Dispatch<React.SetStateAction<IHistoryPageState>>,
     isDevMode: boolean
): ColumnDef<IHistoryData<"state">>[] => {
     const baseCols: ColumnDef<IHistoryData<"state">>[] = [
          {
               accessorKey: "timestamp",
               header: ({column}) => <TimestampHeader column={column}/>,
               cell: ({getValue}) => <DateCell value={getValue<string>()}/>
          },
          {
               accessorKey: "action",
               header: ({column}) => <EventHeader column={column}/>,
               cell: ({getValue}) => <EventCell historyType={getValue<HistoryType>()}/>
          },
          {
               accessorKey: "details",
               header: () => <DetailsHeader/>,
               cell: ({ getValue }) => <DetailsCell value={getValue<string>()}/>
          },
          {
               accessorKey: "status",
               header: () => <StatusHeader/>,
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
               header: () => <IdHeader/>
          },
          ...baseCols
     ] : [
          acknowledgeCol,
          ...baseCols
     ];
}