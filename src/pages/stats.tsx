import { AppLayout } from "@/components/layout";
import { lazy, Suspense } from "react";
import StatsLoader from "@/loaders/stats";
import useWindowTitle from "@/hooks/use-window-title";
import { useTranslation } from "react-i18next";
const StatsContent = lazy(()=>import("@/contents/stats"))

export default function StatsPage(){
     const {t} = useTranslation("stats")
     useWindowTitle(t("title"))
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <Suspense fallback={<StatsLoader/>}>
                    <StatsContent/> 
               </Suspense>
          </AppLayout>
     )
}