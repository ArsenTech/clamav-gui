import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IQuarantineData } from "@/lib/types";

export const QUARANTINE_COLS = (setIsOpen: React.Dispatch<React.SetStateAction<{
     isOpenRestore: boolean,
     isOpenDelete: boolean,
     id: string
}>>): ColumnDef<IQuarantineData<"state">>[] => [
     {
          accessorKey: "threat_name",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Threat</span>
                    <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                         {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                    </Button>
               </div>
          )
     },
     {
          accessorKey: "file_path",
          header: "Path"
     },
     {
          accessorKey: "quarantined_at",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Quarantined At</span>
                    <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                         {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                    </Button>
               </div>
          )
     },
     {
          accessorKey: "size",
          header: ({column}) => (
               <div className="flex items-center justify-between gap-2">
                    <span>Size</span>
                    <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                         {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                    </Button>
               </div>
          )
     },
     {
          id: "actions",
          cell: ( { row }) => {
               const threat = row.original
               console.log(threat)
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
                              <DropdownMenuItem onClick={()=>setIsOpen(prev=>({
                                   ...prev,
                                   id: threat.id,
                                   isOpenRestore: true
                              }))}><RotateCcw/> Restore</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={()=>setIsOpen(prev=>({
                                   ...prev,
                                   id: threat.id,
                                   isOpenDelete: true
                              }))}>
                                   <Trash className="text-destructive"/> Delete permanently
                              </DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               )
          },
     }
]