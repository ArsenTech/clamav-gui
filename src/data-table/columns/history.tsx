import { ArrowDown, ArrowUp, ArrowUpDown, Ban, Check, CheckCheck, CheckCircle, FileText, List, MoreHorizontal, ScrollText, TriangleAlert } from "lucide-react";
import { IHistoryData, HistoryStatus } from "@/lib/types/data";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage, getHistoryStatusBadges } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { IHistoryPageState } from "@/lib/types/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { HistoryType } from "@/lib/types/enums";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const GET_HISTORY_COLS = (
     setHistoryState: React.Dispatch<React.SetStateAction<IHistoryPageState>>,
     isDevMode: boolean
): ColumnDef<IHistoryData<"state">>[] => {
     const baseCols: ColumnDef<IHistoryData<"state">>[] = [
          {
               accessorKey: "timestamp",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                    return (
                         <div className="flex items-center justify-between gap-2">
                              <span>{t("heading.history.timestamp")}</span>
                              <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                                   {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                              </Button>
                         </div>
                    )
               },
               cell: ({getValue}) => {
                    const {formatDate} = useSettings();
                    return formatDate(getValue() as string)
               }
          },
          {
               accessorKey: "action",
               header: ({column}) => {
                    const {t} = useTranslation("table")
                         return (
                         <div className="flex items-center justify-between gap-2">
                              <span>{t("heading.history.event")}</span>
                              <Button variant="ghost" onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")} size="icon-sm">
                                   {column.getIsSorted()==="asc" ? <ArrowUp className="h-4 w-4" /> : column.getIsSorted()==="desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                              </Button>
                         </div>
                    )
               },
               cell: ({getValue}) => {
                    const {t} = useTranslation("history");
                    return t(`events.${getValue() as HistoryType}`)
               }
          },
          {
               accessorKey: "details",
               header: () => {
                    const {t} = useTranslation("table")
                    return t("heading.history.details")
               },
               cell: ({ getValue }) => (
                    <div className="max-w-xs truncate">
                         {getValue() as string}
                    </div>
               )
          },
          {
               accessorKey: "status",
               header: ()=>{
                    const {t} = useTranslation("table");
                    return t("heading.status")
               },
               cell: ({getValue}) => {
                    const {t} = useTranslation("table");
                    const historyStatus = getValue() as HistoryStatus;
                    const {settings} = useSettings();
                    const iconClassName = cn(
                         historyStatus==="success" && "text-emerald-600 dark:text-emerald-400",
                         historyStatus === "error" && "text-destructive",
                         historyStatus === "warning" && "text-amber-600 dark:text-amber-400",
                         historyStatus === "acknowledged" && "text-muted-foreground",
                         "text-center"
                    )
                    const icon = historyStatus==="success" ? (
                         <Check/>
                    ) : historyStatus === "error" ? (
                         <Ban/>
                    ) : historyStatus === "warning" ? (
                         <TriangleAlert/>
                    ) : (
                         <CheckCheck/>
                    )
                    return settings.badgeVisibility === "icon" ? (
                         <Tooltip>
                              <TooltipTrigger className={iconClassName} asChild>
                                   {icon}
                              </TooltipTrigger>
                              <TooltipContent>
                                   {t(`status.history.${historyStatus}`)}
                              </TooltipContent>
                         </Tooltip>
                    ) : (
                         <Badge variant={getHistoryStatusBadges(historyStatus)} className="gap-1.5">
                              {settings.badgeVisibility==="icon-text" && icon}
                              {t(`status.history.${historyStatus}`)}
                         </Badge>
                    )
               }
          },
          {
               id: "actions",
               cell: ({row}) => {
                    const {t} = useTranslation("table")
                    const item = row.original;
                    const {t: messageTxt} = useTranslation("messages")
                    const revealLog = async()=>{
                         if(!item.logId || !item.category) return;
                         try{
                              await invoke("reveal_log",{
                                   category: item.category,
                                   id: item.logId
                              })
                         } catch(err){
                              toast.error(messageTxt("log-reveal-error"),{
                                   description: getErrorMessage(err)
                              });
                         }
                    }
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
                                   <DropdownMenuItem disabled={!item.logId || !item.category || !item.details} onClick={()=>setHistoryState(prev=>({
                                        ...prev,
                                        showDetails: true,
                                        details: item.details
                                   }))}>
                                        <List/>
                                        {t("actions.view-details")}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem disabled={!item.logId || !item.category} asChild>
                                        <Link to={`/history/${item.logId}?category=${item.category}`}>
                                             <ScrollText/>
                                             {t("actions.view-log")}
                                        </Link>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={revealLog} disabled={!item.logId || !item.category}>
                                        <FileText />
                                        {t("actions.reveal-log")}
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                    )
               },
          }
     ];
     const acknowledgeCol: ColumnDef<IHistoryData<"state">> = {
          id: "isAcknowledged",
          cell: ({row}) => {
               const {t} = useTranslation("table")
               const item = row.original
               const {t: messageTxt} = useTranslation("messages")
               const markAsAcknowledged = async () => {
                    try{
                         await invoke("mark_as_acknowledged", {
                              id: item.id,
                              date: item.timestamp.split("T")[0]
                         });
                         setHistoryState(prev=>({
                              ...prev,
                              data: prev.data.map(val=>({
                                   ...val,
                                   status: val.id===item.id ? "acknowledged" : val.status
                              }))
                         }))
                         toast.success(messageTxt("acknowledge-history.success"))
                    } catch (err){
                         toast.error(messageTxt("acknowledge-history.error"),{
                              description: getErrorMessage(err)
                         });
                    }
               }
               return (
                    <Button variant="ghost" size="icon" title={t("mark-as-acknowledged")} onClick={markAsAcknowledged} disabled={item.status==="acknowledged"}>
                         <CheckCircle/>
                    </Button>
               )
          }
     };
     return isDevMode ? [
          acknowledgeCol,
          {
               accessorKey: "id",
               header: "Entry ID"
          },
          ...baseCols
     ] : [
          acknowledgeCol,
          ...baseCols
     ];
}