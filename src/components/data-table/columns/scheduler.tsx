import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarSearch, FileText, MoreHorizontal, ScrollText, Search, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ISchedulerData, ScanType } from "../../../lib/types";
import { Badge } from "@/components/ui/badge";
import { capitalizeText } from "@/lib/helpers";
import { SCAN_TYPES } from "@/lib/constants";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Link } from "react-router";
import { ISchedulerState } from "@/lib/types/states";
import { useSettings } from "@/hooks/use-settings";

export const GET_SCHEDULER_COLS = (
     setState:  (overrides: Partial<ISchedulerState>) => void,
): ColumnDef<ISchedulerData<"state">>[] => [
     {
          accessorKey: "id",
          header: "Job Name",
     },
     {
          accessorKey: "interval",
          header: "Interval",
          cell: ({getValue}) => (
               <Badge>
                    <CalendarSearch />
                    {capitalizeText(getValue() as string)}
               </Badge>
          )
     },
     {
          accessorKey: "scanType",
          header: "Scan Type",
          cell: ({getValue}) => {
               const scanInfo = SCAN_TYPES.find(item=>item.type===getValue() as ScanType);
               if(!scanInfo) return null;
               return (
                    <Badge variant="outline">
                         <scanInfo.Icon/>
                         {capitalizeText(scanInfo.name)}
                    </Badge>
               )
          }
     },
     {
          accessorKey: "lastScan",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Last Scan</span>
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
          accessorKey: "nextScan",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Next Scan</span>
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
          id: "actions",
          cell: ({row}) => {
               const item = row.original
               const revealLog = async()=>{
                    if(!item.log_id) return;
                    try{
                         await invoke("reveal_log",{
                              category: "scheduler",
                              id: item.log_id
                         })
                    } catch(err){
                         toast.error("Failed to reveal log file");
                         console.error(err)
                    }
               }
               const handleRunScan = async()=>{
                    try{
                         await invoke("run_job_now",{
                              taskName: item.id
                         });
                         toast.success("Scan Job Triggered")
                    } catch (err){
                         toast.error("Failed to run scheduled task");
                         console.error(err)
                    }
               }
               return (
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                   <span className="sr-only">Open menu</span>
                                   <MoreHorizontal className="h-4 w-4" />
                              </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator/>
                              <DropdownMenuItem onClick={handleRunScan}>
                                   <Search/> Scan Now
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={!item.log_id} asChild>
                                   <Link to={`/scheduler/${item.log_id}?category=scheduler`}>
                                        <ScrollText/> View Logs
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={!item.log_id} onClick={revealLog}>
                                   <FileText /> Reveal Log File
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={()=>setState({
                                   isOpenDelete: true,
                                   job_id: item.id
                              })}>
                                   <Trash2 className="text-destructive"/> Remove job
                              </DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               )
          },
     }
]