import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_TABS } from "@/lib/constants/settings/tabs";
import { useSearchParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FolderSearch, FileSearch, Download, Upload } from "lucide-react";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { SettingsTab, ScanProfile } from "@/lib/types/enums";
import { store } from "@/lib/store"
import { IBackendSettings, ISettingsMetadata, ScanProfileValues } from "@/lib/types/settings";
import { getName } from "@tauri-apps/api/app"
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { useBackendSettings } from "@/hooks/use-settings";
import { getErrorMessage } from "@/lib/helpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAppVersions } from "@/data/versions";

export default function SettingsContent(){
     const [searchParams] = useSearchParams();
     const {settings, setSettings} = useSettings();
     const {setSettingsbyKey} = useBackendSettings()
     const [tab, setTab] = useState(()=>searchParams.get("tab") ?? (localStorage.getItem("settings-tab") || SettingsTab.General));
     const changeTab = (tab: SettingsTab) => {
          setTab(tab);
          localStorage.setItem("settings-tab",tab)
     }
     const {t} = useTranslation("settings")
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
               const appVersions = await getAppVersions()
               const data: ISettingsMetadata = {
                    name: await getName(),
                    version: appVersions.app,
                    frontend: settings,
                    backend: Object.fromEntries(backendEntries) as unknown as IBackendSettings
               }
               const jsonData = JSON.stringify(data,null,2);
               await writeTextFile(path,jsonData);
               toast.success(t("export.success"))
          } catch (err) {
               toast.error(t("export.error"),{
                    description: getErrorMessage(err)
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
               const data = JSON.parse(rawData) as ISettingsMetadata;
               setSettings(data.frontend)
               const keys = await store.keys() as (keyof IBackendSettings)[]
               for(const key of keys)
                    await setSettingsbyKey(key,data.backend[key])
               toast.success(t("import.success"))
          } catch (err){
               toast.error(t("import.error"),{
                    description: getErrorMessage(err)
               })
          }
     }
     const isMobile = useIsMobile()
     return (
          <>
          <h1 className="inline-flex justify-between items-center gap-2 w-full">
               <span className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit inline-block">
                    {t("title")}
               </span>
               <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3">
                         <Label>{t("scan-profile.title")}</Label>
                         <Select
                              value={settings.currScanProfile || "custom"}
                              onValueChange={v=>setSettings({currScanProfile: v as ScanProfile})}
                         >
                              <SelectTrigger className="w-48">
                                   <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="main">
                                        <Search/>
                                        {t("scan-profile.main")}
                                   </SelectItem>
                                   <SelectItem value="custom">
                                        <FolderSearch/>
                                        {t("scan-profile.custom")}
                                   </SelectItem>
                                   <SelectItem value="file">
                                        <FileSearch/>
                                        {t("scan-profile.file")}
                                   </SelectItem>
                              </SelectContent>
                         </Select>
                    </div>
                    <ButtonGroup>
                         <Button variant="outline" title={t("export.button-title")} size="icon" onClick={exportSettings}>
                              <Download/>
                         </Button>
                         <Button variant="outline" title={t("import.button-title")} size="icon" onClick={importSettings}>
                              <Upload/>
                         </Button>
                    </ButtonGroup>
               </div>
          </h1>
          <Tabs onValueChange={tab=>changeTab(tab as SettingsTab)} defaultValue={tab} className="w-full">
               <TabsList className="w-full">
                    {SETTINGS_TABS.map(({page,Icon})=>(
                         <TabsTrigger key={page} value={page}>
                              <Icon/>
                              {!isMobile && t(`tabs.${page}`)}
                         </TabsTrigger>
                    ))}
               </TabsList>
               <ScrollArea className="h-[calc(100vh-185px)]">
                    {SETTINGS_TABS.map(({page,Loader,LazyComponent})=>(
                         <TabsContent key={page} value={page}>
                              <Suspense fallback={<Loader/>}>
                                   <LazyComponent scanProfile={settings.currScanProfile}/>
                              </Suspense>
                         </TabsContent>
                    ))}
               </ScrollArea>
          </Tabs>
          </>
     )
}