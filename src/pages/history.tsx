import { HistoryTable } from "@/components/data-table/tables/history";
import { AppLayout } from "@/components/layout";
import { RotateCw, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GET_HISTORY_COLS } from "@/components/data-table/columns/history";
import { LOG_ITEMS } from "@/lib/constants";
import { useEffect, useState, useTransition } from "react";
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

export default function HistoryPage(){
     const [data, setData] = useState<IHistoryData[]>([])
     const [isRefreshing, startTransition] = useTransition();
     const [isClearing, startClearTransition] = useTransition();
     const [isOpen, setIsOpen] = useState(false)
     const fetchData = () => {
          startTransition(async()=>{
               try {
                    const fetched = await invoke<IHistoryData[]>("load_history", {days: 7})
                    setData(fetched)
               } catch (error){
                    toast.error("Failed to fetch the recent history data")
                    console.error(error);
                    setData([])
               }
          })
     }
     const clearHistory = () => {
          setIsOpen(false)
          startClearTransition(async()=>{
               try {
                    await invoke("clear_history");
                    setData([]);
                    toast.success("History Cleared!")
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
               await exportFile(path,data);
               toast.success(`History data exported as ${path.endsWith(".csv") ? "CSV File" : "JSON File"}`)
          } catch (error) {
               toast.error("Failed to export the history data");
               console.error(error)
          }
     }
     useEffect(()=>{
          fetchData()
     },[])
     return (
          <AppLayout className="space-y-4 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">History</h1>
                    <HistoryTable
                         columns={GET_HISTORY_COLS(setData)}
                         data={data}
                         headerElement={(
                              <ButtonGroup>
                                   <Button onClick={fetchData} disabled={isRefreshing || isClearing}>
                                        <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                                        Refresh
                                   </Button>
                                   <Button variant="outline" disabled={isClearing} onClick={()=>setIsOpen(true)}>
                                        {isClearing ? <Spinner/> : <Trash2/>}
                                        {isClearing ? "Please Wait..." : "Clear history"}
                                   </Button>
                                   <Button variant="outline" onClick={exportDataAs}>
                                        <Download/> Export History As
                                   </Button>
                              </ButtonGroup>
                         )}
                    />
               </div>
               <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[700px]">
                    <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Logs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                         {LOG_ITEMS.map(({name, Icon},i)=>(
                              <div key={`${name.toLowerCase()}-${i}`} className="w-full p-4 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-between items-center flex-col gap-4">
                                   <h2 className="text-xl md:text-2xl font-medium flex-1 flex items-center justify-center gap-3 text-center w-full">
                                        <Icon className="size-7 text-primary"/>
                                        <span>{name}</span>
                                   </h2>
                                   <Button><ScrollText/> View Logs</Button>
                              </div>
                         ))}
                    </div>
               </div>
               <Popup
                    open={isOpen}
                    onOpen={setIsOpen}
                    title="Clear history?"
                    description="This will remove all scan, update, and action history. Logs and quarantine items will not be affected."
                    submitTxt="Clear history"
                    closeText="Cancel"
                    submitEvent={clearHistory}
               />
          </AppLayout>
     )
}