import { AppLayout } from "@/components/layout";

export default function HistoryPage(){
     return (
          <AppLayout className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">History</h1>
               </div>
               <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[700px]">
                    <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Logs</h2>
               </div>
          </AppLayout>
     )
}