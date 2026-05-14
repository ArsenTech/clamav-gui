import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import ScanMenuLoader from "@/loaders/scan/menu";
import useWindowTitle from "@/hooks/use-window-title";
import { useTranslation } from "react-i18next";
const ScanMenuContent = lazy(()=>import("@/contents/scan-menu"))

export default function ScanMenuPage(){
     const {t} = useTranslation("scan")
     useWindowTitle(t("choose-scan-type"))
     return (
          <AppLayout className="space-y-4 gap-10 p-4">
               <Suspense fallback={<ScanMenuLoader/>}>
                    <ScanMenuContent/>
               </Suspense>
          </AppLayout>
     )
}