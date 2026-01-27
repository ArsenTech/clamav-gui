import { SchedulerTable } from "@/components/data-table/tables/scheduler";
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
import { RotateCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Popup from "@/components/popup";
import { ButtonGroup } from "@/components/ui/button-group";
import { ISchedulerState } from "@/lib/types/states";
import { INITIAL_SCHEDULER_STATE } from "@/lib/constants/states";

export default function SchedulerContent(){
     const [isPending, startTransition] = useTransition();
     const [isSubmitting, startSubmitTransition] = useTransition();
     const [schedulerState, setSchedulerState] = useState<ISchedulerState>(INITIAL_SCHEDULER_STATE);
     const setState = (overrides: Partial<ISchedulerState>) =>
          setSchedulerState(prev=>({
               ...prev,
               ...overrides
          }))
     const handleSchedule = (values: SchedulerType) => {
          startSubmitTransition(async()=>{
               try{
                    const currDay = new Date().getDay();
                    await invoke<SchedulerType>("schedule_task",{
                         ...values,
                         days: values.days || DAYS_OF_THE_WEEK[currDay]
                    })
               } catch (err) {
                    toast.error("Failed to schedule a scan job");
                    console.error(err);
               }
          })
     }
     const handleRemoveJob = () => {
          setState({isOpenDelete: false})
          startTransition(async()=>{
               if(!schedulerState.job_id) return;
               try{
                    await invoke("remove_scheduled_task",{
                         taskName: schedulerState.job_id
                    })
                    setSchedulerState(prev=>({
                         ...prev,
                         job_id: "",
                         data: prev.data.filter(val=>val.id!==schedulerState.job_id)
                    }))
                    toast.success("Scheduled scan job removed!")
               } catch (err){
                    toast.error("Failed to remove the scheduled scan job");
                    console.error(err);
               }
          })
     }
     const handleClear = () => {
          setState({isOpenClear: false});
          startTransition(async() => {
               try {
                    await invoke("clear_scheduled_jobs");
                    setState(INITIAL_SCHEDULER_STATE)
                    toast.success("Scheduled scan job removed!")
               } catch (err){
                    toast.error("Failed to remove all scheduled scan jobs");
                    console.error(err);
               }
          })
     }
     const refresh = () => {
          startTransition(async()=>{
               try{
                    const data = await invoke<ISchedulerData<"type">[]>("list_scheduler");
                    const newData: ISchedulerData<"state">[] = data.map(({id,interval,scan_type,time,log_id, last_run})=>{
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
                              lastScan: last_run ? new Date(last_run) : null,
                              nextScan,
                              log_id
                         })
                    })
                    setState({data: newData})
               } catch (err){
                    toast.error("Failed to fetch scheduled scans");
                    console.error(err);
                    setState({data: []})
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
                    setSchedulerState(prev=>{
                         if(prev.data.some(i=>i.id===payload.id)) return prev;
                         const data = [...prev.data, {
                              id: payload.id,
                              interval: payload.interval,
                              scanType: payload.scan_type,
                              lastScan: payload.last_run ? new Date(payload.last_run) : null,
                              nextScan,
                              log_id: payload.log_id
                         }];
                         return {
                              ...prev,
                              data
                         }
                    });
               })
          ];
          refresh();
          return () => {
               Promise.all(unsubs).then(fns=>fns.forEach(f=>f()))
          }
     },[])
     const {data,isOpenClear,isOpenDelete} = schedulerState
     return (
          <>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Scheduler</h1>
          <SchedulerTable
               headerElement={(
                    <ButtonGroup>
                         <Button disabled={isPending || isSubmitting} onClick={refresh}>
                              <RotateCw className={cn(isPending && "animate-spin")}/>
                              {isPending ? "Please wait..." : "Refresh"}
                         </Button>
                         <Button variant="outline" disabled={isPending || !data.length || isSubmitting} onClick={()=>setState({isOpenClear: true})}>
                              <Trash2/>
                              Clear Jobs
                         </Button>
                    </ButtonGroup>
               )}
               columns={GET_SCHEDULER_COLS(setState)}
               data={data}
          />
          <h2 className="text-xl md:text-2xl font-medium border-b pb-2 w-fit self-start text-left">Schedule a scan</h2>
          <SchedulerForm
               handleSubmit={handleSchedule}
               isSubmitting={isSubmitting}
          />
          <Popup
               open={isOpenDelete}
               onOpen={isOpenDelete=>setState({isOpenDelete})}
               title="This will remove the selected scheduled scan job"
               description="Continue?"
               submitTxt="Remove"
               closeText="Cancel"
               submitEvent={handleRemoveJob}
          />
          <Popup
               open={isOpenClear}
               onOpen={isOpenClear=>setState({isOpenClear})}
               title="This will remove all scheduled scan jobs"
               description="Continue?"
               submitTxt="Clear Jobs"
               closeText="Cancel"
               submitEvent={handleClear}
          />
          </>
     )
}