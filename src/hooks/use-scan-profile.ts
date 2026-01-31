import { DEFAULT_BACKEND_SETTINGS } from "@/lib/settings";
import { BackendSettings, ScanProfileValues } from "@/lib/types/settings";
import { useState, useEffect } from "react";
import { useBackendSettings } from "./use-settings";

export function useScanProfile(profile: keyof BackendSettings["scanProfiles"]) {
     const { fetchBackendSettings, setBackendSettings } = useBackendSettings();
     const [values, setValues] = useState<ScanProfileValues>({});
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          (async () => {
               const profiles = await fetchBackendSettings("scanProfiles");
               setValues(profiles?.[profile] ?? {});
               setIsLoading(false);
          })();
     }, [profile]);

     const setValue = async <K extends keyof ScanProfileValues>(
          key: K,
          value: ScanProfileValues[K]
     ) => {
          setValues(prev => ({ ...prev, [key]: value }));

          const profiles =
               (await fetchBackendSettings("scanProfiles")) ?? DEFAULT_BACKEND_SETTINGS.scanProfiles;

          await setBackendSettings("scanProfiles", profile, {
               ...profiles[profile],
               [key]: value,
          });
     };

     return { values, setValue, isLoading };
}