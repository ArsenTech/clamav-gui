import { fetchHistoryData } from "@/data/history";
import { INITIAL_HISTORY_STATE } from "@/lib/constants/states";
import { SetDataFunction, SetStateType } from "@/lib/types";
import { IHistoryPageState } from "@/lib/types/states";
import { createContext, useCallback, useContext, useMemo, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

interface AppHistoryContextValues {
     historyState: IHistoryPageState,
     setHistoryState: SetStateType<IHistoryPageState>,
     updateHistoryState: SetDataFunction<IHistoryPageState>
     isEmpty: boolean,
     isRefreshing: boolean,
     fetchData: () => void;
}

const AppHistoryContext = createContext<AppHistoryContextValues | null>(null)

interface AppHistoryProviderProps{
     children: React.ReactNode,
}
export default function AppHistoryProvider({children}: AppHistoryProviderProps){
     const [isRefreshing, startTransition] = useTransition();
     const [historyState, setHistoryState] = useState<IHistoryPageState>(INITIAL_HISTORY_STATE);
     const updateHistoryState: SetDataFunction<IHistoryPageState> = useCallback(overrides => setHistoryState(prev=>({ ...prev, ...overrides })),[])
     const isEmpty = useMemo(()=>historyState.data.length<=0,[historyState.data]);

     const {t} = useTranslation("history")
     const {t: messageTxt} = useTranslation("messages")
     const fetchData = useCallback(()=>{
          startTransition(async()=>{
               const newData = await fetchHistoryData(t,messageTxt)
               updateHistoryState({ data: newData })
          })
     },[t,messageTxt])

     const values: AppHistoryContextValues = useMemo(()=>({
          historyState, setHistoryState, updateHistoryState, isEmpty, isRefreshing, fetchData
     }),[historyState, isEmpty, isRefreshing, fetchData])
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