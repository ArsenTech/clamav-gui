import { lazy, Suspense, useEffect, useTransition } from "react";
import { ISchedulerData } from "@/lib/types/data";
import { DAYS_OF_THE_WEEK } from "@/lib/constants";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { toast } from "sonner";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/lib/helpers";
import { useScheduler } from "@/context/antivirus/scheduler";
import { SchedulerType } from "@/lib/types/schemas";
import { SchedulerFormLoader, SchedulerTableHeaderLoader, SchedulerTableLoader } from "@/loaders/scheduler";

const SchedulerForm = lazy(()=>import("@/components/antivirus/scheduler-form"));
const SchedulerTable = lazy(()=>import("@/data-table/tables/scheduler"));
const SchedulerTableHeader = lazy(()=>import("./header"));

export default function SchedulerContent(){
     const {settings} = useSettings();
     const [isSubmitting, startSubmitTransition] = useTransition();
     const {schedulerState, setSchedulerState, refresh} = useScheduler()
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
     const {data} = schedulerState
     const {t} = useTranslation("scheduler")
     return !settings.enableSchedulerUI ? null : (
          <>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
          <Suspense fallback={<SchedulerTableLoader/>}>
               <SchedulerTable
                    headerElement={(
                         <Suspense fallback={<SchedulerTableHeaderLoader/>}>
                              <SchedulerTableHeader isSubmitting={isSubmitting}/>
                         </Suspense>
                    )}
                    data={data}
               />
          </Suspense>
          <h2 className="text-xl md:text-2xl font-medium border-b pb-2 w-fit self-start text-left">{t("form.title")}</h2>
          <Suspense fallback={<SchedulerFormLoader/>}>
               <SchedulerForm
                    handleSubmit={handleSchedule}
                    isSubmitting={isSubmitting}
               />
          </Suspense>
          </>
     )
}