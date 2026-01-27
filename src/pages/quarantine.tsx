import { ThreatsTable } from "@/components/data-table/tables/threats";
import { AppLayout } from "@/components/layout";
import { RotateCcw, RotateCw, ShieldCheck, Trash2 } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { GET_QUARANTINE_COLS } from "@/components/data-table/columns/quarantine";
import { useEffect, useState, useTransition } from "react";
import { IQuarantineData } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { formatBytes } from "@/lib/helpers";
import Popup from "@/components/popup";
import { toast } from "sonner";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IQuarantineState } from "@/lib/types/states";
import { INITIAL_QUARANTINE_STATE } from "@/lib/constants/states";
import useSettings from "@/hooks/use-settings";

export default function QuarantinePage(){
     const {settings} = useSettings();
     const [isRefreshing, startTransition] = useTransition();
     const [quarantineState, setQuarantineState] = useState<IQuarantineState>(INITIAL_QUARANTINE_STATE);
     const setState = (overrides: Partial<IQuarantineState>) =>
          setQuarantineState(prev=>({
               ...prev,
               ...overrides
          }))
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
     useEffect(()=>{
          fetchData()
     },[])
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
     const handleBulkDelete = async()=>{
          setState({bulkDelete: false})
          try {
               const ids = data.map(t => t.id);
               await invoke("clear_quarantine", { ids });
               setState({ data: [] })
               toast.success("All threats deleted");
          } catch {
               toast.error("Failed to delete all threats");
          }
     }
     const handleBulkRestore = async()=>{
          setState({
               bulkRestore: false
          })
          try {
               const ids = data.map(t => t.id);
               await invoke("restore_all", { ids });
               setState({ data: [] })
               toast.success("All threats restored!");
          } catch {
               toast.error("Failed to restore all threats");
          }
     }
     const {isOpenDelete, isOpenRestore, bulkDelete, bulkRestore, data} = quarantineState
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Quarantine</h1>
               {data.length>0 ? (
                    <>
                    <ButtonGroup>
                         <Button onClick={fetchData} disabled={isRefreshing}>
                              <RotateCw className={cn(isRefreshing && "animate-spin")}/>
                              {isRefreshing ? "Refreshing..." : "Refresh"}
                         </Button>
                         <Button variant="secondary" onClick={()=>setState({ bulkDelete: true })}>
                              <Trash2/> Clear All
                         </Button>
                         <Button variant="secondary" onClick={()=>setState({ bulkRestore: true })}>
                              <RotateCcw/> Restore All
                         </Button>
                    </ButtonGroup>
                         <ThreatsTable
                              columns={GET_QUARANTINE_COLS(setState,settings.developerMode)}
                              data={data}
                              searchColumn="threat_name"
                         />
                    </>
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
                    submitEvent={handleBulkDelete}
               />
               <Popup
                    open={bulkRestore}
                    onOpen={bulkRestore=>setState({bulkRestore})}
                    title="This will restore all quarantined threats."
                    description="Continue?"
                    submitTxt="Restore"
                    closeText="Cancel"
                    submitEvent={handleBulkRestore}
               />
          </AppLayout>
     )
}