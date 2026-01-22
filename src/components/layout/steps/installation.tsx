import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommandSnippetBlock from "@/components/command-snippet";

export default function Installation(){
     return (
          <div className="space-y-3 text-left self-start px-6">
               <p>Make sure to Install ClamAV by following the installation guide here:</p>
               <Button variant="link" asChild>
                    <a href="https:/docs.clamav.net/manual/Installing.html" target="_blank"><ExternalLink/> docs.clamav.net/manual/Installing.html</a>
               </Button>
               <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">Recommended Linux Commands</h2>
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