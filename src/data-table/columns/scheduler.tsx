import { ColumnDef } from "@tanstack/react-table";
import { ScanType } from "@/lib/types/enums";
import { IntervalType, ISchedulerData } from "@/lib/types/data";
import { ISchedulerState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import SortableHeader from "../cells/sortable-header";
import IntervalCell from "../cells/scheduler/interval";
import ScanTypeCell from "../cells/scheduler/scan-type";
import ActionsCell from "../cells/scheduler/actions";

export const GET_SCHEDULER_COLS = (
     setState:  (overrides: Partial<ISchedulerState>) => void,
): ColumnDef<ISchedulerData<"state">>[] => [
     {
          accessorKey: "id",
          header: ()=>{
               const {t} = useTranslation("table");
               return t("heading.scheduler.job-name")
          },
     },
     {
          accessorKey: "interval",
          header: ()=>{
               const {t} = useTranslation("table");
               return t("heading.scheduler.interval")
          },
          cell: ({getValue}) => <IntervalCell type={getValue<IntervalType>()}/>
     },
     {
          accessorKey: "scanType",
          header: ()=>{
               const {t} = useTranslation("table");
               return t("heading.scheduler.scan-type")
          },
          cell: ({getValue}) => <ScanTypeCell scanType={getValue<ScanType>()}/>
     },
     {
          accessorKey: "lastScan",
          header: ({column}) => {
               const {t} = useTranslation("table");
               return (
                    <SortableHeader
                         column={column}
                         title={t("heading.scheduler.last-scan")}
                    />
               )
          },
          cell: ({getValue}) => {
               const {formatDate} = useSettings();
               return formatDate(getValue<string>())
          }
     },
     {
          accessorKey: "nextScan",
          header: ({column}) => {
               const {t} = useTranslation("table");
               return (
                    <SortableHeader
                         column={column}
                         title={t("heading.scheduler.next-scan")}
                    />
               )
          },
          cell: ({getValue}) => {
               const {formatDate} = useSettings();
               return formatDate(getValue<string>())
          }
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