import ScanFinishResult from "@/components/antivirus/scan/finish-scan";
import ScanMenu from "@/components/antivirus/scan/scan-menu";
import ScanProcess from "@/components/antivirus/scan/scan-process";
import { AppLayout } from "@/components/layout";
import { ScanType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function ScanPage(){
     const [params] = useSearchParams();
     const type = params.get("type") as ScanType | null;
     const [scanType, setScanType] = useState<ScanType>(type ?? "");
     const [logs, setLogs] = useState<string[]>([]);
     const isFinished = false;
     const handleStartScan = async (type: ScanType) => {
          setScanType(type);
     }
     useEffect(()=>{
          const unlisten = listen<string>("clamav-scan-log",e=>{
               setLogs(prev=>[...prev,e.payload]);
          })
          return () => {
               unlisten.then(f=>f());
          }
     },[]);
     const handleStop = () => {
          setScanType("");
          setLogs([]);
     }
     return (
          <AppLayout className={isFinished ? "flex justify-center items-center gap-4 flex-col p-4" : "grid gris-cols-1 md:grid-cols-2 gap-10 p-4"}>
               {isFinished ? (
                    <>
                         <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Scan Completed!</h1>
                         <ScanFinishResult threatCount={3}/>
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
                                   />
                              )}
                         </div>
                         <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[700px]">
                              <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                              <pre className="whitespace-pre-wrap text-sm">{logs.map((val,i)=>(
                                   <code key={`log-${i+1}`} className={cn(
                                        "inline-block w-full",
                                        val.includes("WARNING") && "text-amber-700",
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