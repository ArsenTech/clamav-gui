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
import { IQuarantineData } from "@/lib/types";
import { formatBytes } from "@/lib/helpers";
import { useSettings } from "@/context/settings";
import { GET_QUARANTINE_COLS } from "@/components/data-table/columns/quarantine";
const QuarantineTable = lazy(()=>import("@/contents/quarantine"))

export default function QuarantinePage(){
     const {settings} = useSettings();
     const [quarantineState, setQuarantineState] = useState<IQuarantineState>(INITIAL_QUARANTINE_STATE);
     const [isRefreshing, startTransition] = useTransition();
     const fetchData = () => {
          startTransition(()=>invoke<IQuarantineData<"type">[]>("list_quarantine").then(data=>{
               const newData: IQuarantineData<"state">[] = data.map(({id,threat_name,file_path,quarantined_at,size})=>({
                    id,
                    threat_name,
                    file_path,
                    quarantined_at: new Date(quarantined_at),
                    size: isNaN(size) ? null : formatBytes(size)
               }))
               setState({ data: newData });
          }).catch(() => setState({ data: [] })));
     }
     useEffect(()=>fetchData(),[])
     const setState = (overrides: Partial<IQuarantineState>) => setQuarantineState(prev=>({ ...prev, ...overrides }))
     const quarantineAction = async(type: "restore" | "delete") => {
          const commandName = `${type}_quarantine`
          const message = type==="restore" ? "File restored from quarantine!" : "The file has been deleted permanently";
          const errorMessage = type==="restore" ? "Failed to restore file from quarantine" : "Failed to delete file from quarantine"
          try{
               await invoke(commandName,{
                    id: quarantineState.id,
                    logId: null,
               })
               const dataCopy = [...quarantineState.data].filter(val=>val.id!==quarantineState.id)
               setState({ data: dataCopy });
               toast.success(message);
          } catch (e){
               toast.error(errorMessage);
               console.error(e);
          } finally {
               setState({
                    isOpenRestore: false,
                    isOpenDelete: false,
                    id: ""
               })
          }
     }
     const bulkAction = async(type: "restore" | "delete") => {
          const key = type==="restore" ? "bulkRestore" : "bulkDelete"
          setState({ [key]: false })
          try{
               const ids = data.map(t => t.id);
               const commandName = type==="restore" ? "restore_all" : "clear_quarantine";
               const msgName = type === "restore" ? "All Threats restored" : "All Threats deleted"
               await invoke(commandName, { ids });
               setState({ data: [] })
               toast.success(msgName);
          } catch (err){
               const errMsg = type==="restore" ? "Failed to restore all threats" : "Failed to delete all threats";
               toast.error(errMsg);
               console.error(err)
          }
     }
     const {isOpenDelete, isOpenRestore, bulkDelete, bulkRestore, data} = quarantineState
     const isNotEmpty = useMemo(()=>data.length>0,[data])
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Quarantine</h1>
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
                              <EmptyTitle>No Quarantined Threats</EmptyTitle>
                              <EmptyDescription>Your system is clean and Lookin' Good!</EmptyDescription>
                         </EmptyHeader>
                    </Empty>
               )}
               <Popup
                    open={isOpenRestore}
                    onOpen={isOpenRestore=>setState({isOpenRestore})}
                    title="Are you sure to restore this file from quarantine?"
                    submitTxt="Restore"
                    closeText="Cancel"
                    submitEvent={()=>quarantineAction("restore")}
               />
               <Popup
                    open={isOpenDelete}
                    onOpen={isOpenDelete=>setState({isOpenDelete})}
                    title="Are you sure to delete this file permanently?"
                    description="The process can't be undone."
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={()=>quarantineAction("delete")}
               />
               <Popup
                    open={bulkDelete}
                    onOpen={bulkDelete=>setState({bulkDelete})}
                    title="This will permanently delete all quarantined threats."
                    description="Continue?"
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={()=>bulkAction("delete")}
               />
               <Popup
                    open={bulkRestore}
                    onOpen={bulkRestore=>setState({bulkRestore})}
                    title="This will restore all quarantined threats."
                    description="Continue?"
                    submitTxt="Restore"
                    closeText="Cancel"
                    submitEvent={()=>bulkAction("restore")}
               />
          </AppLayout>
     )
}