import { ThreatsTable } from "@/components/data-table/tables/threats";
import { AppLayout } from "@/components/layout";
import { RotateCcw, RotateCw, ShieldCheck, Trash2 } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { QUARANTINE_COLS } from "@/components/data-table/columns/quarantine";
import { useEffect, useState, useTransition } from "react";
import { IQuarantineData } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { formatBytes } from "@/lib/helpers";
import Popup from "@/components/popup";
import { toast } from "sonner";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function QuarantinePage(){
     const [isOpenBulk, setIsOpenBulk] = useState({
          restore: false,
          delete: false,
     })
     const [isRefreshing, startTransition] = useTransition();
     const setBulkState = (overrides: Partial<typeof isOpenBulk>) =>
          setIsOpenBulk(prev=>({
               ...prev,
               ...overrides
          }))
     const [data, setData] = useState<IQuarantineData<"state">[]>([]);
     const [quarantineState, setQuarantineState] = useState({
          isOpenRestore: false,
          isOpenDelete: false,
          id: ""
     });
     const setState = (overrides: Partial<typeof quarantineState>) =>
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
                    quarantined_at: new Date(quarantined_at).toLocaleString(),
                    size: isNaN(size) ? null : formatBytes(size)
               }))
               setData(newData)
          }).catch(() => setData([])));
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
                    id: quarantineState.id
               })
               const dataCopy = [...data].filter(val=>val.id!==quarantineState.id)
               setData(dataCopy)
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
          setBulkState({
               delete: false
          })
          try {
               const ids = data.map(t => t.id);
               await invoke("clear_quarantine", { ids });
               setData([]);
               toast.success("All threats deleted");
          } catch {
               toast.error("Failed to delete all threats");
          }
     }
     const handleBulkRestore = async()=>{
          setBulkState({
               restore: false
          })
          try {
               const ids = data.map(t => t.id);
               await invoke("restore_all", { ids });
               setData([]);
               toast.success("All threats restored!");
          } catch {
               toast.error("Failed to restore all threats");
          }
     }
     const {isOpenDelete, isOpenRestore} = quarantineState
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
                         <Button variant="secondary" onClick={()=>setBulkState({ delete: true })}>
                              <Trash2/> Clear All
                         </Button>
                         <Button variant="secondary" onClick={()=>setBulkState({ restore: true })}>
                              <RotateCcw/> Restore All
                         </Button>
                    </ButtonGroup>
                         <ThreatsTable
                              columns={QUARANTINE_COLS(setQuarantineState)}
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
                    open={isOpenBulk.delete}
                    onOpen={open=>setBulkState({delete: open})}
                    title="This will permanently delete all quarantined threats."
                    description="Continue?"
                    submitTxt="Delete"
                    closeText="Cancel"
                    submitEvent={handleBulkDelete}
               />
               <Popup
                    open={isOpenBulk.restore}
                    onOpen={open=>setBulkState({restore: open})}
                    title="This will restore all quarantined threats."
                    description="Continue?"
                    submitTxt="Restore"
                    closeText="Cancel"
                    submitEvent={handleBulkRestore}
               />
          </AppLayout>
     )
}