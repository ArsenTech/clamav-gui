import { INITIAL_QUARANTINE_STATE } from "@/lib/constants/states";
import { SetDataFunction } from "@/lib/types";
import { IQuarantineState } from "@/lib/types/states";
import { createContext, useContext, useMemo, useState } from "react";

interface QuarantineContextValues {
     quarantineState: IQuarantineState,
     updateQuarantineState: SetDataFunction<IQuarantineState>
}

const QuarantineContext = createContext<QuarantineContextValues | null>(null)

interface QuarantineProviderProps{
     children: React.ReactNode,
}
export default function QuarantineProvider({children}: QuarantineProviderProps){
     const [quarantineState, setQuarantineState] = useState<IQuarantineState>(INITIAL_QUARANTINE_STATE);
     const updateQuarantineState: SetDataFunction<IQuarantineState> = overrides => setQuarantineState(prev=>({ ...prev, ...overrides }))
     const values: QuarantineContextValues = useMemo(()=>({
          quarantineState, updateQuarantineState,
     }),[quarantineState])
     return (
          <QuarantineContext.Provider value={values}>
               {children}
          </QuarantineContext.Provider>
     )
}
export function useQuarantine(){
     const ctx = useContext(QuarantineContext);
     if (!ctx) {
          throw new Error("useQuarantine must be used inside QuarantineProvider");
     }
     return ctx;
}