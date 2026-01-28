import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import ScanMenuLoader from "@/loaders/scan/menu";
const ScanMenuContent = lazy(()=>import("@/contents/scan-menu"))

export default function ScanMenuPage(){
     return (
          <AppLayout className="space-y-4 gap-10 p-4">
               <Suspense fallback={<ScanMenuLoader/>}>
                    <ScanMenuContent/>
               </Suspense>
          </AppLayout>
     )
}