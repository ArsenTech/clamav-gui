import { AppLayout } from "@/components/layout";
import AntivirusProvider from "@/context/antivirus";
import useWindowTitle from "@/hooks/use-window-title";
import HistoryLoader from "@/loaders/history";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
const HistoryContent = lazy(()=>import("@/contents/history"))

export default function HistoryPage(){
     const {t} = useTranslation("history")
     useWindowTitle(t("title"))
     return (
          <AppLayout className="space-y-4 p-4">
               <AntivirusProvider>
                    <Suspense fallback={<HistoryLoader/>}>
                         <HistoryContent/>
                    </Suspense>
               </AntivirusProvider>
          </AppLayout>
     )
}