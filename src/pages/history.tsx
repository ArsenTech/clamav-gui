import { AppLayout } from "@/components/layout";
import HistoryLoader from "@/loaders/history";
import { lazy, Suspense } from "react";
const HistoryContent = lazy(()=>import("@/contents/history"))

export default function HistoryPage(){
     return (
          <AppLayout className="space-y-4 p-4">
               <Suspense fallback={<HistoryLoader/>}>
                    <HistoryContent/>
               </Suspense>
          </AppLayout>
     )
}