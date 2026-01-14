import { DataTable } from "@/components/data-table";
import { AppLayout } from "@/components/layout";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, FolderOpen, MoreHorizontal, RotateCcw, ShieldCheck, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export interface IQuarantineData{
     id: string,
     displayName: string,
     filePath: string,
     status: "quarantined" | "deleted" | "restored" | "ignored" | "blocked" | "detected",
     detectedAt: "2020-05-05"
}

export const quarantineData: IQuarantineData[] = [
     {
          id: "1",
          displayName: "Some.Trojan.Malware",
          filePath: "C:\\Users\\User\\Downloads\\a-shady-contract.pdf.exe",
          status: "detected",
          detectedAt: "2020-05-05"
     },
     {
          id: "1",
          displayName: "Ransom.Malware",
          filePath: "C:\\Users\\User\\Downloads\\a-shady-contract.pdf.exe",
          status: "quarantined",
          detectedAt: "2020-05-05"
     },
     {
          id: "1",
          displayName: "RAT.Malware",
          filePath: "C:\\Users\\User\\Downloads\\a-shady-contract.pdf.exe",
          status: "blocked",
          detectedAt: "2020-05-05"
     }
]

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
    accessorKey: "status",
    header: ({column}) => (
          <div className="flex items-center justify-between gap-2">
               <span>Status</span>
               <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                    {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
               </Button>
          </div>
     )
  },
  {
     accessorKey: "detectedAt",
     header: ({column}) => (
          <div className="flex items-center justify-between gap-2">
               <span>Detected At</span>
               <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                    {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
               </Button>
          </div>
     )
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
                         <DropdownMenuItem><RotateCcw/> Restore</DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive"><Trash className="text-destructive"/> Delete permanently</DropdownMenuItem>
                         <DropdownMenuItem><FolderOpen/> Open Containing Folder</DropdownMenuItem>
                    </DropdownMenuContent>
               </DropdownMenu>
          )
     },
  }
]

export default function QuarantinePage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Quarantine</h1>
               {(quarantineData && quarantineData.length>0) ? (
                    <DataTable
                         columns={columns}
                         data={quarantineData}
                    />
               ) : (
                    <Empty>
                         <EmptyHeader>
                              <EmptyMedia variant="icon">
                                   <ShieldCheck/>
                              </EmptyMedia>
                              <EmptyTitle>No Quarantined Threats</EmptyTitle>
                              <EmptyDescription>Your system is clean and Lookin' Good!</EmptyDescription>
                         </EmptyHeader>
                    </Empty>
               )}
          </AppLayout>
     )
}