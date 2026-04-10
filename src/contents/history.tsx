import { HistoryTable } from "@/data-table/tables/history";
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GET_HISTORY_COLS } from "@/data-table/columns/history";
import { useEffect, useMemo, useState, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Download, Trash2 } from "lucide-react"
import { ButtonGroup } from "@/components/ui/button-group"
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { save } from "@tauri-apps/plugin-dialog";
import { exportCSV, exportJSON } from "@/lib/helpers/fs";
import Popup from "@/components/popup";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IHistoryPageState } from "@/lib/types/states";
import { INITIAL_HISTORY_STATE } from "@/lib/constants/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { HistoryClearType } from "@/lib/types/enums"
import LoadingButton from "@/components/loading-button";
import ConfirmationMessage from "@/components/popup/confirm";
import { HistoryConfirmationState } from "@/lib/types";
import { getErrorMessage } from "@/lib/helpers";
import { fetchHistoryData } from "@/data/history";

export default function HistoryContent(){
     const {settings} = useSettings();
     const [isRefreshing, startTransition] = useTransition();
     const [isClearing, startClearTransition] = useTransition();
     const [historyState, setHistoryState] = useState<IHistoryPageState>(INITIAL_HISTORY_STATE)
     const setState = (overrides: Partial<IHistoryPageState>) => setHistoryState(prev=>({ ...prev, ...overrides }))
     const {t} = useTranslation("history")
     const {t: messageTxt} = useTranslation("messages")
     const {t: tableTxt} = useTranslation("table")
     const fetchData = () => {
          startTransition(async()=>{
               const newData = await fetchHistoryData(t,messageTxt)
               setState({ data: newData })
          })
     }
     const clearHistory = (mode = HistoryClearType.All) => {
          if (isClearing) return;
          startClearTransition(async()=>{
               try {
                    await invoke("clear_history",{mode});
                    setHistoryState(prev=>({
                         ...prev,
                         data: mode==="all" ? [] : prev.data.filter(val=>val.status!==mode)
                    }))
                    toast.success(t(`clear-messages.${mode}`))
               } catch (err){
                    toast.error(messageTxt("history-clear-errror"),{
                         description: getErrorMessage(err)
                    })
               } finally {
                    setState({popupState: ""})
               }
          })
     }
     const exportDataAs = async () => {
          try{
               const path = await save({
                    title: t("export.dialog-title"),
                    filters: [
                         { name: t("export.csv"), extensions: ["csv"] },
                         { name: t("export.json"), extensions: ["json","jsonc"] }
                    ],
               })
               if(!path) return;
               const exportFile = path.endsWith(".csv") ? exportCSV : exportJSON;
               await exportFile(path,historyState.data);
               toast.success(messageTxt("export.success",{
                    fileName: path.endsWith(".csv") ? t("export.csv") : t("export.json")
               }))
          } catch (err) {
               toast.error(messageTxt("export.error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     const CLEAR_ACTIONS = {
          "clear-all": () => clearHistory(HistoryClearType.All),
          "clear-acknowledged": () => clearHistory(HistoryClearType.Acknowledged),
          "clear-errors": () => clearHistory(HistoryClearType.Error),
          "clear-warnings": () => clearHistory(HistoryClearType.Warning),
     } as const
     const handleConfirm = () => {
          if(popupState) CLEAR_ACTIONS[popupState]()
     }
     useEffect(()=>{
          fetchData()
     },[])
     const {data, popupState, showDetails, details} = historyState
     const isEmpty = useMemo(()=>data.length<=0,[data])
     return (
          <>
          <div className="space-y-4">
               <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               <HistoryTable
                    columns={GET_HISTORY_COLS(setHistoryState,settings.developerMode)}
                    data={data}
                    headerElement={(
                         <ButtonGroup>
                              <Button onClick={fetchData} disabled={isRefreshing || isClearing}>
                                   <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                                   {isRefreshing ? t("refresh.loading") : t("refresh.original")}
                              </Button>
                              <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                        <LoadingButton
                                             isLoading={isClearing}
                                             loaderText={t("clear.loading")}
                                             variant="outline"
                                        >
                                             <Trash2/>
                                             {t("clear.title")}
                                        </LoadingButton>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent>
                                        <DropdownMenuItem onClick={()=>setState({popupState: "clear-all"})} disabled={isEmpty}>
                                             {t("clear.all")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setState({popupState: "clear-acknowledged"})} disabled={isEmpty}>
                                             {t("clear.acknowledged")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setState({popupState: "clear-errors"})} disabled={isEmpty}>
                                             {t("clear.errors")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setState({popupState: "clear-warnings"})} disabled={isEmpty} >
                                             {t("clear.warnings")}
                                        </DropdownMenuItem>
                                   </DropdownMenuContent>
                              </DropdownMenu>
                              <Button variant="outline" onClick={exportDataAs} disabled={isEmpty}>
                                   <Download/>
                                   {t("export.title")}
                              </Button>
                         </ButtonGroup>
                    )}
               />
          </div>
          <ConfirmationMessage
               state={popupState}
               submitAction="clear"
               submitEvent={handleConfirm}
               type="danger"
               onOpenChange={(state)=>setState({ popupState: state as "" | HistoryConfirmationState })}
          />
          <Popup
               open={showDetails}
               onOpen={showDetails=>setState({showDetails})}
               title={tableTxt("heading.history.details")}
          >
               {details}
          </Popup>
          </>
     )
}