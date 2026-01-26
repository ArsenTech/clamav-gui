import { createContext, useContext, useEffect, useState } from "react";
import { ScanType } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";

interface StartupScanState {
     scanType: ScanType | null;
     isStartup: boolean;
     isScheduled: boolean
}

const DEFAULT_STATE: StartupScanState = {
     scanType: null,
     isStartup: false,
     isScheduled: false,
};

export const StartupScanContext = createContext<StartupScanState>(DEFAULT_STATE);

export const useStartupScan = () => {
     const ctx = useContext(StartupScanContext);
     if (!ctx) throw new Error("useStartupScan must be used inside StartupScanProvider");
     return ctx;
};

interface ContextProps{
     children: React.ReactNode
}
export default function StartupScanProvider({children}: ContextProps){
     const [startupScan, setStartupScan] = useState<StartupScanState>(DEFAULT_STATE);
     useEffect(() => {
          invoke<{
               scan_type: ScanType | null;
               is_startup: boolean;
               is_scheduled: boolean;
          }>("get_startup_scan").then(res => {
               setStartupScan({
                    scanType: res.scan_type,
                    isStartup: res.is_startup,
                    isScheduled: res.is_scheduled
               });
          });
     }, []);
     return (
          <StartupScanContext.Provider value={startupScan}>
               {children}
          </StartupScanContext.Provider>
     )
}