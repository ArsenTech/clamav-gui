import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, BugOff, FolderOpen, MoreHorizontal, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IThreatsData, ThreatStatus } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { openPath } from "@tauri-apps/plugin-opener";
import { dirname } from "@tauri-apps/api/path";
import { useMemo } from "react";
import { capitalizeText, getThreatStatusBadges } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import useSettings from "@/hooks/use-settings";

export const GET_THREATS_COLS = (
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     setState: (overrides: Partial<IFinishScanState>) => void,
     isDevMode: boolean
): ColumnDef<IThreatsData>[] => {
     const baseCols: ColumnDef<IThreatsData>[] = [
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
               header: "Detected At",
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(new Date(getValue() as string))
               }
          },
          {
               accessorKey: "status",
               header: "Status",
               cell: ({getValue}) => <Badge variant={getThreatStatusBadges(getValue() as ThreatStatus)}>
                    {capitalizeText(getValue() as string)}
               </Badge>
          },
          {
               id: "actions",
               cell: ({ row }) => {
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
                    const handleRevealPath = async() => {
                         const folder = await dirname(threat.filePath);
                         await openPath(folder);
                    }
                    const isResolved = useMemo(()=>["quarantined", "deleted", "safe"].includes(threat.status),[threat.status]);
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
                                   <DropdownMenuItem disabled={isResolved} onClick={handleQuarantine}>
                                        <BugOff/> Quarantine
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-destructive" onClick={()=>setState({
                                        isOpenDelete: true,
                                        currThreat: threat
                                   })} disabled={isResolved} >
                                        <Trash className="text-destructive"/> Delete permanently
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={handleRevealPath} disabled={isResolved} >
                                        <FolderOpen/> Open Containing Folder
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