import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platform } from "@tauri-apps/plugin-os";
import CommandSnippetBlock from "@/components/command-snippet";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function AddPath(){
     const currPlatform = platform();
     return (
          <div className="space-y-3 text-left self-start px-6">
               <Tabs defaultValue={currPlatform==="windows" ? "windows" : "linux"}>
                    <TabsList className="w-full">
                         <TabsTrigger value="windows">Windows</TabsTrigger>
                         <TabsTrigger value="linux">Linux</TabsTrigger>
                    </TabsList>
                    <TabsContent value="windows" className="space-y-3">
                         <p>Open the Command Prompt, then type:</p>
                         <CommandSnippetBlock
                              command="where clamscan"
                         />
                         <p>Once it returns the path (example: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm">C:\Program Files\ClamAV</code>):</p>
                         <ol className="list-decimal text-left self-start space-y-2 px-8">
                              <li>Open the Start Menu, Type <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm">env</code></li>
                              <li>Click on the "Edit the system environment variables".</li>
                              <li>Click on "Environment Variables" in the System Properties Window.</li>
                              <li>Find the <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm">Path</code> variable, Click <span className="font-semibold">Edit</span>, then add the output path of the <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm">where clamscan</code> command.</li>
                              <li>Click <span className="font-semibold">OK</span>, then <span className="font-semibold">OK</span>, <span className="font-semibold">Apply</span>, then <span className="font-semibold">OK</span></li>
                         </ol>
                         <p>Verify by opening the Command Prompt, and typing:</p>
                         <CommandSnippetBlock
                              command="clamscan --version"
                         />
                    </TabsContent>
                    <TabsContent value="linux" className="space-y-3">
                         <p>Open the preferred terminal, then type:</p>
                         <CommandSnippetBlock
                              command="which clamscan"
                         />
                         <p>Once it returns the path (example: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm">/path/to/clamav/bin</code>), open the <span className="font-semibold">~/.bashrc</span> file with nano:</p>
                         <CommandSnippetBlock
                              command="sudo nano ~/.bashrc"
                         />
                         <p>Then add the following snippet in the end of <span className="font-semibold">~/.bashrc</span> file:</p>
                         <CommandSnippetBlock
                              command='export PATH="$PATH:/path/to/clamav/bin"'
                         />
                         <p>Press <KbdGroup>
                              <Kbd>Ctrl</Kbd>
                              <span>+</span>
                              <Kbd>S</Kbd>
                         </KbdGroup>, then <KbdGroup>
                              <Kbd>Ctrl</Kbd>
                              <span>+</span>
                              <Kbd>X</Kbd>
                         </KbdGroup>, reload the terminal by using:</p>
                         <CommandSnippetBlock
                              command='source ~/.bashrc'
                         />
                         <p>then verify by typing:</p>
                         <CommandSnippetBlock
                              command="clamscan --version"
                         />
                    </TabsContent>
               </Tabs>
               <p>Once you installed ClamAV and added the ClamAV path into the <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm">PATH</code> environment variable, click on the <span className="font-semibold">Check Availability</span> button below to activate the ClamAV GUI for free</p>
          </div>
     )
}