import { AppLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette } from "lucide-react";
import AppearanceSettingsLoader from "@/loaders/settings/appearance";
import { lazy, Suspense } from "react";
const AppearanceSettings = lazy(()=>import("./appearance"));

export default function SettingsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Settings</h1>
               <Tabs defaultValue="appearance" className="w-full">
                    <TabsList className="w-full">
                         <TabsTrigger
                              value="appearance"
                              onMouseEnter={()=>import("./appearance")}
                         >
                              <Palette/> Appearance
                         </TabsTrigger>
                    </TabsList>
                    <TabsContent value="appearance">
                         <Suspense fallback={<AppearanceSettingsLoader/>}>
                              <AppearanceSettings/>
                         </Suspense>
                    </TabsContent>
               </Tabs>
          </AppLayout>
     )
}