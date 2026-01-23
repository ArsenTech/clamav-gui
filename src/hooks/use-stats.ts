import { pickKeys } from "@/lib/helpers";
import { HookReturnType, StatsResponse, SystemStats } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function useSystemStats<
     K extends readonly (keyof HookReturnType)[]
>(...keys: K): Pick<HookReturnType, K[number]> {
     const [state, setState] = useState<Pick<HookReturnType, K[number]>>(
          {} as Pick<HookReturnType, K[number]>
     )
     useEffect(()=>{
          const interval = setInterval(async()=>{
               const stats = await invoke<SystemStats>("get_sys_stats");
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

export function useAntivirusStats(startTransition: React.TransitionStartFunction): {
     stats: StatsResponse<"state">,
     refresh: () => void
}{
     const [stats, setStats] = useState<StatsResponse<"state">>({
          activity: [],
          scanTypes: [],
          threatStatus: [],
          virusTypes: []
     });
     const refresh = () => startTransition(async()=>{
          const stats = await invoke<StatsResponse<"type">>("get_stats");
          console.log(stats)
          setStats(prev=>({
               ...prev,
               activity: stats.activity,
               scanTypes: stats.scan_types.map(val=>({
                    ...val,
                    fill: `var(--color-${val.scan_type})`
               })),
               threatStatus: stats.threat_status.map(val=>({
                    ...val,
                    fill: `var(--color-${val.status})`
               })),
               virusTypes: stats.virus_types.map(val=>({
                    ...val,
                    fill: `var(--color-${val.virus_type})`
               }))
          }))
     })
     useEffect(()=>{
          refresh()
     },[]);
     return {
          stats,
          refresh
     }
}