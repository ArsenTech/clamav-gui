import ScanFinishResult from "@/components/antivirus/scan/finish-scan";
import ScanMenu from "@/components/antivirus/scan/scan-menu";
import ScanProcess from "@/components/antivirus/scan/scan-process";
import { AppLayout } from "@/components/layout";
import { SCAN_TYPES } from "@/lib/constants";
import { GET_INITIAL_SCAN_STATE } from "@/lib/constants/states";
import { formatDuration } from "@/lib/helpers";
import { ScanType } from "@/lib/types";
import { IScanPageState } from "@/lib/types/states";
import { cn } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

export default function ScanPage(){
     const [params] = useSearchParams();
     const type = params.get("type") as ScanType | null;
     const [scanState, setScanState] = useState<IScanPageState>(GET_INITIAL_SCAN_STATE(type));
     const setState = (overrides: Partial<IScanPageState>) =>
          setScanState(prev=>({ ...prev, ...overrides }))
     const logRef = useRef<HTMLPreElement>(null)
     const startTimeRef = useRef<number | null>(null);
     const scanActiveRef = useRef(false);
     const scanStartedRef = useRef(false);
     const handleStartScan = async (type: ScanType) => setState({scanType: type})
     useEffect(()=>{
          const unLog = listen<string>("clamscan:log",e=>{
               if (!scanActiveRef.current) return;
               setScanState(prev=>({
                    ...prev,
                    logs: [...prev.logs.slice(-500), e.payload],
                    threats: e.payload.endsWith("FOUND") ? prev.threats+1 : prev.threats
               }))
               if (e.payload.includes(": OK") || e.payload.includes(" FOUND")) {
                    const idx = e.payload.lastIndexOf(": ");
                    setScanState(prev=>({
                         ...prev,
                         currLocation: idx !== -1 ? e.payload.slice(0, idx) : prev.currLocation,
                         scannedFiles: prev.scannedFiles+1
                    }))
               }
          })
          const unFinish = listen<boolean>("clamscan:finished",()=>{
               if (!scanActiveRef.current) return;
               reset({
                    isFinished: true,
                    duration: startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current)/1000) : 0
               });
          })
          const unTotal = listen<number>("clamscan:total", e =>setState({ totalFiles: e.payload }));
          return () => {
               unLog.then(f=>f());
               unFinish.then(f=>f());
               unTotal.then(f=>f());
          }
     },[]);
     useEffect(()=>{
          if(!scanState.scanType) return;
          if (scanStartedRef.current) return;
          scanStartedRef.current = true;
          if(
               scanState.scanType==="main" ||
               scanState.scanType==="full"
          ) invoke(`start_${scanState.scanType}_scan`).catch(()=>{
               toast.error("Scan command not found")
          })
          startTimeRef.current = Date.now();
          scanActiveRef.current = true;
          setState({duration: 0})
     },[scanState.scanType])
     const handleStop = async() => {
          reset();
          try {
               await invoke("stop_scan");
               toast.success(`The ${SCAN_TYPES.find(val=>val.type===scanState.scanType)?.name || "Unknown Scan"} Process has been stopped.`)
          } catch (e){
               toast.error("Failed to stop the scan");
               console.error(e)
          }
          reset()
     }
     const reset = (overrides?: Partial<IScanPageState>) => {
          scanStartedRef.current = false;
          scanActiveRef.current = false; 
          startTimeRef.current = null;
          setState({
               ...GET_INITIAL_SCAN_STATE(type),
               scanType: "",
               ...overrides
          })
     }
     const {isFinished, threats, duration, scanType, currLocation, totalFiles, scannedFiles, logs} = scanState
     return (
          <AppLayout className={isFinished ? "flex justify-center items-center gap-4 flex-col p-4" : "grid gris-cols-1 md:grid-cols-2 gap-10 p-4"}>
               {isFinished ? (
                    <>
                         <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan Completed!</h1>
                         <ScanFinishResult
                              threatCount={threats}
                              durationElem={(
                                   <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit"><Timer className="text-primary"/>{formatDuration(duration)}</h2>
                              )}
                         />
                    </>
               ) : (
                    <>
                         <div className="space-y-4">
                              <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan</h1>
                              {scanType==="" ? (
                                   <ScanMenu handleStartScan={handleStartScan}/>
                              ) : (
                                   <ScanProcess
                                        scanType={scanType}
                                        onStop={handleStop}
                                        threatsCount={threats}
                                        currLocation={currLocation}
                                        filesCount={scannedFiles}
                                        totalFiles={totalFiles}
                                   />
                              )}
                         </div>
                         <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[800px]">
                              <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                              <pre className="whitespace-normal text-sm" ref={logRef}>{logs.map((val,i)=>(
                                   <code key={`log-${i+1} break-all`} className={cn(
                                        "inline-block w-full",
                                        val.includes("WARNING") && "text-amber-600",
                                        val.includes("OK") && "text-emerald-700",
                                        val.includes("FOUND") && "text-destructive"
                                   )}>{val}</code>
                              ))}</pre>
                         </div>
                    </>
               )}
          </AppLayout>
     )
}