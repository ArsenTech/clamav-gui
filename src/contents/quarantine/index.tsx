import { AppLayout } from "@/components/layout";
import { ShieldCheck } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { lazy, Suspense, useEffect, useMemo, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import QuarantineLoader from "@/loaders/quarantine";
import { useSettings } from "@/context/settings";
import { GET_QUARANTINE_COLS } from "@/data-table/columns/quarantine";
import { ActionType, QuarantineConfirmationState } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { useQuarantineCount } from "@/context/quarantine-count";
import ConfirmationMessage from "@/components/popup/confirm";
import { getErrorMessage } from "@/lib/helpers";
import { fetchQuarantine } from "@/data/quarantine";
import useWindowTitle from "@/hooks/use-window-title";
import { useAntivirus } from "@/context/antivirus";
const QuarantineTable = lazy(()=>import("./table"))

export default function QuarantineContent(){
     const {settings} = useSettings();
     const {quarantineState, updateQuarantineState} = useAntivirus()
     const [isRefreshing, startTransition] = useTransition();
     const {setCount, decreaseBy} = useQuarantineCount();
     const fetchData = () => {
          if(isRefreshing) return;
          startTransition(async()=>{
               const newData = await fetchQuarantine();
               setCount(newData.length)
               updateQuarantineState({ data: newData, isInitializing: false });
          });
     }
     useEffect(()=>fetchData(),[])
     const {t: messageTxt} = useTranslation("messages")
     const quarantineAction = async(type: ActionType) => {
          const commandName = `${type}_quarantine`
          try{
               await invoke(commandName,{
                    id: quarantineState.id,
                    logId: null,
               })
               const dataCopy = [...quarantineState.data].filter(val=>val.id!==quarantineState.id)
               updateQuarantineState({ data: dataCopy });
               decreaseBy(1)
               toast.success(messageTxt(`${type}-quarantine.success`));
          } catch (err){
               toast.error(messageTxt(`${type}-quarantine.error`),{
                    description: getErrorMessage(err)
               });
          } finally {
               updateQuarantineState({
                    popupState: "",
                    id: ""
               })
          }
     }
     const bulkAction = async(type: ActionType) => {
          const key = type==="restore" ? "bulkRestore" : "bulkDelete"
          updateQuarantineState({ [key]: false })
          try{
               const ids = data.map(t => t.id);
               const commandName = type==="restore" ? "restore_all" : "clear_quarantine";
               await invoke(commandName, { ids });
               setCount(0)
               updateQuarantineState({ data: [] })
               toast.success(messageTxt(`bulk-${type}-quarantine.success`));
          } catch (err){
               toast.error(messageTxt(`bulk-${type}-quarantine.error`),{
                    description: getErrorMessage(err)
               });
          }
     }
     const CLEAR_ACTIONS: Record<QuarantineConfirmationState,()=>void> = {
          "bulk-restore": () => bulkAction("restore"),
          "bulk-delete": () => bulkAction("delete"),
          "restore": () => quarantineAction("restore"),
          "delete": () => quarantineAction("delete"),
     }
     const handleConfirm = () => {
          if(popupState) CLEAR_ACTIONS[popupState]()
     }
     const {popupState, data, isInitializing} = quarantineState
     const isNotEmpty = useMemo(()=>data.length>0,[data]);
     const {t} = useTranslation("quarantine")
     const isRestoreAction = useMemo(()=>popupState==="restore" || popupState==="bulk-restore",[popupState])
     useWindowTitle(t("title"))
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               {isInitializing ? (
                   <QuarantineLoader rows={10}/>
               ) : isNotEmpty ? (
                    <Suspense fallback={<QuarantineLoader rows={data.slice(0,10).length}/>}>
                         <QuarantineTable
                              data={data}
                              isRefreshing={isRefreshing}
                              onRefresh={fetchData}
                              columns={GET_QUARANTINE_COLS(settings.developerMode)}
                         />
                    </Suspense>
               ) : (
                    <Empty>
                         <EmptyHeader>
                              <EmptyMedia variant="icon">
                                   <ShieldCheck/>
                              </EmptyMedia>
                              <EmptyTitle>{t("no-threats.title")}</EmptyTitle>
                              <EmptyDescription>{t("no-threats.desc")}</EmptyDescription>
                         </EmptyHeader>
                    </Empty>
               )}
               <ConfirmationMessage
                    state={popupState}
                    submitAction={isRestoreAction ? "restore" : "delete"}
                    submitEvent={handleConfirm}
                    type={isRestoreAction ? "default" : "danger"}
                    onOpenChange={(state)=>updateQuarantineState({ popupState: state as "" | QuarantineConfirmationState })}
               />
          </AppLayout>
     )
}