import { AppLayout } from "@/components/layout";
import { Suspense, lazy } from "react";
import SchedulerLoader from "@/loaders/scheduler";
const SchedulerContent = lazy(()=>import("@/contents/scheduler"))

export default function SchedulerPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <Suspense fallback={<SchedulerLoader/>}>
                    <SchedulerContent/>
               </Suspense>
          </AppLayout>
     )
}