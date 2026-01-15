import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface SystemStats{
     cpu_usage: number[],
     cpu_frequency: number[],

     ram_used: number,
     ram_total: number,

     disk_read_bytes: number,
     disk_written_bytes: number,

     sys_name: string,
     sys_os: string,
     sys_host: string,
}

function pickKeys<T extends SystemStats, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
     const out = {} as Pick<T, K[number]>
     for (const key of keys)
          if (key in obj)
               out[key] = obj[key];
     return out;
}

export function useSystemStats<
     K extends readonly (keyof SystemStats)[]
>(...keys: K): Pick<SystemStats, K[number]> {
     const [state, setState] = useState<Pick<SystemStats, K[number]>>(
          {} as Pick<SystemStats, K[number]>
     )
     useEffect(()=>{
          const interval = setInterval(async()=>{
               const stats: SystemStats = await invoke("get_sys_info");
               const filtered = pickKeys(stats,keys);
               setState(prev=>({...prev,...filtered}))
          },1000);
          return () => clearInterval(interval);
     },[]);
     return state;
}