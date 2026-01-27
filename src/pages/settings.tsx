import { AppLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Braces, Cog, Search } from "lucide-react";
import GeneralSettingsLoader from "@/loaders/settings/general";
import { lazy, Suspense } from "react";
import ScanSettingsLoader from "@/loaders/settings/scan";
import AdvancedSettingsLoader from "@/loaders/settings/advanced";
import { ScrollArea } from "@/components/ui/scroll-area";

const GeneralSettings = lazy(()=>import("@/contents/settings/general"));
const AdvancedSettings = lazy(()=>import("@/contents/settings/advanced"));
const ScanSettings = lazy(()=>import("@/contents/settings/scan"));

export default function SettingsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Settings</h1>
               <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full">
                         <TabsTrigger
                              value="general"
                              onMouseEnter={()=>import("@/contents/settings/general")}
                         >
                              <Cog/> General
                         </TabsTrigger>
                         <TabsTrigger
                              value="scan"
                              onMouseEnter={()=>import("@/contents/settings/scan")}
                         >
                              <Search/> Scan
                         </TabsTrigger>
                         <TabsTrigger
                              value="advanced"
                              onMouseEnter={()=>import("@/contents/settings/advanced")}
                         >
                              <Braces/> Advanced
                         </TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[calc(100vh-185px)]">
                         <TabsContent value="general">
                              <Suspense fallback={<GeneralSettingsLoader/>}>
                                   <GeneralSettings/>
                              </Suspense>
                         </TabsContent>
                         <TabsContent value="scan">
                              <Suspense fallback={<ScanSettingsLoader/>}>
                                   <ScanSettings/>
                              </Suspense>
                         </TabsContent>
                         <TabsContent value="advanced">
                              <Suspense fallback={<AdvancedSettingsLoader/>}>
                                   <AdvancedSettings/>
                              </Suspense>
                         </TabsContent>
                    </ScrollArea>
               </Tabs>
          </AppLayout>
     )
}