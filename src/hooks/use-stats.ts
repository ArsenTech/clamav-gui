import { getAntivirusStats, getSystemStats } from "@/data/stats";
import { HookReturnType, StatsResponse } from "@/lib/types/stats";
import { useEffect, useState } from "react";

export function useSystemStats<
     K extends readonly (keyof HookReturnType)[]
>(...keys: K): Pick<HookReturnType, K[number]> {
     const [state, setState] = useState<Pick<HookReturnType, K[number]>>(
          {} as Pick<HookReturnType, K[number]>
     )
     useEffect(()=>{
          const interval = setInterval(async()=>{
               const filtered = await getSystemStats(...keys)
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
          const fetched = await getAntivirusStats();
          setStats(prev=>({
               ...prev,
               ...fetched
          }))
     })
     useEffect(()=>{
          refresh()
     },[]);
     return { stats, refresh }
}