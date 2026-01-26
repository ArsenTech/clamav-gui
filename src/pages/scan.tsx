import { AppLayout } from "@/components/layout";
import { useNavigate, useParams } from "react-router";
import ScanFinishResult from "@/components/antivirus/finish-scan";
import LogText from "@/components/log";
import { GET_INITIAL_SCAN_STATE } from "@/lib/constants/states";
import { formatDuration } from "@/lib/helpers";
import { ScanType } from "@/lib/types";
import { IScanPageState } from "@/lib/types/states";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import ScanProcess from "@/components/antivirus/scan-process";
import { useStartupScan } from "@/context/startup-scan";
import { exit } from "@tauri-apps/plugin-process";

export default function ScanPage(){
     const [searchParams] = useSearchParams();
     const navigate = useNavigate();
     const {type} = useParams<{type: ScanType}>();
     const path = searchParams.getAll("path");
     const [scanState, setScanState] = useState<IScanPageState>(GET_INITIAL_SCAN_STATE(type || "",path));
     const setState = (overrides: Partial<IScanPageState>) => setScanState(prev=>({ ...prev, ...overrides }))
     const startTimeRef = useRef<number | null>(null);
     const scanActiveRef = useRef(false);
     const scanStartedRef = useRef(false);
     const scanStoppedRef = useRef(false);
     useEffect(() => {
          setState({
               scanType: type,
               paths: type==="main" || type==="full" ? [] : path
          });
          scanStoppedRef.current = false;
     }, [type]);
     useEffect(()=>{
          const unsubs: Promise<UnlistenFn>[] = [
               listen<string>("clamscan:log",e=>{
                    if (!scanActiveRef.current) return;
                    setScanState(prev=>({
                         ...prev,
                         logs: [...prev.logs.slice(-500), e.payload],
                    }))
                    if(e.payload.endsWith("FOUND")){
                         const infectedFile = e.payload.split(" ");
                         const filePath = infectedFile[0];
                         setScanState(prev=>({
                              ...prev,
                              threats: [
                                   ...prev.threats,
                                   {
                                        id: String(prev.threats.length+1),
                                        displayName: infectedFile[1],
                                        filePath: filePath.slice(0,filePath.length-1),
                                        status: "detected",
                                        detectedAt: new Date().toLocaleString()
                                   }
                              ]
                         }))
                    }
                    if (e.payload.includes(": OK") || e.payload.includes(" FOUND")) {
                         const idx = e.payload.lastIndexOf(": ");
                         setScanState(prev=>({
                              ...prev,
                              currLocation: idx !== -1 ? e.payload.slice(0, idx) : prev.currLocation,
                              scannedFiles: prev.scannedFiles+1
                         }))
                    }
               }),
               listen<number>("clamscan:finished",(e)=>{
                    if (!scanActiveRef.current) return;
                    scanStartedRef.current = false;
                    scanActiveRef.current = false;
                    setState({
                         isFinished: true,
                         duration: startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current)/1000) : 0,
                         exitCode: e.payload,
                         errMsg: undefined
                    });
                    startTimeRef.current = null;
               }),
               listen<number>("clamscan:total", e =>setState({ totalFiles: e.payload })),
               listen<string>("clamscan:error", e => {
                    if (!scanActiveRef.current) return;
                    scanStartedRef.current = false;
                    scanActiveRef.current = false;
                    setState({
                         isFinished: true,
                         errMsg: e.payload,
                         duration: startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current)/1000) : 0,
                         exitCode: -1
                    })
                    startTimeRef.current = null;
               })
          ];
          return () => {
               Promise.all(unsubs).then(fns=>fns.forEach(fn=>fn()));
          }
     },[]);
     const {isStartup} = useStartupScan();
     useEffect(() => {
          if (scanStoppedRef.current) return;
          if (!scanState.scanType) return;
          if (scanStartedRef.current) return;
          if (isStartup && scanActiveRef.current) return;
          scanStartedRef.current = true;
          scanActiveRef.current = true;
          startTimeRef.current = Date.now();
          if (scanState.scanType === "main" || scanState.scanType === "full") {
               invoke(`start_${scanState.scanType}_scan`).catch(() => {
                    toast.error("Scan command not found");
               });
          } else {
               invoke("start_custom_scan", {
                    paths: Array.isArray(scanState.paths)
                    ? scanState.paths
                    : [scanState.paths],
               });
          }
          setState({ duration: 0, exitCode: 0, errMsg: undefined });
     }, [scanState.scanType, scanState.paths, isStartup]);
     const handleStop = async() => {
          scanStoppedRef.current = true;
          reset();
          try {
               await invoke("stop_scan");
               if (isStartup){
                    await exit(0);
               } else {
                    navigate("/scan");
               }
          } catch (e){
               toast.error("Failed to stop the scan");
               console.error(e)
          }
     }
     const reset = (overrides?: Partial<IScanPageState>) => {
          scanStartedRef.current = false;
          scanActiveRef.current = false; 
          startTimeRef.current = null;
          setState({
               ...GET_INITIAL_SCAN_STATE(type || "",path),
               scanType: "",
               exitCode: 0,
               ...overrides
          })
     }
     const {isFinished, duration, scanType, currLocation, totalFiles, scannedFiles, logs, paths: scanLocations, threats} = scanState;
     return (
          <AppLayout className={isFinished ? "flex justify-center items-center gap-4 flex-col p-4" : "grid gris-cols-1 md:grid-cols-2 gap-10 p-4"}>
               {isFinished ? (
                    <>
                         <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan Completed!</h1>
                         <ScanFinishResult
                              durationElem={(
                                   <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit"><Timer className="text-primary"/>{formatDuration(duration)}</h2>
                              )}
                              isStartup={isStartup}
                              setScanState={setScanState}
                              scanState={scanState}
                         />
                    </>
               ) : (
                    <>
                         <div className="space-y-4">
                              <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan</h1>
                              <ScanProcess
                                   scanType={scanType}
                                   onStop={handleStop}
                                   threatsCount={threats.length}
                                   currLocation={currLocation}
                                   filesCount={scannedFiles}
                                   totalFiles={totalFiles}
                                   scanPaths={scanLocations}
                              />
                         </div>
                         <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[800px]">
                              <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                              <LogText logs={logs}/>
                         </div>
                    </>
               )}
          </AppLayout>
     )
}