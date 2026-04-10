import { IQuarantineData } from "@/lib/types/data";
import { invoke } from "@tauri-apps/api/core";
import { cache } from "react";

export const fetchQuarantine = cache(async(): Promise<IQuarantineData[]> =>{
     try{
          const data = await invoke<IQuarantineData[]>("list_quarantine");
          return data.map(({id,threat_name,file_path,quarantined_at,size})=>({
               id,
               threat_name,
               file_path,
               quarantined_at: new Date(quarantined_at),
               size: isNaN(size) ? 0 : size
          }))
     } catch {
          return []
     }
})