import { HistoryTable } from "@/components/data-table/tables/history";
import { AppLayout } from "@/components/layout";
import { ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IHistoryData } from "@/lib/types";
import { HISTORY_COLS } from "@/lib/constants/columns";
import { LOG_ITEMS } from "@/lib/constants";

export const historyData: IHistoryData[] = [
     {
          id: "1",
          timestamp: "2026-01-01",
          action: "Scan",
          details: "Scan finished. No infected files"
     },
     {
          id: "2",
          timestamp: "2026-01-02",
          action: "Config",
          details: "Config initialized successfully"
     },
     {
          id: "3",
          timestamp: "2026-01-03",
          action: "Update",
          details: "Database already up to date"
     }
]

export default function HistoryPage(){
     return (
          <AppLayout className="space-y-4 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">History</h1>
                    <HistoryTable
                         columns={HISTORY_COLS}
                         data={historyData}
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