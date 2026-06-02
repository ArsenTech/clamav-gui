import { SchedulerTable } from "@/data-table/tables/scheduler";
import SchedulerForm from "@/components/antivirus/scheduler-form";
import { SchedulerConfState, SchedulerType } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { ISchedulerData } from "@/lib/types/data";
import { DAYS_OF_THE_WEEK } from "@/lib/constants";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";
import { ISchedulerState } from "@/lib/types/states";
import { INITIAL_SCHEDULER_STATE } from "@/lib/constants/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import ConfirmationMessage from "@/components/popup/confirm";
import { getErrorMessage } from "@/lib/helpers";
import { fetchSchedulerData } from "@/data/scheduler";

export default function SchedulerContent(){
     const {settings} = useSettings();
     const [isPending, startTransition] = useTransition();
     const [isSubmitting, startSubmitTransition] = useTransition();
     const [schedulerState, setSchedulerState] = useState<ISchedulerState>(INITIAL_SCHEDULER_STATE);
     const setState = (overrides: Partial<ISchedulerState>) => setSchedulerState(prev=>({ ...prev, ...overrides }))
     const {t: messageTxt} = useTranslation("messages")
     const handleSchedule = (values: SchedulerType) => {
          if(!settings.enableSchedulerUI) return;
          startSubmitTransition(async()=>{
               try{
                    const currDay = new Date().getDay();
                    await invoke("schedule_task",{
                         ...values,
                         days: values.days || DAYS_OF_THE_WEEK[currDay]
                    })
               } catch (err) {
                    toast.error(messageTxt("schedule-scan-error"),{
                         description: getErrorMessage(err)
                    });
               }
          })
     }
     const handleRemoveJob = () => {
          if(!settings.enableSchedulerUI || isPending) return;
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
                    toast.success(messageTxt("remove-job.success"))
               } catch (err){
                    toast.error(messageTxt("remove-job.error"),{
                         description: getErrorMessage(err)
                    });
               } finally {
                    setState({popupState: ""})
               }
          })
     }
     const handleClear = () => {
          if(!settings.enableSchedulerUI || isPending) return;
          startTransition(async() => {
               try {
                    await invoke("clear_scheduled_jobs");
                    setState(INITIAL_SCHEDULER_STATE)
                    toast.success(messageTxt("clear-jobs.success"))
               } catch (err){
                    toast.error(messageTxt("clear-jobs.error"),{
                         description: getErrorMessage(err)
                    });
               } finally {
                    setState({popupState: ""})
               }
          })
     }
     const refresh = () => {
          if(!settings.enableSchedulerUI) return;
          startTransition(async()=>{
               const newData = await fetchSchedulerData(messageTxt);
               setState({data: newData})
          })
     }
     const ACTIONS = {
          "delete-job": handleRemoveJob,
          "clear-jobs": handleClear
     } as const
     const handleConfirm = () => {
          if(schedulerState.popupState) ACTIONS[schedulerState.popupState]()
     }
     useEffect(()=>{
          if(!settings.enableSchedulerUI) return;
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
     const {data,popupState} = schedulerState
     const {t} = useTranslation("scheduler")
     return !settings.enableSchedulerUI ? null : (
          <>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
          <SchedulerTable
               headerElement={(
                    <ButtonGroup>
                         <Button disabled={isPending || isSubmitting} onClick={refresh}>
                              <RotateCw className={cn(isPending && "animate-spin")}/>
                              {isPending ? t("refresh.loading") : t("refresh.original")}
                         </Button>
                         <Button variant="outline" disabled={isPending || !data.length || isSubmitting} onClick={()=>setState({popupState: "clear-jobs"})}>
                              <Trash2/>
                              {t("clear-jobs")}
                         </Button>
                    </ButtonGroup>
               )}
               setState={setState}
               data={data}
          />
          <h2 className="text-xl md:text-2xl font-medium border-b pb-2 w-fit self-start text-left">{t("form.title")}</h2>
          <SchedulerForm
               handleSubmit={handleSchedule}
               isSubmitting={isSubmitting}
          />
          <ConfirmationMessage
               state={popupState}
               submitAction={popupState==="clear-jobs" ? "clear-jobs" : "delete-job"}
               submitEvent={handleConfirm}
               type="danger"
               onOpenChange={(state)=>setState({ popupState: state as "" | SchedulerConfState})}
          />
          </>
     )
}