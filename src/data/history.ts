import { IHistoryData } from "@/lib/types/data";
import { invoke } from "@tauri-apps/api/core";
import { cache } from "react";
import { translateDetails } from "@/lib/helpers/history";
import { TFunction } from "i18next";
import { getErrorMessage } from "@/lib/helpers";
import { toast } from "sonner";

export const fetchHistoryData = cache(async(t: TFunction<"history">, errMsg: TFunction<"messages">): Promise<IHistoryData<"state">[]> => {
     try {
          const fetched = await invoke<IHistoryData<"type">[]>("load_history", {days: 7});
          return fetched.map(val=>({
               ...val,
               logId: val.log_id,
               details: translateDetails(val.details,t)
          }))
     } catch (err) {
          toast.error(errMsg("fetch-error.history"),{
               description: getErrorMessage(err)
          })
          return []
     }
})