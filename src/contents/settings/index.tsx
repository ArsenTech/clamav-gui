import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_TABS } from "@/lib/constants/settings/tabs";
import { useSearchParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FolderSearch, FileSearch } from "lucide-react";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { SettingsTab, ScanProfile } from "@/lib/types/enums";
import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_SETTINGS } from "@/lib/constants/settings";
import useWindowTitle from "@/hooks/use-window-title";
import { Skeleton } from "@/components/ui/skeleton";

const ImportExportSettings = lazy(()=>import("@/components/settings-item/import-export"));

export default function SettingsContent(){
     const [searchParams] = useSearchParams();
     const {settings, setSettings} = useSettings();
     const [scanProfile, setScanProfile] = useState<ScanProfile>(
          settings.currScanProfile || DEFAULT_SETTINGS.currScanProfile
     );
     const [tab, setTab] = useState(()=>searchParams.get("tab") ?? (localStorage.getItem("settings-tab") || SettingsTab.General));
     const changeTab = (tab: SettingsTab) => {
          setTab(tab);
          localStorage.setItem("settings-tab",tab)
     }
     const {t} = useTranslation("settings");
     const isMobile = useIsMobile();
     const activeTab = useMemo(()=>SETTINGS_TABS.find(t => t.page === tab),[tab]);
     useWindowTitle(!activeTab ? t("window-titles.general") : t(`window-titles.${activeTab.page}`, {
          defaultValue: t("window-titles.general")
     }))
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
                              value={scanProfile}
                              onValueChange={v=>{
                                   const profile = v as ScanProfile;
                                   setScanProfile(profile);
                                   setSettings({ currScanProfile: profile });
                              }}
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
                    <Suspense fallback={<Skeleton className="h-9 w-18"/>}>
                         <ImportExportSettings/>
                    </Suspense>
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
                    {activeTab && (
                         <TabsContent value={activeTab.page}>
                              <Suspense fallback={<activeTab.Loader/>}>
                                   <activeTab.LazyComponent scanProfile={settings.currScanProfile}/>
                              </Suspense>
                         </TabsContent>
                    )}
               </ScrollArea>
          </Tabs>
          </>
     )
}