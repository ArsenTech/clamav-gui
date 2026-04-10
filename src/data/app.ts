import { parseClamVersion } from "@/lib/helpers";
import { IVersion } from "@/lib/types/states";
import { getVersion, getTauriVersion, getName } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import { cache } from "react";

export const getAppVersions = cache(async(): Promise<IVersion> => {
     const app = await getVersion();
     const tauri = await getTauriVersion();
     return {app, tauri}
})

export const getClamAvVersion = cache(async() => {
     try{
          const clamAVraw = await invoke<string>("get_clamav_version");
          const parsed = parseClamVersion(clamAVraw);
          return parsed
     } catch {
          return null
     }
})

export const checkDefinitionStatus = cache(async() => {
     try{
          const clamAVraw = await invoke<string>("get_clamav_version");
          const parsed = parseClamVersion(clamAVraw);
          return parsed ? parsed.isOutdated : false
     } catch {
          return false
     }
})

export const checkAvailability = cache(async() =>await invoke<boolean>("check_availability"))

export const getAppDetails = cache(async() => {
     const name = await getName();
     const version = await getVersion();
     return {name, version}
})