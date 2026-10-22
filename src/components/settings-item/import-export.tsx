import { Download, Upload } from "lucide-react";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { ScanProfile, BehaviorMode, BadgeVisibility, SidebarCollapsible } from "@/lib/types/enums";
import { store } from "@/lib/store"
import { IBackendSettings, ISettingsMetadata, ScanProfileValues } from "@/lib/types/settings";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { useBackendSettings } from "@/hooks/use-settings";
import { getErrorMessage } from "@/lib/helpers";
import { getAppDetails } from "@/data/app";
import { SettingsMetadataSchema } from "@/lib/schemas/settings";

export default function ImportExportSettings(){
     const {settings, setSettings} = useSettings();
     const {setSettingsbyKey} = useBackendSettings()
     const {t} = useTranslation("settings");
     const {t: backendTxt} = useTranslation("backend-errors");
     const exportSettings = async() => {
          try{
               const path = await save({
                    title: t("export.title"),
                    filters: [
                         { name: t("json-settings"), extensions: ["json"] }
                    ],
                    defaultPath: "clamav-gui-settings.json"
               })
               if(!path) return;
               const backendEntries = await store.entries<ScanProfileValues|string[]>()
               const app = await getAppDetails()
               const data: ISettingsMetadata = {
                    schemaVersion: 1,
                    name: app.name,
                    version: app.version,
                    identifier: app.identifier,
                    frontend: settings,
                    backend: Object.fromEntries(backendEntries) as unknown as IBackendSettings
               }
               const jsonData = JSON.stringify(data,null,2);
               await writeTextFile(path,jsonData);
               toast.success(t("export.success"))
          } catch (err) {
               toast.error(t("export.error"),{
                    description: getErrorMessage(err, backendTxt)
               })
          }
     }
     const importSettings = async() => {
          try {
               const path = await open({
                    title: t("import.title"),
                    filters: [
                         { name: t("json-settings"), extensions: ["json"] }
                    ],
                    defaultPath: "clamav-gui-settings.json",
                    directory: false,
               })
               if(!path) return;
               const rawData = await readTextFile(path)
               if(rawData.trim()===""){
                    toast.error(t("import.empty-content"));
                    return;
               }
               console.log(rawData)
               const parsed = SettingsMetadataSchema.safeParse(JSON.parse(rawData));
               if(!parsed.success){
                    toast.error(t("import.error"),{
                         description: parsed.error.message
                    });
                    return;
               }
               const {frontend, backend} = parsed.data
               setSettings({
                    ...frontend,
                    currScanProfile: frontend.currScanProfile as ScanProfile,
                    behavior: frontend.behavior as BehaviorMode,
                    badgeVisibility: frontend.badgeVisibility as BadgeVisibility,
                    sidebarCollapsible: frontend.sidebarCollapsible as SidebarCollapsible
               })
               const keys = await store.keys() as (keyof IBackendSettings)[]
               for(const key of keys)
                    await setSettingsbyKey(key,backend[key])
               toast.success(t("import.success"))
          } catch (err){
               toast.error(t("import.error"),{
                    description: getErrorMessage(err, backendTxt)
               })
          }
     }
     return (
          <ButtonGroup>
               <Button variant="outline" title={t("export.button-title")} size="icon" onClick={exportSettings}>
                    <Download/>
               </Button>
               <Button variant="outline" title={t("import.button-title")} size="icon" onClick={importSettings}>
                    <Upload/>
               </Button>
          </ButtonGroup>
     )
}