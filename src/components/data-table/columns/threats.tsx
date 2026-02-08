import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, BugOff, FolderOpen, MoreHorizontal, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IThreatsData, ThreatStatus } from "@/lib/types/data";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { useMemo } from "react";
import { getThreatStatusBadges } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";

export const GET_THREATS_COLS = (
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     setState: (overrides: Partial<IFinishScanState>) => void,
     isDevMode: boolean
): ColumnDef<IThreatsData>[] => {
     const baseCols: ColumnDef<IThreatsData>[] = [
          {
               accessorKey: "displayName",
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
               accessorKey: "filePath",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.threats.path")
               }
          },
          {
               accessorKey: "detectedAt",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.threats.detected-at")
               },
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(new Date(getValue() as string))
               }
          },
          {
               accessorKey: "status",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.status")
               },
               cell: ({getValue}) => {
                    const {t} = useTranslation("table");
                    return (
                         <Badge variant={getThreatStatusBadges(getValue() as ThreatStatus)}>
                              {t(`status.threats.${getValue() as ThreatStatus}`)}
                         </Badge>
                    )
               }
          },
          {
               id: "actions",
               cell: ({ row }) => {
                    const {t} = useTranslation("table");
                    const threat = row.original
                    const handleQuarantine = async() => {
                         try{
                              const {filePath, displayName} = threat
                              await invoke("quarantine_file",{
                                   filePath,
                                   threatName: displayName,
                                   logId: null,
                              })
                              setScanState(prev=>({
                                   ...prev,
                                   threats: prev.threats.map(val => val.filePath === filePath && val.displayName === displayName ? { ...val, status: "quarantined" } : val)
                              }))
                              toast.success("Threat quarantined!")
                         } catch (e){
                              toast.error("Failed to quarantine threat");
                              console.error(e);
                         }
                    }
                    const handleRevealPath = async() => await revealItemInDir(threat.filePath)
                    const isResolved = useMemo(()=>["quarantined", "deleted", "safe"].includes(threat.status),[threat.status]);
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
                                   <DropdownMenuItem disabled={isResolved} onClick={handleQuarantine}>
                                        <BugOff/>
                                        {t("actions.quarantine")}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-destructive" onClick={()=>setState({
                                        isOpenDelete: true,
                                        currThreat: threat
                                   })} disabled={isResolved} >
                                        <Trash className="text-destructive"/> {t("actions.delete")}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={handleRevealPath} disabled={isResolved} >
                                        <FolderOpen/>
                                        {t("actions.open")}
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