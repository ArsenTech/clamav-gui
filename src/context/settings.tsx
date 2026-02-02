import { DEFAULT_SETTINGS } from "@/lib/settings";
import { ISettings } from "@/lib/types/settings";
import { format } from "date-fns";
import { createContext, useContext, useState } from "react";

interface SettingsContextValue{
     settings: ISettings,
     setSettings: (overrides: Partial<ISettings>) => void
     formatDate: (date?: Date) => string
}
const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }){
     const [settings, setSettings] = useState<ISettings>(()=>{
          try {
               const raw = localStorage.getItem("clamav-settings")
               if (!raw) return DEFAULT_SETTINGS
               return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
          } catch {
               return DEFAULT_SETTINGS
          }
     });
     const formatDate = (date?: Date) => {
          if(!date) return "Never"
          return format(date,settings.dateFormat)
     }
     const values: SettingsContextValue = {
          settings,
          setSettings: (overrides: Partial<ISettings>) => {
               const newValues: ISettings = {
                    ...settings,
                    ...overrides
               };
               localStorage.setItem("clamav-settings",JSON.stringify(newValues))
               setSettings(newValues)
          },
          formatDate
     }
     return (
          <SettingsContext.Provider value={values}>
               {children}
          </SettingsContext.Provider>
     )
}

export function useSettings() {
     const ctx = useContext(SettingsContext);
     if (!ctx) {
          throw new Error("useSettings must be used inside SettingsProvider");
     }
     return ctx;
}