import { AppLayout } from "@/components/layout";
import { useParams } from "react-router";
import ScanFinishResult from "@/components/antivirus/finish-scan";
import LogText from "@/components/log";
import { GET_INITIAL_SCAN_STATE } from "@/lib/constants/states";
import { ScanType } from "@/lib/types";
import { IScanPageState } from "@/lib/types/states";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useStartupScan } from "@/context/startup-scan";
import ScanLoader from "@/loaders/scan/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/context/settings";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { capitalizeText } from "@/lib/helpers";

const ScanProcess = lazy(()=>import("@/components/antivirus/scan-process"))
export default function ScanPage(){
     const {type} = useParams<{type: ScanType}>();
     const [searchParams] = useSearchParams();
     const path = searchParams.getAll("path");
     const [scanState, setScanState] = useState<IScanPageState>(GET_INITIAL_SCAN_STATE(type || "",path));
     const setState = (overrides: Partial<IScanPageState>) => setScanState(prev=>({ ...prev, ...overrides }))
     const {isStartup} = useStartupScan();
     const {settings} = useSettings();
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
                         logs: [...prev.logs.slice(-settings.maxLogLines), e.payload],
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
                                        detectedAt: new Date()
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
                    localStorage.setItem("last-scanned",Date.now().toString())
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
     useEffect(()=>{
          if(!scanState.isFinished) return;
          if(settings.notifOnScanFinish){
               sendNotification({
                    title: "Scan Finished",
                    body: !scanState.errMsg ? `${scanState.threats.length<=0 ? "No": scanState.threats.length} threat${scanState.threats.length===1 ? "" : "s"} were found.` : "Scan Finished with Errors"
               })
          }
     },[scanState.isFinished,settings.notifOnScanFinish,scanState.errMsg,scanState.threats])
     useEffect(() => {
          if (scanStoppedRef.current) return;
          if (!scanState.scanType) return;
          if (scanStartedRef.current) return;
          if (isStartup && scanActiveRef.current) return;
          scanStartedRef.current = true;
          scanActiveRef.current = true;
          startTimeRef.current = Date.now();
          const isMainOrFull = scanState.scanType==="main" || scanState.scanType === "full";
          const scanCommand = `start_${isMainOrFull ? scanState.scanType : "custom"}_scan`;
          const payload = !isMainOrFull ? {
               paths: Array.isArray(scanState.paths)
               ? scanState.paths
               : [scanState.paths],
          } : undefined
          invoke(scanCommand,payload).catch(() => {
               toast.error("Scan command not found");
          })
          setState({ duration: 0, exitCode: 0, errMsg: undefined });
          if(settings.notifOnScanStart){
               sendNotification({
                    title: "Scan Started!",
                    body: `The ${capitalizeText(scanType)} Scan has been started`
               });
          }
     }, [scanState.scanType, scanState.paths, isStartup]);
     const reset = (overrides?: Partial<IScanPageState>) => {
          scanStartedRef.current = false;
          scanActiveRef.current = false; 
          startTimeRef.current = null;
          setState({
               ...GET_INITIAL_SCAN_STATE(type || "",path),
               scanType: "", exitCode: 0,
               ...overrides
          })
     }
     const {isFinished, logs, scanType} = scanState;
     return (
          <AppLayout className={isFinished ? "flex justify-center items-center gap-4 flex-col p-4" : "grid gris-cols-1 md:grid-cols-2 gap-10 p-4"}>
               {isFinished ? (
                    <>
                         <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan Completed!</h1>
                         <ScanFinishResult
                              isStartup={isStartup}
                              setScanState={setScanState}
                              scanState={scanState}
                         />
                    </>
               ) : (
                    <>
                         <div className="space-y-4">
                              <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan</h1>
                              <Suspense fallback={<ScanLoader type={scanType}/>}>
                                   <ScanProcess
                                        handleReset={()=>{
                                             scanStoppedRef.current = true;
                                             reset();
                                        }}
                                        isStartup={isStartup}
                                        scanState={scanState}
                                   />
                              </Suspense>
                         </div>
                         <ScrollArea className="max-h-[800px]">
                              <div className="space-y-3 px-3 text-lg">
                                   <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                                   <LogText logs={logs}/>
                              </div>
                         </ScrollArea>
                    </>
               )}
          </AppLayout>
     )
}