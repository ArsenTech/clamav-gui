import { GET_INITIAL_SCAN_STATE, INITIAL_FINISH_SCAN_STATE } from "@/lib/constants/states";
import { SetDataFunction, SetStateType } from "@/lib/types";
import { ScanType } from "@/lib/types/enums";
import { IFinishScanState, IScanPageState } from "@/lib/types/states";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface ScanContextValues {
     finishScanState: IFinishScanState,
     setFinishScanState: SetStateType<IFinishScanState>,
     updateFinishScanState: SetDataFunction<IFinishScanState>
     scanState: IScanPageState,
     setScanState: SetStateType<IScanPageState>
     updateScanState: SetDataFunction<IScanPageState>,
     initialScanState: IScanPageState
}

const ScanContext = createContext<ScanContextValues | null>(null)

interface ScanProviderProps{
     children: React.ReactNode,
     type?: ScanType | null,
     path: string[]
}
export default function ScanProvider({children, type=null, path}: ScanProviderProps){
     const [finishScanState, setFinishScanState] = useState<IFinishScanState>(INITIAL_FINISH_SCAN_STATE)
     const updateFinishScanState: SetDataFunction<IFinishScanState> = useCallback(overrides => setFinishScanState(prev=>({ ...prev, ...overrides})),[]);
     const initialScanState = GET_INITIAL_SCAN_STATE(type || ScanType.None,path)
     const [scanState, setScanState] = useState<IScanPageState>(initialScanState);
     const updateScanState: SetDataFunction<IScanPageState> = useCallback(overrides => setScanState(prev=>({ ...prev, ...overrides })),[])
     
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
     }, [type, path?.join("|")]);

     const values: ScanContextValues = useMemo(()=>({
          finishScanState, setFinishScanState, updateFinishScanState,
          scanState, setScanState, updateScanState, initialScanState
     }),[finishScanState, scanState])
     return (
          <ScanContext.Provider value={values}>
               {children}
          </ScanContext.Provider>
     )
}
export function useScan(){
     const ctx = useContext(ScanContext);
     if (!ctx) {
          throw new Error("useScan must be used inside ScanProvider");
     }
     return ctx;
}