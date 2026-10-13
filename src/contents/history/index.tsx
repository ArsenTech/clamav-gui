import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppHistory } from "@/context/antivirus/history";
import { HistoryTableHeaderLoader, HistoryTableLoader } from "@/loaders/history";

const HistoryTable = lazy(()=>import("@/data-table/tables/history"));
const HistoryFilters = lazy(()=>import("./filters"))

export default function HistoryContent(){
     const {historyState, fetchData} = useAppHistory()
     const {t} = useTranslation("history")
     useEffect(()=>{
          fetchData()
     },[])
     const {data} = historyState
     return (
          <div className="space-y-4">
               <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               <Suspense fallback={<HistoryTableLoader/>}>
                    <HistoryTable
                         data={data}
                         headerElement={(
                              <Suspense fallback={<HistoryTableHeaderLoader/>}>
                                   <HistoryFilters/>
                              </Suspense>
                         )}
                    />
               </Suspense>
          </div>
     )
}