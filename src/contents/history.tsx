import { HistoryTable } from "@/components/data-table/tables/history";
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GET_HISTORY_COLS } from "@/components/data-table/columns/history";
import { useEffect, useMemo, useState, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { IHistoryData } from "@/lib/types";
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

export default function HistoryContent(){
     const {settings} = useSettings();
     const [isRefreshing, startTransition] = useTransition();
     const [isClearing, startClearTransition] = useTransition();
     const [historyState, setHistoryState] = useState<IHistoryPageState>(INITIAL_HISTORY_STATE)
     const setState = (overrides: Partial<IHistoryPageState>) => setHistoryState(prev=>({ ...prev, ...overrides }))
     const fetchData = () => {
          startTransition(async()=>{
               try {
                    const fetched = await invoke<IHistoryData<"type">[]>("load_history", {days: 7})
                    const newData: IHistoryData<"state">[] = fetched.map(val=>({
                         ...val,
                         logId: val.log_id
                    }))
                    setState({ data: newData })
               } catch (error){
                    toast.error("Failed to fetch the recent history data")
                    console.error(error);
                    setState({ data: [] })
               }
          })
     }
     const clearHistory = (mode: "all" | "acknowledged" = "all") => {
          setState({
               clearAll: false,
               clearAcknowledged: false
          })
          startClearTransition(async()=>{
               try {
                    await invoke("clear_history",{mode});
                    setHistoryState(prev=>({
                         ...prev,
                         data: mode==="all" ? [] : prev.data.filter(val=>val.status!=="acknowledged")
                    }))
                    toast.success(mode==="all" ? "History Cleared!" : "Acknowledged Entries Cleared!")
               } catch (error){
                    toast.error("Failed to clear history")
                    console.error(error);
               }
          })
     }
     const exportDataAs = async () => {
          try{
               const path = await save({
                    filters: [
                         { name: "CSV", extensions: ["csv"] },
                         { name: "JSON", extensions: ["json","jsonc"] }
                    ],
               })
               if(!path) return;
               const exportFile = path.endsWith(".csv") ? exportCSV : exportJSON;
               await exportFile(path,historyState.data);
               toast.success(`History data exported as ${path.endsWith(".csv") ? "CSV File" : "JSON File"}`)
          } catch (error) {
               toast.error("Failed to export the history data");
               console.error(error)
          }
     }
     useEffect(()=>{
          fetchData()
     },[])
     const {data, clearAcknowledged, clearAll} = historyState
     const isEmpty = useMemo(()=>data.length<=0,[data])
     return (
          <>
          <div className="space-y-4">
               <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">History</h1>
               <HistoryTable
                    columns={GET_HISTORY_COLS(setHistoryState,settings.developerMode)}
                    data={data}
                    headerElement={(
                         <ButtonGroup>
                              <Button onClick={fetchData} disabled={isRefreshing || isClearing}>
                                   <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                                   Refresh
                              </Button>
                              <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                        <Button variant="outline" disabled={isClearing}>
                                             {isClearing ? <Spinner/> : <Trash2/>}
                                             {isClearing ? "Please Wait..." : "Clear history"}
                                        </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent>
                                        <DropdownMenuItem onClick={()=>setState({clearAll: true})} disabled={isEmpty}>
                                             Clear all history
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setState({clearAcknowledged: true})} disabled={isEmpty}>
                                             Clear acknowledged only
                                        </DropdownMenuItem>
                                   </DropdownMenuContent>
                              </DropdownMenu>
                              <Button variant="outline" onClick={exportDataAs} disabled={isEmpty}>
                                   <Download/> Export History As
                              </Button>
                         </ButtonGroup>
                    )}
               />
          </div>
          <Popup
               open={clearAll}
               onOpen={clearAll=>setState({clearAll})}
               title="Clear history?"
               description="This will remove all scan, update, and action history. Logs and quarantine items will not be affected."
               submitTxt="Clear history"
               closeText="Cancel"
               submitEvent={()=>clearHistory("all")}
          />
          <Popup
               open={clearAcknowledged}
               onOpen={clearAcknowledged=>setState({clearAcknowledged})}
               title="Clear acknowledged entries?"
               description="This will remove only acknowledged history entries. Unresolved events will remain."
               submitTxt="Clear"
               closeText="Cancel"
               submitEvent={()=>clearHistory("acknowledged")}
          />
          </>
     )
}