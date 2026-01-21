import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff, MoreHorizontal } from "lucide-react";
import { HistoryStatus, IHistoryData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { capitalizeText, getHistoryStatusBadges } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
                              {/* TODO: Add a functionality to mark the entry as acknowledged */}
                              <DropdownMenuItem disabled>
                                   <EyeOff/> Mark as acknowledged
                              </DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               )
          },
     }
]