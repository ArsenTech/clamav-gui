import { getErrorMessage } from "@/lib/helpers";
import { ISchedulerData } from "@/lib/types/data";
import { invoke } from "@tauri-apps/api/core";
import { TFunction } from "i18next";
import { cache } from "react";
import { toast } from "sonner";

export const fetchSchedulerData = cache(async(errMsg: TFunction<"messages">) => {
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
          return newData
     } catch (err){
          toast.error(errMsg("fetch-error.scheduler"),{
               description: getErrorMessage(err)
          });
          return []
     }
})