import { getErrorMessage } from "@/lib/helpers";
import { invoke } from "@tauri-apps/api/core";
import { cache } from "react";
import { toast } from "sonner";

export const fetchLogs = cache(async(logId: string | undefined, category: string | null): Promise<string[]> => {
     if(!logId || !category){
          return([`[ERROR] Failed to load the log (Log ID: ${logId})`])
     }
     try{
          const logs = await invoke<string>("read_log",{
               id: logId,
               category
          })
          return logs.split("\n").filter(Boolean)
     } catch (err) {
          const msg = [`[ERROR] Failed to load the log (Log ID: ${logId})`]
          toast.error(msg,{
               description: getErrorMessage(err)
          })
          return msg
     }
})