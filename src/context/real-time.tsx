import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { invoke } from "@tauri-apps/api/core";

type RealtimeContextValue = {
     enabled: boolean;
     start(): Promise<void>;
     stop(): Promise<void>;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
     const { settings } = useSettings();
     const [enabled, setEnabled] = useState(settings.realTime);
     const start = async (paths: string[]) => {
          await invoke("start_real_time_scan", { paths });
     };
     const stop = async () => {
          await invoke("stop_real_time_scan");
     };
     useEffect(() => {
          if (settings.realTime) {
               start([
                    "C:\\Users",
                    "C:\\Program Files",
               ]);
               setEnabled(true);
          } else {
               stop();
               setEnabled(false);
          }
     }, [settings.realTime]);
     useEffect(()=>{
          console.table(enabled)
     },[enabled])
     return (
          <RealtimeContext.Provider
               value={{
                    enabled,
                    start: async () => {
                         await start([
                              "C:\\Users",
                              "C:\\Program Files",
                         ]);
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