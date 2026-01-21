import { HistoryTable } from "@/components/data-table/tables/history";
import { AppLayout } from "@/components/layout";
import { RotateCw, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HISTORY_COLS } from "@/components/data-table/columns/history";
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

export default function HistoryPage(){
     const [data, setData] = useState<IHistoryData[]>([])
     const [isRefreshing, startTransition] = useTransition();
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
     
     const exportDataAs = async () => {
          const path = await save({
               filters: [
                    { name: "CSV", extensions: ["csv"] },
                    { name: "JSON", extensions: ["json","jsonc"] }
               ],
          })
          if(!path) return;
          if(path.endsWith(".csv")){
               await exportCSV(path,data)
          } else {
               await exportJSON(path,data)
          }
     }
     useEffect(()=>{
          fetchData()
     },[])
     return (
          <AppLayout className="space-y-4 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">History</h1>
                    <ButtonGroup>
                         <Button onClick={fetchData} disabled={isRefreshing}>
                              <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                              Refresh
                         </Button>
                         <Button variant="outline">
                              <Trash2/> Clear history
                         </Button>
                         <Button variant="outline" onClick={exportDataAs}>
                              <Download/> Export History As
                         </Button>
                    </ButtonGroup>
                    <HistoryTable
                         columns={HISTORY_COLS}
                         data={data}
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
          </AppLayout>
     )
}