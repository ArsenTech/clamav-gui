import { store } from "@/lib/store";
import { BackendSettings } from "@/lib/types/settings";
import { toast } from "sonner";

export function useBackendSettings(){
     async function getSettingsBySection<
          S extends keyof BackendSettings,
          K extends keyof BackendSettings[S]
     >(
          section: S,
          key: K
     ): Promise<BackendSettings[S][K] | undefined> {
          const data = await store.get<BackendSettings[S]>(section);
          return data?.[key];
     }
     async function fetchSettingsbySection<S extends keyof BackendSettings>(section: S): Promise<BackendSettings[S] | undefined> {
          const data = await store.get<BackendSettings[S]>(section);
          return data;
     }
     async function setSettingsbySection<
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
     async function getSettingsByKey<K extends keyof BackendSettings>(key: K): Promise<BackendSettings[K] | undefined> {
          const data = await store.get<BackendSettings[K]>(key);
          return data;
     }
     async function setSettingsbyKey<K extends keyof BackendSettings>(key: K,value: BackendSettings[K]) {
          try{
               const current = await store.get<BackendSettings[K]>(key)
               await store.set(key,!value ? current : value);
          } catch(e){
               toast.error("Failed to save settings");
               console.error(e)
          }
     }
     return {
          getSettingsBySection,
          getSettingsByKey,
          setSettingsbySection,
          setSettingsbyKey,
          fetchSettingsbySection
     }
}