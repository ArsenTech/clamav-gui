import { DEFAULT_SETTINGS } from "@/lib/settings";
import { ISettings } from "@/lib/types/settings";
import { format } from "date-fns";
import { useState } from "react";

export default function useSettings(){
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
     return {
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
}