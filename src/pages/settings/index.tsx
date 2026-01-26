import { AppLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Braces, Cog, Search } from "lucide-react";
import GeneralSettingsLoader from "@/loaders/settings/general";
import { lazy, Suspense } from "react";
import ScanSettings from "./scan";
import AdvancedSettings from "./advanced";
const GeneralSettings = lazy(()=>import("./general"));

export default function SettingsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Settings</h1>
               <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full">
                         <TabsTrigger value="general">
                              <Cog/> General
                         </TabsTrigger>
                         <TabsTrigger value="scan">
                              <Search/> Scan
                         </TabsTrigger>
                         <TabsTrigger value="advanced">
                              <Braces/> Advanced
                         </TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                         <Suspense fallback={<GeneralSettingsLoader/>}>
                              <GeneralSettings/>
                         </Suspense>
                    </TabsContent>
                    <TabsContent value="scan">
                         <ScanSettings/>
                    </TabsContent>
                    <TabsContent value="advanced">
                         <AdvancedSettings/>
                    </TabsContent>
               </Tabs>
          </AppLayout>
     )
}