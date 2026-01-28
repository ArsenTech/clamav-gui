import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_TABS } from "@/lib/settings/tabs";
import { useSearchParams } from "react-router";
import { SettingsTab } from "@/lib/types";

export default function SettingsContent(){
     const [searchParams] = useSearchParams();
     const [tab, setTab] = useState(()=>searchParams.get("tab") ?? (localStorage.getItem("settings-tab") || "general"));
     const changeTab = (tab: SettingsTab) => {
          setTab(tab);
          localStorage.setItem("settings-tab",tab)
     }
     return (
          <>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Settings</h1>
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
                                   <LazyComponent/>
                              </Suspense>
                         </TabsContent>
                    ))}
               </ScrollArea>
          </Tabs>
          </>
     )
}