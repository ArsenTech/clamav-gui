import { ColumnDef } from "@tanstack/react-table";
import { ScanType } from "@/lib/types/enums";
import { IntervalType, ISchedulerData } from "@/lib/types/data";
import { ISchedulerState } from "@/lib/types/states";
import {IntervalCell, ScanTypeCell} from "../cells/scheduler";
import ActionsCell from "../actions/scheduler";
import { IntervalHeader, JobNameHeader, LastScanHeader, NextScanHeader, ScanTypeHeader } from "../headers/scheduler";
import { DateCell } from "../cells";

export const GET_SCHEDULER_COLS = (
     setState:  (overrides: Partial<ISchedulerState>) => void,
): ColumnDef<ISchedulerData<"state">>[] => [
     {
          accessorKey: "id",
          header: () => <JobNameHeader/>,
     },
     {
          accessorKey: "interval",
          header: () => <IntervalHeader/>,
          cell: ({getValue}) => <IntervalCell type={getValue<IntervalType>()}/>
     },
     {
          accessorKey: "scanType",
          header: () => <ScanTypeHeader/>,
          cell: ({getValue}) => <ScanTypeCell scanType={getValue<ScanType>()}/>
     },
     {
          accessorKey: "lastScan",
          header: ({column}) => <LastScanHeader column={column}/>,
          cell: ({getValue}) => <DateCell value={getValue<string>()}/>
     },
     {
          accessorKey: "nextScan",
          header: ({column}) => <NextScanHeader column={column}/>,
          cell: ({getValue}) => <DateCell value={getValue<string>()}/>
     },
     {
          id: "actions",
          cell: ({row}) => (
               <ActionsCell
                    item={row.original}
                    setState={setState}
               />
          ),
     }
]