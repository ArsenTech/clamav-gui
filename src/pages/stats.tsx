import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import StatsLoader from "@/loaders/stats";
const StatsContent = lazy(()=>import("@/contents/stats"))

export default function StatsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <Suspense fallback={<StatsLoader/>}>
                    <StatsContent/> 
               </Suspense>
          </AppLayout>
     )
}