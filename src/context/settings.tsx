import { DEFAULT_SETTINGS } from "@/lib/constants/settings";
import { getErrorMessage } from "@/lib/helpers";
import { ISettings } from "@/lib/types/settings";
import { format } from "date-fns";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface SettingsContextValue{
     settings: ISettings,
     setSettings: (overrides: Partial<ISettings>) => void
     formatDate: (date?: string) => string
}
const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }){
     const {t} = useTranslation("messages")
     const [settings, setSettings] = useState<ISettings>(()=>{
          const newDefaults: ISettings = {
               ...DEFAULT_SETTINGS,
               reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          }
          try {
               const raw = localStorage.getItem("clamav-settings")
               if (!raw) return newDefaults
               return { ...newDefaults, ...JSON.parse(raw) }
          } catch {
               return newDefaults
          }
     });
     const formatDate = useCallback((date?: string) => {
          try {
               if(!date || (typeof date==="string" && date.trim()==="")) return "Never"
               return format(date,settings.dateFormat)
          } catch (err) {
               toast.error(t("fetch-error.date"),{
                    description: getErrorMessage(err)
               })
               return "Invalid Date"
          }
     },[settings.dateFormat])
     const values: SettingsContextValue = useMemo(()=>({
          settings,
          setSettings: (overrides: Partial<ISettings>) => {
               const newValues: ISettings = {
                    ...settings,
                    ...overrides
               }; localStorage.setItem("clamav-settings",JSON.stringify(newValues))
               setSettings(newValues)
          },
          formatDate
     }),[settings])
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