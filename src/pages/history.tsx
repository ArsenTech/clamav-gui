import { AppLayout } from "@/components/layout";
import AppHistoryProvider from "@/context/antivirus/history";
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
               <AppHistoryProvider>
                    <Suspense fallback={<HistoryLoader/>}>
                         <HistoryContent/>
                    </Suspense>
               </AppHistoryProvider>
          </AppLayout>
     )
}