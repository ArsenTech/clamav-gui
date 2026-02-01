import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_TABS } from "@/lib/settings/tabs";
import { useSearchParams } from "react-router";
import { SettingsTab } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanProfileId } from "@/lib/types/settings";
import { Search, FolderSearch, FileSearch } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function SettingsContent(){
     const [searchParams] = useSearchParams();
     const {settings, setSettings} = useSettings();
     const [tab, setTab] = useState(()=>searchParams.get("tab") ?? (localStorage.getItem("settings-tab") || "general"));
     const changeTab = (tab: SettingsTab) => {
          setTab(tab);
          localStorage.setItem("settings-tab",tab)
     }
     return (
          <>
          <h1 className="inline-flex justify-between items-center gap-2 w-full">
               <span className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit inline-block">Settings</span>
               <div className="flex items-center gap-3">
                    <Label>Active Scan Profile</Label>
                    <Select
                         value={settings.currScanProfile || "custom"}
                         onValueChange={v=>setSettings({currScanProfile: v as ScanProfileId})}
                    >
                         <SelectTrigger className="w-48">
                              <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                              <SelectItem value="main"><Search/> Main Scan</SelectItem>
                              <SelectItem value="custom"><FolderSearch/> Custom Scan</SelectItem>
                              <SelectItem value="file"><FileSearch/> File Scan</SelectItem>
                         </SelectContent>
                    </Select>
               </div>
          </h1>
          <Tabs onValueChange={tab=>changeTab(tab as SettingsTab)} defaultValue={tab} className="w-full">
               <TabsList className="w-full">
                    {SETTINGS_TABS.map(({name,page,Icon})=>(
                         <TabsTrigger key={page} value={page}>
                              <Icon/> {name}
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