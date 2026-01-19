import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff, Logs, MoreHorizontal, ScrollText, Search, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IHistoryData, ISchedulerData } from "@/lib/types";

export const HISTORY_COLS: ColumnDef<IHistoryData>[] = [
     {
          accessorKey: "timestamp",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Timestamp</span>
                    <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                         {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                    </Button>
               </div>
          )
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
          header: "Detailed Info"
     },
     {
          id: "actions",
          cell: ({row}) => {
               const item = row.original
               console.log(item)
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
                              <DropdownMenuItem><Logs/> View Details</DropdownMenuItem>
                              <DropdownMenuItem><EyeOff/> Dismiss</DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               )
          },
     }
]

export const SCHEDULER_COLS: ColumnDef<ISchedulerData>[] = [
     {
          accessorKey: "id",
          header: "Job ID"
     },
     {
          accessorKey: "interval",
          header: "Interval",
     },
     {
          accessorKey: "scanType",
          header: "Scan Type",
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
          )
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
          )
     },
     {
          id: "actions",
          cell: ({row}) => {
               const item = row.original
               console.log(item)
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
                              <DropdownMenuItem><Search/> Scan Now</DropdownMenuItem>
                              <DropdownMenuItem><ScrollText/> View Logs</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="text-destructive"/> Remove job</DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               )
          },
     }
]