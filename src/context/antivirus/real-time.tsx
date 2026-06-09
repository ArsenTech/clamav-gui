import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSettings } from "@/context/settings";
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
     const start = useCallback(async () => {
          await invoke("start_real_time_scan", { behavior: settings.behavior || "balanced" });
          await invoke("update_tray_icon",{state: "enabled"})
     },[settings.behavior]);
     const stop = useCallback(async () => {
          await invoke("stop_real_time_scan");
          await invoke("update_tray_icon",{state: "disabled"})
     },[]);
     useEffect(() => {
          if(!settings.realTime){
               stop();
               setEnabled(false);
               return
          }
          start();
          setEnabled(true);
     }, [settings.realTime, settings.behavior]);
     const values: RealtimeContextValue = useMemo(()=>({
          enabled,
          start: async () => {
               await start();
               setEnabled(true);
          },
          stop: async () => {
               await stop();
               setEnabled(false);
          },
     }),[enabled])
     return (
          <RealtimeContext.Provider
               value={values}
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