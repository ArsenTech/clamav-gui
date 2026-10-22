import { INITIAL_SCHEDULER_STATE } from "@/lib/constants/states";
import { SetDataFunction, SetStateType } from "@/lib/types";
import { ISchedulerState } from "@/lib/types/states";
import { createContext, TransitionStartFunction, useCallback, useContext, useMemo, useState, useTransition } from "react";
import { useSettings } from "../settings";
import { fetchSchedulerData } from "@/data/scheduler";
import { useTranslation } from "react-i18next";

interface SchedulerContextValues {
     schedulerState: ISchedulerState,
     setSchedulerState: SetStateType<ISchedulerState>,
     updateSchedulerState: SetDataFunction<ISchedulerState>,
     isPending: boolean,
     refresh: () => void,
     startTransition: TransitionStartFunction
}

const SchedulerContext = createContext<SchedulerContextValues | null>(null)

interface SchedulerProviderProps{
     children: React.ReactNode,
}
export default function SchedulerProvider({children}: SchedulerProviderProps){
     const [schedulerState, setSchedulerState] = useState<ISchedulerState>(INITIAL_SCHEDULER_STATE);
     const [isPending, startTransition] = useTransition();
     const {settings} = useSettings();
     const {t: messageTxt} = useTranslation("messages")
     const {t: backendTxt} = useTranslation("backend-errors")
     const refresh = useCallback(() => {
          if(!settings.enableSchedulerUI) return;
          startTransition(async()=>{
               const newData = await fetchSchedulerData(messageTxt,backendTxt);
               updateSchedulerState({data: newData})
          })
     },[settings.enableSchedulerUI,messageTxt])
     const updateSchedulerState: SetDataFunction<ISchedulerState> = useCallback(overrides => setSchedulerState(prev=>({ ...prev, ...overrides })),[])
     const values: SchedulerContextValues = useMemo(()=>({
          schedulerState, setSchedulerState, updateSchedulerState, isPending, refresh, startTransition
     }),[schedulerState, isPending, refresh])
     return (
          <SchedulerContext.Provider value={values}>
               {children}
          </SchedulerContext.Provider>
     )
}
export function useScheduler(){
     const ctx = useContext(SchedulerContext);
     if (!ctx) {
          throw new Error("useScheduler must be used inside SchedulerProvider");
     }
     return ctx;
}