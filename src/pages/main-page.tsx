import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import OverviewLoader from "@/loaders/overview";
const OverviewContent = lazy(()=>import("@/contents/overview"))

export default function App() {
     return (
          <AppLayout className="flex justify-center items-center gap-3 flex-col">
               <Suspense fallback={<OverviewLoader/>}>
                    <OverviewContent/>
               </Suspense>
          </AppLayout>
     )
}