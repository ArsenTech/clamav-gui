import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platform } from "@tauri-apps/plugin-os";
import { Trans } from "react-i18next";
import WindowsAddPath from "./windows";
import LinuxAddPath from "./linux";
import MacOSAddPath from "./mac";

export default function AddPath(){
     const currPlatform = platform();
     return (
          <div className="space-y-3 text-left self-start px-6">
               <Tabs defaultValue={currPlatform==="windows" ? "windows" : currPlatform==="macos" ? "macos" : "linux"}>
                    <TabsList className="w-full">
                         <TabsTrigger value="windows">Windows</TabsTrigger>
                         <TabsTrigger value="linux">Linux</TabsTrigger>
                         <TabsTrigger value="macos">Mac OS</TabsTrigger>
                    </TabsList>
                    <TabsContent value="windows">
                         <WindowsAddPath/>
                    </TabsContent>
                    <TabsContent value="linux">
                         <LinuxAddPath/>
                    </TabsContent>
                    <TabsContent value="macos">
                         <MacOSAddPath/>
                    </TabsContent>
               </Tabs>
               <p className="text-muted-foreground"><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.check-step"
                    components={{
                         bold: <span className="font-semibold"/>
                    }}
               /></p>
          </div>
     )
}