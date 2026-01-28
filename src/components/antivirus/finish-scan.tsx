import { useNavigate } from "react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { exit } from "@tauri-apps/plugin-process";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { INITIAL_FINISH_SCAN_STATE } from "@/lib/constants/states";
import ScanFinishedLoader from "@/loaders/scan/scan-finish/no-threats";
import ScanFinishedTableLoader from "@/loaders/scan/scan-finish/with-threats";

const ScanFinishedContent = lazy(()=>import("@/contents/scan-finish/no-threats"))
const ScanFinishedTable = lazy(()=>import("@/contents/scan-finish/with-threats"))

interface Props{
     setScanState: React.Dispatch<React.SetStateAction<IScanPageState>>,
     scanState: IScanPageState
     isStartup: boolean,
}
export default function ScanFinishResult({setScanState, isStartup, scanState}: Props){
     const navigate = useNavigate();
     const [finishScanState, setFinishScanState] = useState<IFinishScanState>(INITIAL_FINISH_SCAN_STATE)
     const setState = (overrides: Partial<IFinishScanState>) => setFinishScanState(prev=>({ ...prev, ...overrides}));
     const handlePrimaryAction = async () => {
          if (isStartup) {
               await exit(0);
          } else {
               navigate("/");
          }
     };
     const {errMsg, threats} = scanState;
     const hasErrors = useMemo(()=>!!errMsg && errMsg.trim()!=="",[errMsg])
     return (hasErrors || threats.length<=0) ? (
          <Suspense fallback={<ScanFinishedLoader isStartup={isStartup} hasErr={hasErrors}/>}>
               <ScanFinishedContent
                    isStartup={isStartup}
                    scanState={scanState}
                    handlePrimaryAction={handlePrimaryAction}
               />
          </Suspense>
     )  : (
          <Suspense fallback={<ScanFinishedTableLoader rows={threats.slice(0,10).length}/>}>
               <ScanFinishedTable
                    setScanState={setScanState}
                    setState={setState}
                    scanState={scanState}
                    finishScanState={finishScanState}
                    isStartup={isStartup}
                    handlePrimaryAction={handlePrimaryAction}
               />
          </Suspense>
     )
}