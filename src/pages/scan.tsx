import { AppLayout } from "@/components/layout";
import { useParams } from "react-router";
import ScanFinishResult from "@/components/antivirus/finish-scan";
import LogText from "@/components/log";
import { GET_INITIAL_SCAN_STATE } from "@/lib/constants/states";
import { ScanType, ScanProfile } from "@/lib/types/enums";
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
import { hydrateProfile } from "@/lib/helpers/scan";
import { useBackendSettings } from "@/hooks/use-settings";
import { ScanProfileValues } from "@/lib/types/settings";
import { mapScanSettingsToArgs, validateScanSettings } from "@/lib/helpers/scan";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/lib/helpers";

const ScanProcess = lazy(()=>import("@/components/antivirus/scan-process"))

export default function ScanPage(){
     const {type} = useParams<{type: ScanType}>();
     const [searchParams] = useSearchParams();
     const path = searchParams.getAll("path");
     const [scanState, setScanState] = useState<IScanPageState>(GET_INITIAL_SCAN_STATE(type || ScanType.None,path));
     const setState = (overrides: Partial<IScanPageState>) => setScanState(prev=>({ ...prev, ...overrides }))
     const {isStartup} = useStartupScan();
     const {settings} = useSettings();
     const startTimeRef = useRef<number | null>(null);
     const isDone = scanState.status === "finished" || scanState.status === "error"
     const {getSettingsBySection} = useBackendSettings();
     const hasStartedRef = useRef(false);
     const {t: messageTxt} = useTranslation("messages")
     const handleStartScan = async() => {
          setScanState(prev => ({
               ...prev,
               duration: 0,
               exitCode: 0,
               errMsg: undefined,
          }));
          try{
               let scanOptions: ScanProfileValues | null = null;
               const isMainOrFull = scanState.scanType==="main" || scanState.scanType === "full";
               const scanCommand = `start_${isMainOrFull ? scanState.scanType : "custom"}_scan`;
               const scanProfile: ScanProfile | null =
                    scanState.scanType==="main" ? ScanProfile.Main :
                    scanState.scanType==="custom" ? ScanProfile.Custom :
                    scanState.scanType==="file" ? ScanProfile.File : null;
               if(scanProfile){
                    const availableOptions = await getSettingsBySection("scanProfiles",scanProfile);
                    if(availableOptions) scanOptions = hydrateProfile(availableOptions,scanProfile==="file");
               }
               const payload = !isMainOrFull ? {
                    paths: Array.isArray(scanState.paths)
                         ? scanState.paths
                         : [scanState.paths],
               } : undefined;
               await invoke(scanCommand,{
                    ...payload,
                    args: scanOptions ? mapScanSettingsToArgs(validateScanSettings(scanOptions)): null
               })
          } catch (e){
               toast.error(messageTxt("scan-start-error"));
               setScanState(prev=>{
                    if (!["starting", "running", "reconnecting"].includes(prev.status)) return prev;
                    return {
                         ...prev,
                         status: "error",
                         errMsg: getErrorMessage(e),
                         duration: startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current)/1000) : 0,
                         exitCode: -1
                    }
               })
               startTimeRef.current = null;
          }
     }
     useEffect(() => {
          setScanState(prev => {
               if (prev.status !== "idle") return prev;
               return {
                    ...prev,
                    scanType: !type ? prev.scanType : type,
                    paths: type==="main" || type==="full" ? [] : path,
                    status: "starting",
               };
          });
     }, [type, path.join("|")]);
     useEffect(()=>{
          const unsubs: Promise<UnlistenFn>[] = [
               listen<string>("clamscan:log",e=>{
                    setScanState(prev => {
                         if (!["starting", "running", "reconnecting"].includes(prev.status)) return prev;
                         let next = { ...prev };
                         next.logs = [...prev.logs.slice(-settings.maxLogLines), e.payload]
                         if(e.payload.endsWith("FOUND")) {
                              const infectedFile = e.payload.split(" ");
                              const filePath = infectedFile[0];
                              next.threats = [
                                   ...prev.threats,
                                   {
                                        id: String(prev.threats.length+1),
                                        displayName: infectedFile[1],
                                        filePath: filePath.slice(0,filePath.length-1),
                                        status: "detected",
                                        detectedAt: new Date()
                                   }
                              ]
                         }
                         if (e.payload.includes(": OK") || e.payload.includes(" FOUND")) {
                              const idx = e.payload.lastIndexOf(": ");
                              next.currLocation = idx !== -1 ? e.payload.slice(0, idx) : prev.currLocation;
                              next.scannedFiles = prev.scannedFiles+1
                         }
                         next.status = prev.status === "starting" ? "running" : prev.status;
                         return next;
                    });
               }),
               listen<number>("clamscan:finished",(e)=>{
                    setScanState(prev=>{
                         if (!["starting", "running", "reconnecting"].includes(prev.status)) return prev;
                         return {
                              ...prev,
                              status: "finished",
                              duration: startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current)/1000) : 0,
                              exitCode: e.payload,
                              errMsg: undefined
                         }
                    })
                    startTimeRef.current = null;
                    localStorage.setItem("last-scanned",Date.now().toString())
               }),
               listen<number>("clamscan:total", e => setState({ totalFiles: e.payload })),
               listen<string>("clamscan:error", e => {
                    if (e.payload === "SCAN_ALREADY_RUNNING") {
                         setScanState(prev => {
                              if (!["starting", "running", "reconnecting"].includes(prev.status)) return prev;
                              return {
                                   ...prev,
                                   status: "reconnecting",
                                   isReconnected: true,
                              };
                         });
                         return;
                    }
                    setScanState(prev=>{
                         if (!["starting", "running", "reconnecting"].includes(prev.status)) return prev;
                         return {
                              ...prev,
                              status: "error",
                              errMsg: e.payload,
                              duration: startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current)/1000) : 0,
                              exitCode: -1
                         }
                    })
                    startTimeRef.current = null;
               })
          ];
          return () => {
               Promise.all(unsubs).then(fns=>fns.forEach(fn=>fn()));
          }
     },[settings.maxLogLines]);
     const {t} = useTranslation("scan")
     useEffect(()=>{
          if(!isDone) return;
          if(settings.notifOnScanFinish){
               sendNotification({
                    title: t("notification.scan-finish.title"),
                    body: !scanState.errMsg ? t("notification.scan-finish.desc",{count: scanState.threats.length}) : t("notification.scan-finish.with-err")
               })
          }
     },[isDone, settings.notifOnScanFinish, scanState.errMsg, scanState.threats, t])
     useEffect(() => {
          const checkRunning = async () => {
               try {
                    const isRunning = await invoke<boolean>("get_scan_status")
                    if (isRunning) {
                         setScanState(prev => ({
                              ...prev,
                              status: "reconnecting",
                              isReconnected: true,
                         }));
                    }
               } catch {
                    toast.warning(messageTxt("scan-status-error"))
               }
          };
          checkRunning();
     }, []);
     useEffect(() => {
          if(scanState.scanType===null || scanState.scanType===undefined) return;
          if (scanState.status !== "starting") return;
          
          if (hasStartedRef.current) return;
          hasStartedRef.current = true;
          
          if (settings.notifOnScanStart) {
               sendNotification({
                    title: t("notification.scan-start.title"),
                    body: t("notification.scan-start.desc", {
                         scanName: scanState.scanType ? t(`scan-type.${scanState.scanType}.name`) : t("scan-type.fallback"),
                    }),
               });
          }

          setScanState(prev => {
               if (prev.status !== "starting") return prev;
               return { ...prev, status: "running" };
          });

          startTimeRef.current = Date.now();

          handleStartScan();
     }, [scanState.scanType, scanState.status]);
     const reset = (overrides?: Partial<IScanPageState>) => {
          startTimeRef.current = null;
          hasStartedRef.current = false;
          setState({
               ...GET_INITIAL_SCAN_STATE(type || ScanType.None, path),
               scanType: ScanType.None,
               exitCode: 0,
               status: "idle",
               ...overrides,
          });
     }
     const {logs, scanType} = scanState;
     const {t: logTxt} = useTranslation()
     return (
          <AppLayout className={isDone ? "flex justify-center items-center gap-4 flex-col p-4" : "grid gris-cols-1 md:grid-cols-2 gap-10 p-4"}>
               {isDone ? (
                    <>
                         <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{t("scan-complete")}</h1>
                         <ScanFinishResult
                              isStartup={isStartup}
                              setScanState={setScanState}
                              scanState={scanState}
                         />
                    </>
               ) : (
                    <>
                         <div className="space-y-4">
                              <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{t("title")}</h1>
                              <Suspense fallback={<ScanLoader type={scanType}/>}>
                                   <ScanProcess
                                        handleReset={reset}
                                        isStartup={isStartup}
                                        scanState={scanState}
                                   />
                              </Suspense>
                         </div>
                         <ScrollArea className="max-h-[800px]">
                              <div className="space-y-3 px-3 text-lg">
                                   <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">{logTxt("log.title")}</h2>
                                   <LogText logs={logs}/>
                              </div>
                         </ScrollArea>
                    </>
               )}
          </AppLayout>
     )
}