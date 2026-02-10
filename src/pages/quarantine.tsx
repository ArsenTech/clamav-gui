import { AppLayout } from "@/components/layout";
import { ShieldCheck } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { lazy, Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import Popup from "@/components/popup";
import { toast } from "sonner";
import { IQuarantineState } from "@/lib/types/states";
import { INITIAL_QUARANTINE_STATE } from "@/lib/constants/states";
import QuarantineLoader from "@/loaders/quarantine";
import { IQuarantineData } from "@/lib/types/data";
import { useSettings } from "@/context/settings";
import { GET_QUARANTINE_COLS } from "@/components/data-table/columns/quarantine";
import { QuarantineAction } from "@/lib/types";
import { useTranslation } from "react-i18next";
const QuarantineTable = lazy(()=>import("@/contents/quarantine"))

export default function QuarantinePage(){
     const {settings} = useSettings();
     const [quarantineState, setQuarantineState] = useState<IQuarantineState>(INITIAL_QUARANTINE_STATE);
     const [isRefreshing, startTransition] = useTransition();
     const fetchData = () => {
          startTransition(()=>invoke<IQuarantineData[]>("list_quarantine").then(data=>{
               const newData: IQuarantineData[] = data.map(({id,threat_name,file_path,quarantined_at,size})=>({
                    id,
                    threat_name,
                    file_path,
                    quarantined_at: new Date(quarantined_at),
                    size: isNaN(size) ? 0 : size
               }))
               setState({ data: newData });
          }).catch(() => setState({ data: [] })));
     }
     useEffect(()=>fetchData(),[])
     const setState = (overrides: Partial<IQuarantineState>) => setQuarantineState(prev=>({ ...prev, ...overrides }))
     const {t: messageTxt} = useTranslation("messages")
     const quarantineAction = async(type: QuarantineAction) => {
          const commandName = `${type}_quarantine`
          try{
               await invoke(commandName,{
                    id: quarantineState.id,
                    logId: null,
               })
               const dataCopy = [...quarantineState.data].filter(val=>val.id!==quarantineState.id)
               setState({ data: dataCopy });
               toast.success(messageTxt(`${type}-quarantine.success`));
          } catch (err){
               toast.error(messageTxt(`${type}-quarantine.error`,{
                    description: String(err)
               }));
          } finally {
               setState({
                    isOpenRestore: false,
                    isOpenDelete: false,
                    id: ""
               })
          }
     }
     const bulkAction = async(type: QuarantineAction) => {
          const key = type==="restore" ? "bulkRestore" : "bulkDelete"
          setState({ [key]: false })
          try{
               const ids = data.map(t => t.id);
               const commandName = type==="restore" ? "restore_all" : "clear_quarantine";
               await invoke(commandName, { ids });
               setState({ data: [] })
               toast.success(messageTxt(`bulk-${type}-quarantine.success`));
          } catch (err){
               toast.error(messageTxt(`bulk-${type}-quarantine.error`,{
                    description: String(err)
               }));
          }
     }
     const {isOpenDelete, isOpenRestore, bulkDelete, bulkRestore, data} = quarantineState
     const isNotEmpty = useMemo(()=>data.length>0,[data]);
     const {t} = useTranslation("quarantine")
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
               {isNotEmpty ? (
                    <Suspense fallback={<QuarantineLoader rows={data.slice(0,10).length}/>}>
                         <QuarantineTable
                              data={data}
                              isRefreshing={isRefreshing}
                              onRefresh={fetchData}
                              onBulkClear={()=>setState({ bulkDelete: true })}
                              onBulkRestore={()=>setState({ bulkRestore: true })}
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
               <Popup
                    open={isOpenRestore}
                    onOpen={isOpenRestore=>setState({isOpenRestore})}
                    title={t("confirmation.title.restore")}
                    description={t("confirmation.desc.continue")}
                    submitTxt={t("confirmation.restore")}
                    closeText={t("confirmation.cancel")}
                    submitEvent={()=>quarantineAction("restore")}
               />
               <Popup
                    open={isOpenDelete}
                    onOpen={isOpenDelete=>setState({isOpenDelete})}
                    title={t("confirmation.title.delete")}
                    description={t("confirmation.desc.action-undone")}
                    submitTxt={t("confirmation.delete")}
                    type="danger"
                    closeText={t("confirmation.cancel")}
                    submitEvent={()=>quarantineAction("delete")}
               />
               <Popup
                    open={bulkDelete}
                    onOpen={bulkDelete=>setState({bulkDelete})}
                    title={t("confirmation.title.bulk-delete")}
                    description={t("confirmation.desc.action-undone")}
                    submitTxt={t("confirmation.delete")}
                    type="danger"
                    closeText={t("confirmation.cancel")}
                    submitEvent={()=>bulkAction("delete")}
               />
               <Popup
                    open={bulkRestore}
                    onOpen={bulkRestore=>setState({bulkRestore})}
                    title={t("confirmation.title.bulk-restore")}
                    description={t("confirmation.desc.continue")}
                    submitTxt={t("confirmation.restore")}
                    closeText={t("confirmation.cancel")}
                    submitEvent={()=>bulkAction("restore")}
               />
          </AppLayout>
     )
}