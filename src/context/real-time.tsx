import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { invoke } from "@tauri-apps/api/core";
import { fetchPaths } from "@/lib/helpers/fs";

type RealtimeContextValue = {
     enabled: boolean;
     start(): Promise<void>;
     stop(): Promise<void>;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
     const { settings } = useSettings();
     const [paths, setPaths] = useState<string[]>([])
     const [enabled, setEnabled] = useState(settings.realTime);
     const start = async (paths: string[]) => {
          await invoke("start_real_time_scan", { paths, behavior: settings.behavior || "balanced" });
     };
     const stop = async () => {
          await invoke("stop_real_time_scan");
     };
     useEffect(()=>{
          (async()=>{
               const paths = await fetchPaths();
               setPaths(paths)
          })()
     },[])
     useEffect(() => {
          if(!settings.realTime){
               stop();
               setEnabled(false);
               return
          }
          if(paths.length<=0) return;
          start(paths);
          setEnabled(true);
     }, [settings.realTime, paths, settings.behavior]);
     return (
          <RealtimeContext.Provider
               value={{
                    enabled,
                    start: async () => {
                         await start(paths);
                         setEnabled(true);
                    },
                    stop: async () => {
                         await stop();
                         setEnabled(false);
                    },
               }}
          >
               {children}
          </RealtimeContext.Provider>
     );
}

export function useRealtimeScan() {
     const ctx = useContext(RealtimeContext);
     if (!ctx) {
          throw new Error("useRealtimeContext must be used inside RealtimeProvider");
     }
     return ctx;
}