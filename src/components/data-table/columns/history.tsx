import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle } from "lucide-react";
import { HistoryStatus, IHistoryData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { capitalizeText, getHistoryStatusBadges } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export const GET_HISTORY_COLS = (
     setData: React.Dispatch<React.SetStateAction<IHistoryData[]>>
): ColumnDef<IHistoryData>[] => [
     {
          accessorKey: "timestamp",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Timestamp</span>
                    <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                         {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                    </Button>
               </div>
          ),
          cell: ({getValue}) => new Date(getValue() as string).toLocaleString()
     },
     {
          accessorKey: "action",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Action (Event)</span>
                    <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                         {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                    </Button>
               </div>
          )
     },
     {
          accessorKey: "details",
          header: "Details",
          cell: ({ getValue }) => (
               <div className="max-w-[420px] truncate">
                    {getValue() as string}
               </div>
          )
     },
     {
          accessorKey: "status",
          header: "Status",
          cell: ({getValue}) => <Badge variant={getHistoryStatusBadges(getValue() as HistoryStatus)}>
               {capitalizeText(getValue() as string)}
          </Badge>
     },
     {
          id: "actions",
          cell: ({row}) => {
               const item = row.original
               const markAsAcknowledged = async () => {
                    try{
                         await invoke("mark_as_acknowledged", {
                              id: item.id,
                              date: item.timestamp.split("T")[0]
                         });
                         setData(prev=>prev.map(val=>({
                              ...val,
                              status: val.id===item.id ? "acknowledged" : val.status
                         })))
                         toast.success("Entry acknowledged!")
                    } catch (error){
                         toast.error("Failed to mark the entry as acknowledged");
                         console.error(error)
                    }
               }
               return (
                    <Button variant="ghost" size="icon" title="Mark As Acknowledged" onClick={markAsAcknowledged} disabled={item.status==="acknowledged"}>
                         <CheckCircle/>
                    </Button>
               )
          },
     }
]