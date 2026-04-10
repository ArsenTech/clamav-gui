import { pickKeys } from "@/lib/helpers";
import { IDeviceInfo } from "@/lib/types/states";
import { HookReturnType, StatsResponse, SystemStats } from "@/lib/types/stats";
import { invoke } from "@tauri-apps/api/core";
import { cache } from "react";

export const getAntivirusStats = cache(async(): Promise<StatsResponse<"state">> =>{
     const stats = await invoke<StatsResponse<"type">>("get_stats");
     return {
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
     }
})

export const getSystemStats = cache(async<
     K extends readonly (keyof HookReturnType)[]
>(...keys: K): Promise<Pick<HookReturnType, K[number]>> => {
     const stats = await invoke<SystemStats>("get_sys_stats");
     const {cpu_usage,cpu_frequency} = stats;
     const avg_usage = cpu_usage.reduce((a,b)=>a+b,0)/cpu_usage.length;
     const avg_freq = cpu_frequency.reduce((a,b)=>a+b,0)/cpu_frequency.length;
     return pickKeys({
          ...stats,
          cpu_usage: Math.round(avg_usage),
          cpu_frequency: avg_freq
     },keys)
})

export const getDeviceInfo = cache(async() => await invoke<IDeviceInfo>("get_sys_info"))