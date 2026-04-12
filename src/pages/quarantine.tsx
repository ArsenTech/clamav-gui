import { AppLayout } from "@/components/layout";
import { ShieldCheck } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { lazy, Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { IQuarantineState } from "@/lib/types/states";
import { INITIAL_QUARANTINE_STATE } from "@/lib/constants/states";
import QuarantineLoader from "@/loaders/quarantine";
import { useSettings } from "@/context/settings";
import { GET_QUARANTINE_COLS } from "@/data-table/columns/quarantine";
import { ActionType, QuarantineConfirmationState } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { useQuarantineCount } from "@/context/quarantine-count";
import ConfirmationMessage from "@/components/popup/confirm";
import { getErrorMessage } from "@/lib/helpers";
import { fetchQuarantine } from "@/data/quarantine";
const QuarantineTable = lazy(()=>import("@/contents/quarantine"))

export default function QuarantinePage(){
     const {settings} = useSettings();
     const [quarantineState, setQuarantineState] = useState<IQuarantineState>(INITIAL_QUARANTINE_STATE);
     const [isRefreshing, startTransition] = useTransition();
     const {setCount, decreaseBy} = useQuarantineCount();
     const fetchData = () => {
          startTransition(async()=>{
               const newData = await fetchQuarantine();
               setCount(newData.length)
               setState({ data: newData });
          });
     }
     useEffect(()=>fetchData(),[])
     const setState = (overrides: Partial<IQuarantineState>) => setQuarantineState(prev=>({ ...prev, ...overrides }))
     const {t: messageTxt} = useTranslation("messages")
     const quarantineAction = async(type: ActionType) => {
          const commandName = `${type}_quarantine`
          try{
               await invoke(commandName,{
                    id: quarantineState.id,
                    logId: null,
               })
               const dataCopy = [...quarantineState.data].filter(val=>val.id!==quarantineState.id)
               setState({ data: dataCopy });
               decreaseBy(1)
               toast.success(messageTxt(`${type}-quarantine.success`));
          } catch (err){
               toast.error(messageTxt(`${type}-quarantine.error`),{
                    description: getErrorMessage(err)
               });
          } finally {
               setState({
                    popupState: "",
                    id: ""
               })
          }
     }
     const bulkAction = async(type: ActionType) => {
          const key = type==="restore" ? "bulkRestore" : "bulkDelete"
          setState({ [key]: false })
          try{
               const ids = data.map(t => t.id);
               const commandName = type==="restore" ? "restore_all" : "clear_quarantine";
               await invoke(commandName, { ids });
               setCount(0)
               setState({ data: [] })
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
     const {popupState, data} = quarantineState
     const isNotEmpty = useMemo(()=>data.length>0,[data]);
     const {t} = useTranslation("quarantine")
     const isRestoreAction = useMemo(()=>popupState==="restore" || popupState==="bulk-restore",[popupState])
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               {isNotEmpty ? (
                    <Suspense fallback={<QuarantineLoader rows={data.slice(0,10).length}/>}>
                         <QuarantineTable
                              data={data}
                              isRefreshing={isRefreshing}
                              onRefresh={fetchData}
                              onBulkClear={()=>setState({ popupState: "bulk-delete" })}
                              onBulkRestore={()=>setState({ popupState: "bulk-restore" })}
                              columns={GET_QUARANTINE_COLS(setState,settings.developerMode)}
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
                    onOpenChange={(state)=>setState({ popupState: state as "" | QuarantineConfirmationState })}
               />
          </AppLayout>
     )
}