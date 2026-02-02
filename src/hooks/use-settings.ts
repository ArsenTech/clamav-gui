import { store } from "@/lib/settings/store";
import { BackendSettings } from "@/lib/types/settings";
import { toast } from "sonner";

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