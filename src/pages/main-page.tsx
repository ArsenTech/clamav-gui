import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import OverviewLoader from "@/loaders/overview";
import useWindowTitle from "@/hooks/use-window-title";
const OverviewContent = lazy(()=>import("@/contents/overview"))

export default function App() {
     useWindowTitle()
     return (
          <AppLayout className="flex justify-center items-center gap-3 flex-col">
               <Suspense fallback={<OverviewLoader/>}>
                    <OverviewContent/>
               </Suspense>
          </AppLayout>
     )
}