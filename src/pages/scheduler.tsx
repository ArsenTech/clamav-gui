import { AppLayout } from "@/components/layout";
import { Suspense, lazy } from "react";
import SchedulerLoader from "@/loaders/scheduler";
import useWindowTitle from "@/hooks/use-window-title";
import { useTranslation } from "react-i18next";
import AntivirusProvider from "@/context/antivirus";
const SchedulerContent = lazy(()=>import("@/contents/scheduler"))

export default function SchedulerPage(){
     const {t} = useTranslation("scheduler")
     useWindowTitle(t("title"))
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <AntivirusProvider>
                    <Suspense fallback={<SchedulerLoader/>}>
                         <SchedulerContent/>
                    </Suspense>
               </AntivirusProvider>
          </AppLayout>
     )
}