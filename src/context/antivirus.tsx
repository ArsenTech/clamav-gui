import { GET_INITIAL_SCAN_STATE, INITIAL_FINISH_SCAN_STATE, INITIAL_HISTORY_STATE, INITIAL_QUARANTINE_STATE, INITIAL_SCHEDULER_STATE } from "@/lib/constants/states";
import { SetDataFunction, SetStateType } from "@/lib/types";
import { ScanType } from "@/lib/types/enums";
import { IFinishScanState, IHistoryPageState, IQuarantineState, IScanPageState, ISchedulerState } from "@/lib/types/states";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AntivirusContextValues {
     historyState: IHistoryPageState,
     setHistoryState: SetStateType<IHistoryPageState>,
     updateHistoryState: SetDataFunction<IHistoryPageState>

     finishScanState: IFinishScanState,
     setFinishScanState: SetStateType<IFinishScanState>,
     updateFinishScanState: SetDataFunction<IFinishScanState>

     schedulerState: ISchedulerState,
     setSchedulerState: SetStateType<ISchedulerState>,
     updateSchedulerState: SetDataFunction<ISchedulerState>

     quarantineState: IQuarantineState,
     updateQuarantineState: SetDataFunction<IQuarantineState>

     scanState: IScanPageState,
     setScanState: SetStateType<IScanPageState>
     updateScanState: SetDataFunction<IScanPageState>,
     initialScanState: IScanPageState
}

const AntivirusContext = createContext<AntivirusContextValues | null>(null)

interface AntivirusProviderProps{
     children: React.ReactNode,
     type?: ScanType | null,
     path?: string[] | null
}
export default function AntivirusProvider({children, type=null, path=null}: AntivirusProviderProps){
     const [historyState, setHistoryState] = useState<IHistoryPageState>(INITIAL_HISTORY_STATE)
     const updateHistoryState: SetDataFunction<IHistoryPageState> = overrides => setHistoryState(prev=>({ ...prev, ...overrides }))
     const [finishScanState, setFinishScanState] = useState<IFinishScanState>(INITIAL_FINISH_SCAN_STATE)
     const updateFinishScanState: SetDataFunction<IFinishScanState> = overrides => setFinishScanState(prev=>({ ...prev, ...overrides}));
     const [schedulerState, setSchedulerState] = useState<ISchedulerState>(INITIAL_SCHEDULER_STATE);
     const updateSchedulerState: SetDataFunction<ISchedulerState> = overrides => setSchedulerState(prev=>({ ...prev, ...overrides }))
     const [quarantineState, setQuarantineState] = useState<IQuarantineState>(INITIAL_QUARANTINE_STATE);
     const updateQuarantineState: SetDataFunction<IQuarantineState> = overrides => setQuarantineState(prev=>({ ...prev, ...overrides }))
     const initialScanState = GET_INITIAL_SCAN_STATE(type || ScanType.None,path)
     const [scanState, setScanState] = useState<IScanPageState>(initialScanState);
     const updateScanState: SetDataFunction<IScanPageState> = overrides => setScanState(prev=>({ ...prev, ...overrides }))

     useEffect(() => {
          setScanState(prev => {
               if (prev.status !== "idle") return prev;
               return {
                    ...prev,
                    scanType: !type ? prev.scanType : type,
                    paths: type==="main" || type==="full" ? [] : path ?? [],
                    status: "starting",
               };
          });
     }, [type, path?.join("|")]);

     const values: AntivirusContextValues = useMemo(()=>({
          historyState, setHistoryState, updateHistoryState,
          finishScanState, setFinishScanState, updateFinishScanState,
          schedulerState, setSchedulerState, updateSchedulerState,
          quarantineState, updateQuarantineState,
          scanState, setScanState, updateScanState, initialScanState
     }),[historyState, finishScanState, schedulerState, quarantineState, scanState])
     return (
          <AntivirusContext.Provider value={values}>
               {children}
          </AntivirusContext.Provider>
     )
}
export function useAntivirus(){
     const ctx = useContext(AntivirusContext);
     if (!ctx) {
          throw new Error("useAntivirus must be used inside AntivirusProvider");
     }
     return ctx;
}