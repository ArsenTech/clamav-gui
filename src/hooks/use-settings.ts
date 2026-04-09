import { getErrorMessage } from "@/lib/helpers";
import { fetchPaths } from "@/lib/helpers/fs";
import { store } from "@/lib/store";
import { IBackendSettings } from "@/lib/types/settings";
import { cache, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useBackendSettings(){
     const {t: messageTxt} = useTranslation("messages")
     const getSettingsBySection = cache(async<
          S extends keyof IBackendSettings,
          K extends keyof IBackendSettings[S]
     >(
          section: S,
          key: K
     ): Promise<IBackendSettings[S][K] | undefined> => {
          const data = await store.get<IBackendSettings[S]>(section);
          return data?.[key];
     })
     const fetchSettingsbySection = cache(async<S extends keyof IBackendSettings>(section: S): Promise<IBackendSettings[S] | undefined> => {
          const data = await store.get<IBackendSettings[S]>(section);
          return data;
     })
     async function setSettingsbySection<
          S extends keyof IBackendSettings,
          K extends keyof IBackendSettings[S]
     >(
          section: S,
          key: K,
          value: IBackendSettings[S][K]
     ) {
          try{
               const current = (await store.get<IBackendSettings[S]>(section)) ?? {};
               await store.set(section, {
                    ...current,
                    [key]: value,
               });
          } catch(err){
               toast.error(messageTxt("save-settings-error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     const getSettingsByKey = cache(async<K extends keyof IBackendSettings>(key: K): Promise<IBackendSettings[K] | undefined> => {
          const data = await store.get<IBackendSettings[K]>(key);
          return data;
     })
     async function setSettingsbyKey<K extends keyof IBackendSettings>(key: K,value: IBackendSettings[K]) {
          try{
               const current = await store.get<IBackendSettings[K]>(key)
               await store.set(key,!value ? current : value);
          } catch(err){
               toast.error(messageTxt("save-settings-error"),{
                    description: getErrorMessage(err)
               });
          }
     }
     useEffect(()=>{
          (async()=>{
               const current = (await store.get<string[]>("monitoringPaths")) ?? [];
               if(current.length>0) return
               await store.set("monitoringPaths",await fetchPaths())
          })()
     },[])
     return {
          getSettingsBySection,
          getSettingsByKey,
          setSettingsbySection,
          setSettingsbyKey,
          fetchSettingsbySection
     }
}