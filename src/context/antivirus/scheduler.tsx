import { INITIAL_SCHEDULER_STATE } from "@/lib/constants/states";
import { SetDataFunction, SetStateType } from "@/lib/types";
import { ISchedulerState } from "@/lib/types/states";
import { createContext, useContext, useMemo, useState } from "react";

interface SchedulerContextValues {
     schedulerState: ISchedulerState,
     setSchedulerState: SetStateType<ISchedulerState>,
     updateSchedulerState: SetDataFunction<ISchedulerState>
}

const SchedulerContext = createContext<SchedulerContextValues | null>(null)

interface SchedulerProviderProps{
     children: React.ReactNode,
}
export default function SchedulerProvider({children}: SchedulerProviderProps){
     const [schedulerState, setSchedulerState] = useState<ISchedulerState>(INITIAL_SCHEDULER_STATE);
     const updateSchedulerState: SetDataFunction<ISchedulerState> = overrides => setSchedulerState(prev=>({ ...prev, ...overrides }))

     const values: SchedulerContextValues = useMemo(()=>({
          schedulerState, setSchedulerState, updateSchedulerState,
     }),[schedulerState])
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