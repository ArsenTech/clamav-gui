import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, BugOff, EyeOff, FolderOpen, MoreHorizontal, ShieldAlert, ShieldBan, ShieldCheck, Trash } from "lucide-react";
import { Link } from "react-router";
import { IQuarantineData, quarantineData } from "@/pages/quarantine";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const columns: ColumnDef<IQuarantineData>[] = [
  {
     accessorKey: "displayName",
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
     accessorKey: "filePath",
     header: "Path"
  },
  {
     accessorKey: "detectedAt",
     header: "Detected At"
  },
  {
     accessorKey: "status",
     header: "Status"
  },
  {
     id: "actions",
     cell: () => {
          // const threat = row.original { row }
     
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
                         <DropdownMenuItem><BugOff/> Quarantine</DropdownMenuItem>
                         <DropdownMenuItem><EyeOff/> Ignore</DropdownMenuItem>
                         <DropdownMenuItem><ShieldBan/> Block</DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive"><Trash className="text-destructive"/> Delete permanently</DropdownMenuItem>
                         <DropdownMenuItem><FolderOpen/> Open Containing Folder</DropdownMenuItem>
                    </DropdownMenuContent>
               </DropdownMenu>
          )
     },
  }
]

interface Props{
     threatCount: number
}
export default function ScanFinishResult({threatCount}: Props){
     return threatCount<=0 ? (
          <>
               <ShieldCheck className="size-32 text-emerald-700"/>
               <h2 className="text-lg md:text-2xl font-medium">No items detected!</h2>
               <Button asChild>
                    <Link to="/">Back to the overview</Link>
               </Button>
          </>
     ) : (
          <>
               <ShieldAlert className="size-32 text-red-700"/>
               <h2 className="text-lg md:text-2xl font-medium">{threatCount} {threatCount<=1 ? "threat" : "threats"} require attention</h2>
               <DataTable
                    columns={columns}
                    data={quarantineData}
               />
               <ButtonGroup>
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                              <Button><ShieldCheck/> Resolve</Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator/>
                              <DropdownMenuItem><BugOff/> Quarantine All</DropdownMenuItem>
                              <DropdownMenuItem><EyeOff/> Ignore All</DropdownMenuItem>
                              <DropdownMenuItem><ShieldBan/> Block All</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash className="text-destructive"/> Delete All</DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild variant="secondary">
                         <Link to="/">Back to the overview</Link>
                    </Button>
               </ButtonGroup>
          </>
     )
}