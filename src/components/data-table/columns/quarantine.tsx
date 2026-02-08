import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IQuarantineData } from "@/lib/types/data";
import { IQuarantineState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { formatBytes } from "@/lib/helpers/formating";

export const GET_QUARANTINE_COLS = (
     setState: (overrides: Partial<IQuarantineState>) => void,
     isDevMode: boolean
): ColumnDef<IQuarantineData>[] => {
     const baseCols: ColumnDef<IQuarantineData>[] = [
          {
               accessorKey: "threat_name",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <div className="flex items-center justify-between gap-2">
                              <span>{t("heading.threats.threat")}</span>
                              <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                                   {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                              </Button>
                         </div>
                    )
               }
          },
          {
               accessorKey: "file_path",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.threats.path")
               }
          },
          {
               accessorKey: "quarantined_at",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <div className="flex items-center justify-between gap-2">
                              <span>{t("heading.quarantine.quarantined-at")}</span>
                              <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                                   {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                              </Button>
                         </div>
                    )
               },
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(new Date(getValue() as string))
               }
          },
          {
               accessorKey: "size",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <div className="flex items-center justify-between gap-2">
                              <span>{t("heading.quarantine.size")}</span>
                              <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                                   {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                              </Button>
                         </div>
                    )
               },
               cell: ({getValue}) => {
                    const {t} = useTranslation()
                    return formatBytes(getValue() as number,t)
               }
          },
          {
               id: "actions",
               cell: ( { row }) => {
                    const {t} = useTranslation("table");
                    const threat = row.original
                    return (
                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">{t("actions.open-menu")}</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                   <DropdownMenuLabel>{t("heading.actions")}</DropdownMenuLabel>
                                   <DropdownMenuSeparator/>
                                   {}
                                   <DropdownMenuItem onClick={()=>setState({
                                        id: threat.id,
                                        isOpenRestore: true
                                   })}>
                                        <RotateCcw/>
                                        {t("actions.restore")}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-destructive" onClick={()=>setState({
                                        id: threat.id,
                                        isOpenDelete: true
                                   })}>
                                        <Trash className="text-destructive"/> {t("actions.threats.delete")}
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                    )
               },
          }
     ];
     return isDevMode ? [
          {
               accessorKey: "id",
               header: "Threat ID"
          },
          ...baseCols
     ] : baseCols;
}