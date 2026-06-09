import { INITIAL_HISTORY_STATE } from "@/lib/constants/states";
import { SetDataFunction, SetStateType } from "@/lib/types";
import { IHistoryPageState } from "@/lib/types/states";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface AppHistoryContextValues {
     historyState: IHistoryPageState,
     setHistoryState: SetStateType<IHistoryPageState>,
     updateHistoryState: SetDataFunction<IHistoryPageState>
}

const AppHistoryContext = createContext<AppHistoryContextValues | null>(null)

interface AppHistoryProviderProps{
     children: React.ReactNode,
}
export default function AppHistoryProvider({children}: AppHistoryProviderProps){
     const [historyState, setHistoryState] = useState<IHistoryPageState>(INITIAL_HISTORY_STATE)
     const updateHistoryState: SetDataFunction<IHistoryPageState> = useCallback(overrides => setHistoryState(prev=>({ ...prev, ...overrides })),[])
     const values: AppHistoryContextValues = useMemo(()=>({
          historyState, setHistoryState, updateHistoryState
     }),[historyState])
     return (
          <AppHistoryContext.Provider value={values}>
               {children}
          </AppHistoryContext.Provider>
     )
}
export function useAppHistory(){
     const ctx = useContext(AppHistoryContext);
     if (!ctx) {
          throw new Error("useAppHistory must be used inside AppHistoryProvider");
     }
     return ctx;
}