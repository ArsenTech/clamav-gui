import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface SystemStats{
     cpu_usage: number[],
     cpu_frequency: number[],
     ram_used: number,
     ram_total: number,
     disk_read_bytes: number,
     disk_written_bytes: number,
}

interface HookReturnType{
     cpu_usage: number,
     cpu_frequency: number,
     ram_used: number,
     ram_total: number,
     disk_read_bytes: number,
     disk_written_bytes: number,
}

function pickKeys<T extends object, K extends readonly (keyof T)[]>(
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
     K extends readonly (keyof HookReturnType)[]
>(...keys: K): Pick<HookReturnType, K[number]> {
     const [state, setState] = useState<Pick<HookReturnType, K[number]>>(
          {} as Pick<HookReturnType, K[number]>
     )
     useEffect(()=>{
          const interval = setInterval(async()=>{
               const stats: SystemStats = await invoke("get_sys_stats");
               const {cpu_usage,cpu_frequency} = stats;
               const avg_usage = cpu_usage.reduce((a,b)=>a+b,0)/cpu_usage.length;
               const avg_freq = cpu_frequency.reduce((a,b)=>a+b,0)/cpu_frequency.length;
               const filtered = pickKeys({
                    ...stats,
                    cpu_usage: Math.round(avg_usage),
                    cpu_frequency: avg_freq
               },keys)
               setState(prev=>({...prev,...filtered}))
          },1000);
          return () => clearInterval(interval);
     },[]);
     return state;
}