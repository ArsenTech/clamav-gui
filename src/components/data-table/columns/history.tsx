import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle, Ellipsis, FileText, ScrollText } from "lucide-react";
import { HistoryStatus, IHistoryData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { capitalizeText, getHistoryStatusBadges } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { IHistoryPageState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";

export const GET_HISTORY_COLS = (
     setHistoryState: React.Dispatch<React.SetStateAction<IHistoryPageState>>,
     isDevMode: boolean
): ColumnDef<IHistoryData<"state">>[] => {
     const baseCols: ColumnDef<IHistoryData<"state">>[] = [
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
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(new Date(getValue() as string))
               }
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
                    const revealLog = async()=>{
                         if(!item.logId || !item.category) return;
                         try{
                              await invoke("reveal_log",{
                                   category: item.category,
                                   id: item.logId
                              })
                         } catch(err){
                              toast.error("Failed to reveal log file");
                              console.error(err)
                         }
                    }
                    return (
                         <DropdownMenu>
                              <DropdownMenuTrigger>
                                   <Button variant="ghost" size="icon" title="Log Actions">
                                        <Ellipsis/>
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                   <DropdownMenuLabel>Log Actions</DropdownMenuLabel>
                                   <DropdownMenuSeparator/>
                                   <DropdownMenuItem disabled={!item.logId || !item.category} asChild>
                                        <Link to={`/history/${item.logId}?category=${item.category}`}>
                                             <ScrollText/> View Log
                                        </Link>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={revealLog} disabled={!item.logId || !item.category}>
                                        <FileText /> Reveal Log File
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                    )
               },
          }
     ];
     return isDevMode ? [
          {
               id: "isAcknowledged",
               cell: ({row}) => {
                    const item = row.original
                    const markAsAcknowledged = async () => {
                         try{
                              await invoke("mark_as_acknowledged", {
                                   id: item.id,
                                   date: item.timestamp.split("T")[0]
                              });
                              setHistoryState(prev=>({
                                   ...prev,
                                   data: prev.data.map(val=>({
                                        ...val,
                                        status: val.id===item.id ? "acknowledged" : val.status
                                   }))
                              }))
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
          },
          {
               accessorKey: "id",
               header: "Entry ID"
          },
          ...baseCols
     ] : [
          {
               id: "isAcknowledged",
               cell: ({row}) => {
                    const item = row.original
                    const markAsAcknowledged = async () => {
                         try{
                              await invoke("mark_as_acknowledged", {
                                   id: item.id,
                                   date: item.timestamp.split("T")[0]
                              });
                              setHistoryState(prev=>({
                                   ...prev,
                                   data: prev.data.map(val=>({
                                        ...val,
                                        status: val.id===item.id ? "acknowledged" : val.status
                                   }))
                              }))
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
          },
          ...baseCols
     ];
}