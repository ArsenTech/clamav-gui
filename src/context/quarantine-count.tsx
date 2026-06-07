import { createContext, useContext, useMemo, useState } from "react";

interface QuarantineCountContextValue{
     quarantineCount: number
     increaseBy: (newCount: number) => void
     decreaseBy: (newCount: number) => void
     setCount: (newCount: number) => void
}
const QuarantineCountContext = createContext<QuarantineCountContextValue | null>(null)

export function QuarantineCountProvider({ children }: { children: React.ReactNode }){
     const [count, setCount] = useState(()=>parseInt(localStorage.getItem("quarantine-count") as string) || 0)
     const values: QuarantineCountContextValue = useMemo(()=>({
          quarantineCount: count,
          increaseBy: (newCount = 0) => {
               const newValue = count+newCount;
               localStorage.setItem("quarantine-count",String(newValue));
               setCount(newValue)
          },
          decreaseBy: (newCount = 0) => {
               const newValue = count-newCount;
               localStorage.setItem("quarantine-count",String(newValue));
               setCount(newValue)
          },
          setCount: (newCount = 0) => {
               localStorage.setItem("quarantine-count",String(newCount));
               setCount(newCount)
          },
     }),[count])
     return (
          <QuarantineCountContext.Provider value={values}>
               {children}
          </QuarantineCountContext.Provider>
     )
}

export function useQuarantineCount() {
     const ctx = useContext(QuarantineCountContext);
     if (!ctx) {
          throw new Error("useQuarantineCount must be used inside QuarantineCountProvider");
     }
     return ctx;
}