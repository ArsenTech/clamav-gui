import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommandSnippetBlock from "@/components/command-snippet";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useTranslation } from "react-i18next";

export default function Installation(){
     const {t} = useTranslation("no-clamav-page")
     return (
          <div className="space-y-3 text-left self-start px-6">
               <p>{t("installation.info")}</p>
               <Button variant="link" onClick={()=>openUrl("https://docs.clamav.net/manual/Installing.html")}>
                    <ExternalLink/> docs.clamav.net/manual/Installing.html
               </Button>
               <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">{t("installation.linux-commands")}</h2>
               <Tabs defaultValue="deb">
                    <TabsList className="w-full">
                         <TabsTrigger value="rpm">Fedora, OpenSUSE, etc</TabsTrigger>
                         <TabsTrigger value="deb">Debian, Ubuntu, etc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rpm" className="space-y-2">
                         <CommandSnippetBlock
                              command="sudo dnf install ~/Downloads/clamav-1.4.0.linux.x86_64.rpm"
                         />
                         <CommandSnippetBlock
                              command="dnf info clamav"
                         />
                    </TabsContent>
                    <TabsContent value="deb" className="space-y-2">
                         <CommandSnippetBlock
                              command="sudo apt install ~/Downloads/clamav-1.4.0.libnux.x86_64.deb"
                         />
                         <CommandSnippetBlock
                              command="apt info clamav"
                         />
                    </TabsContent>
               </Tabs>
          </div>
     )
}