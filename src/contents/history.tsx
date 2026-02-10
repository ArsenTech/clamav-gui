import { HistoryTable } from "@/components/data-table/tables/history";
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GET_HISTORY_COLS } from "@/components/data-table/columns/history";
import { useEffect, useMemo, useState, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { HistoryClearType, IHistoryData } from "@/lib/types/data";
import { Download, Trash2 } from "lucide-react"
import { ButtonGroup } from "@/components/ui/button-group"
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { save } from '@tauri-apps/plugin-dialog';
import { exportCSV, exportJSON } from "@/lib/helpers/fs";
import { Spinner } from "@/components/ui/spinner";
import Popup from "@/components/popup";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IHistoryPageState } from "@/lib/types/states";
import { INITIAL_HISTORY_STATE } from "@/lib/constants/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";

export default function HistoryContent(){
     const {settings} = useSettings();
     const [isRefreshing, startTransition] = useTransition();
     const [isClearing, startClearTransition] = useTransition();
     const [historyState, setHistoryState] = useState<IHistoryPageState>(INITIAL_HISTORY_STATE)
     const setState = (overrides: Partial<IHistoryPageState>) => setHistoryState(prev=>({ ...prev, ...overrides }))
     const {t} = useTranslation("history")
     const {t: messageTxt} = useTranslation("messages")
     const fetchData = () => {
          startTransition(async()=>{
               try {
                    const fetched = await invoke<IHistoryData<"type">[]>("load_history", {days: 7})
                    const newData: IHistoryData<"state">[] = fetched.map(val=>({
                         ...val,
                         logId: val.log_id
                    }))
                    setState({ data: newData })
               } catch (err){
                    toast.error(messageTxt("fetch-error.history",{
                         description: String(err)
                    }))
                    setState({ data: [] })
               }
          })
     }
     const clearHistory = (mode: HistoryClearType = "all") => {
          setState({
               clearAll: false,
               clearAcknowledged: false,
               clearErrors: false
          })
          startClearTransition(async()=>{
               try {
                    await invoke("clear_history",{mode});
                    setHistoryState(prev=>({
                         ...prev,
                         data: mode==="all" ? [] : prev.data.filter(val=>val.status!==mode)
                    }))
                    toast.success(t(`clear-messages.${mode}`))
               } catch (err){
                    toast.error(messageTxt("history-clear-errror",{
                         description: String(err)
                    }))
               }
          })
     }
     const exportDataAs = async () => {
          try{
               const path = await save({
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
               toast.error(messageTxt("export.error",{
                    description: String(err)
               }));
          }
     }
     useEffect(()=>{
          fetchData()
     },[])
     const {data, clearAcknowledged, clearAll, clearErrors} = historyState
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
                                        <Button variant="outline" disabled={isClearing}>
                                             {isClearing ? <Spinner/> : <Trash2/>}
                                             {isClearing ? t("clear.loading") : t("clear.title")}
                                        </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent>
                                        <DropdownMenuItem onClick={()=>setState({clearAll: true})} disabled={isEmpty}>
                                             {t("clear.all")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setState({clearAcknowledged: true})} disabled={isEmpty}>
                                             {t("clear.acknowledged")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setState({clearErrors: true})} disabled={isEmpty}>
                                             {t("clear.errors")}
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
          <Popup
               open={clearAll}
               onOpen={clearAll=>setState({clearAll})}
               title={t("confirmation.clear-history.title")}
               description={t("confirmation.clear-history.desc")}
               submitTxt={t("confirmation.clear")}
               closeText={t("confirmation.cancel")}
               submitEvent={()=>clearHistory("all")}
               type="danger"
          />
          <Popup
               open={clearAcknowledged}
               onOpen={clearAcknowledged=>setState({clearAcknowledged})}
               title={t("confirmation.clear-acknowledged.title")}
               description={t("confirmation.clear-acknowledged.desc")}
               submitTxt={t("confirmation.clear")}
               closeText={t("confirmation.cancel")}
               submitEvent={()=>clearHistory("acknowledged")}
               type="danger"
          />
          <Popup
               open={clearErrors}
               onOpen={clearErrors=>setState({clearErrors})}
               title={t("confirmation.clear-errors.title")}
               description={t("confirmation.clear-errors.desc")}
               submitTxt={t("confirmation.clear")}
               closeText={t("confirmation.cancel")}
               submitEvent={()=>clearHistory("error")}
               type="danger"
          />
          </>
     )
}