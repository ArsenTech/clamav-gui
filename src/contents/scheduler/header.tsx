import { SchedulerConfState } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";
import { INITIAL_SCHEDULER_STATE } from "@/lib/constants/states";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import ConfirmationMessage from "@/components/popup/confirm";
import { getErrorMessage } from "@/lib/helpers";
import { useScheduler } from "@/context/antivirus/scheduler";

interface SchedulerTableHeaderProps{
     isSubmitting: boolean,
}
export default function SchedulerTableHeader({isSubmitting}: SchedulerTableHeaderProps){
     const {settings} = useSettings();
     const {schedulerState, setSchedulerState, refresh, isPending, updateSchedulerState, startTransition} = useScheduler()
     const {t: messageTxt} = useTranslation("messages")
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
                    updateSchedulerState({popupState: ""})
               }
          })
     }
     const handleClear = () => {
          if(!settings.enableSchedulerUI || isPending) return;
          startTransition(async() => {
               try {
                    await invoke("clear_scheduled_jobs");
                    updateSchedulerState(INITIAL_SCHEDULER_STATE)
                    toast.success(messageTxt("clear-jobs.success"))
               } catch (err){
                    toast.error(messageTxt("clear-jobs.error"),{
                         description: getErrorMessage(err)
                    });
               } finally {
                    updateSchedulerState({popupState: ""})
               }
          })
     }
     const ACTIONS = {
          "delete-job": handleRemoveJob,
          "clear-jobs": handleClear
     } as const
     const handleConfirm = () => {
          if(schedulerState.popupState) ACTIONS[schedulerState.popupState]()
     }
     const {popupState, data} = schedulerState
     const {t} = useTranslation("scheduler")
     return (
          <>
          <ButtonGroup>
               <Button disabled={isPending || isSubmitting} onClick={refresh}>
                    <RotateCw className={cn(isPending && "animate-spin")}/>
                    {isPending ? t("refresh.loading") : t("refresh.original")}
               </Button>
               <Button variant="outline" disabled={isPending || !data.length || isSubmitting} onClick={()=>updateSchedulerState({popupState: "clear-jobs"})}>
                    <Trash2/>
                    {t("clear-jobs")}
               </Button>
          </ButtonGroup>
          <ConfirmationMessage
               state={popupState}
               submitAction={popupState==="clear-jobs" ? "clear-jobs" : "delete-job"}
               submitEvent={handleConfirm}
               type="danger"
               onOpenChange={(state)=>updateSchedulerState({ popupState: state as "" | SchedulerConfState})}
          />
          </>
     )
}