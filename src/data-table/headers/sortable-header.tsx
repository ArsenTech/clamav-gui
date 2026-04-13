import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface SortableHeaderProps<T>{
     title: string,
     column: Column<T>
}
export default function SortableHeader<T>({title, column}: SortableHeaderProps<T>){
     return (
          <div className="flex items-center justify-between gap-2">
               <span>{title}</span>
               <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                    {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
               </Button>
          </div>
     )
}