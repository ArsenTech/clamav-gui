import { SchedulerTable } from "@/components/data-table/tables/scheduler";
import { AppLayout } from "@/components/layout";
import SchedulerForm from "@/components/antivirus/scheduler-form";
import { SchedulerType } from "@/lib/types/schema";
import { useEffect, useState, useTransition } from "react";
import { ISchedulerData } from "@/lib/types";
import { GET_SCHEDULER_COLS } from "@/components/data-table/columns/scheduler";
import { DAYS_OF_THE_WEEK } from "@/lib/constants";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Popup from "@/components/popup";

export default function SchedulerPage(){
     const [isPending, startTransition] = useTransition();
     const [isOpen, setIsOpen] = useState({
          state: false,
          job_id: ""
     });
     const [schedulerData, setSchedulerData] = useState<ISchedulerData<"state">[]>([]);
     const handleSchedule = async(values: SchedulerType) => {
          const currDay = new Date().getDay();
          await invoke<SchedulerType>("schedule_task",{
               ...values,
               days: values.days || DAYS_OF_THE_WEEK[currDay]
          })
     }
     const handleRemoveJob = () => {
          setIsOpen(prev=>({...prev,state: false}));
          startTransition(async()=>{
               if(!isOpen.job_id) return;
               try{
                    await invoke("remove_scheduled_task",{
                         taskName: isOpen.job_id
                    })
                    setSchedulerData(prev=>prev.filter(val=>val.id!==isOpen.job_id))
                    setIsOpen(prev=>({...prev,job_id: ""}));
                    toast.success("Scheduled scan job removed!")
               } catch (err){
                    toast.error("Failed to remove the scheduled scan job");
                    console.error(err);
               }
          })
     }
     const refresh = () => {
          startTransition(async()=>{
               try{
                    const data = await invoke<ISchedulerData<"type">[]>("list_scheduler");
                    
                    const newData: ISchedulerData<"state">[] = data.map(({id,interval,scan_type,time,log_id})=>{
                         const [hours, minutes] = time.split(":");
                         const nextScan = new Date();
                         nextScan.setHours(Number(hours));
                         nextScan.setMinutes(Number(minutes));
                         nextScan.setSeconds(0);
                         if (interval === "daily") 
                              if (nextScan < new Date()) nextScan.setDate(nextScan.getDate() + 1);
                         if (interval === "weekly") 
                              nextScan.setDate(nextScan.getDate() + 7);
                         if (interval === "monthly") 
                              nextScan.setMonth(nextScan.getMonth() + 1);
                         return ({
                              id,
                              interval,
                              scanType: scan_type,
                              lastScan: "Never",
                              nextScan: nextScan.toLocaleString(),
                              log_id
                         })
                    })
                    setSchedulerData([...new Set(newData)])
               } catch (err){
                    toast.error("Failed to fetch scheduled scans");
                    console.error(err);
                    setSchedulerData([])
               }
          })
     }
     useEffect(()=>{
          const unsubs: Promise<UnlistenFn>[] = [
               listen<ISchedulerData<"type">>("scheduler:created",e=>{
                    const {payload} = e;
                    const nextScan = new Date();
                    const [hours, minutes] = payload.time.split(":");
                    nextScan.setHours(Number(hours));
                    nextScan.setMinutes(Number(minutes));
                    setSchedulerData(prev=>{
                         if(prev.some(i=>i.id===payload.id)) return prev;
                         return [
                              ...prev,
                              {
                                   id: payload.id,
                                   interval: payload.interval,
                                   scanType: payload.scan_type,
                                   lastScan: "Never",
                                   nextScan: nextScan.toLocaleString(),
                                   log_id: payload.log_id
                              }
                         ]
                    });
               })
          ];
          refresh();
          return () => {
               Promise.all(unsubs).then(fns=>fns.forEach(f=>f()))
          }
     },[])
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Scheduler</h1>
               <Button disabled={isPending} onClick={refresh}>
                    <RotateCw className={cn(isPending && "animate-spin")}/>
                    {isPending ? "Please wait..." : "Refresh"}
               </Button>
               <SchedulerTable
                    columns={GET_SCHEDULER_COLS(setIsOpen)}
                    data={schedulerData}
               />
               <h2 className="text-xl md:text-2xl font-medium border-b pb-2 w-fit self-start text-left">Schedule a scan</h2>
               <SchedulerForm
                    handleSubmit={handleSchedule}
               />
               <Popup
                    open={isOpen.state}
                    onOpen={state=>setIsOpen(prev=>({...prev,state}))}
                    title="This will remove the selected scheduled scan job"
                    description="Continue?"
                    submitTxt="Remove"
                    closeText="Cancel"
                    submitEvent={handleRemoveJob}
               />
          </AppLayout>
     )
}