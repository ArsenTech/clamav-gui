import { DEFAULT_SETTINGS } from "@/lib/settings";
import { store } from "@/lib/settings/store";
import { BackendSettings, ISettings } from "@/lib/types/settings";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export function useSettings(){
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

export function useBackendSettings(){
     async function getBackendSettings<
          S extends keyof BackendSettings,
          K extends keyof BackendSettings[S]
     >(
          section: S,
          key: K
     ): Promise<BackendSettings[S][K] | undefined> {
          const data = await store.get<BackendSettings[S]>(section);
          return data?.[key];
     }
     async function fetchBackendSettings<S extends keyof BackendSettings>(section: S): Promise<BackendSettings[S] | undefined> {
          const data = await store.get<BackendSettings[S]>(section);
          return data;
     }
     async function setBackendSettings<
          S extends keyof BackendSettings,
          K extends keyof BackendSettings[S]
     >(
          section: S,
          key: K,
          value: BackendSettings[S][K]
     ) {
          try{
               const current = (await store.get<BackendSettings[S]>(section)) ?? {};
               await store.set(section, {
                    ...current,
                    [key]: value,
               });
          } catch(e){
               toast.error("Failed to save settings");
               console.error(e)
          }
     }
     return {
          getBackendSettings,
          setBackendSettings,
          fetchBackendSettings,
     }
}