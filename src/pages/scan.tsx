import ScanFinishResult from "@/components/antivirus/scan/finish-scan";
import ScanMenu from "@/components/antivirus/scan/scan-menu";
import ScanProcess from "@/components/antivirus/scan/scan-process";
import { AppLayout } from "@/components/layout";
import { ScanType } from "@/lib/types";
import { useState } from "react";
import { useSearchParams } from "react-router";

export default function ScanPage(){
     const [params] = useSearchParams();
     const type = params.get("type") as ScanType | null;
     const [scanType, setScanType] = useState<ScanType>(type ?? "");
     const isFinished = false;
     const handleStartScan = (type: ScanType) => {
          setScanType(type)
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
                                        onStop={()=>setScanType("")}
                                   />
                              )}
                         </div>
                         <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[700px]">
                              <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                              <pre className="whitespace-pre-wrap">
                                   asdasdadasdadsasd

                                   asdfasfasfasfasfasfasf
                                   asdasdadasdadsasd


                                   asdfasfasfasfasfasfasf
                                   asdasdadasdadsasd
                              </pre>
                         </div>
                    </>
               )}
          </AppLayout>
     )
}