import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platform } from "@tauri-apps/plugin-os";
import CommandSnippetBlock from "@/components/command-snippet";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Trans, useTranslation } from "react-i18next";

export default function AddPath(){
     const currPlatform = platform();
     const {t} = useTranslation("no-clamav-page");
     const windowsSteps = t("add-to-path.windows.steps",{returnObjects: true})
     return (
          <div className="space-y-3 text-left self-start px-6">
               <Tabs defaultValue={currPlatform==="windows" ? "windows" : "linux"}>
                    <TabsList className="w-full">
                         <TabsTrigger value="windows">Windows</TabsTrigger>
                         <TabsTrigger value="linux">Linux</TabsTrigger>
                    </TabsList>
                    <TabsContent value="windows" className="space-y-3">
                         <p>{t("add-to-path.windows.cmd")}</p>
                         <CommandSnippetBlock
                              command="where clamscan"
                         />
                         <p><Trans
                              ns="no-clamav-page"
                              i18nKey="add-to-path.windows.if-returns-path"
                              components={{
                                   code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>
                              }}
                         /></p>
                         <ol className="list-decimal text-left self-start space-y-2 px-8">
                              {windowsSteps.map((step,i)=>(
                                   <li key={`step-${i+1}`}>
                                        <Trans
                                             components={{
                                                  code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>,
                                                  bold: <span className="font-semibold"/>
                                             }}
                                        >
                                             {step}
                                        </Trans>
                                   </li>
                              ))}
                         </ol>
                         <p>{t("add-to-path.windows.verification")}</p>
                         <CommandSnippetBlock
                              command="clamscan --version"
                         />
                    </TabsContent>
                    <TabsContent value="linux" className="space-y-3">
                         <p>{t("add-to-path.linux.cmd")}</p>
                         <CommandSnippetBlock
                              command="which clamscan"
                         />
                         <p><Trans
                              ns="no-clamav-page"
                              i18nKey="add-to-path.linux.nano"
                              components={{
                                   code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>,
                                   bold: <span className="font-semibold"/>
                              }}
                         /></p>
                         <CommandSnippetBlock
                              command="sudo nano ~/.bashrc"
                         />
                         <p><Trans
                              ns="no-clamav-page"
                              i18nKey="add-to-path.linux.snippet"
                              components={{
                                   bold: <span className="font-semibold"/>
                              }}
                         /></p>
                         <CommandSnippetBlock
                              command='export PATH="$PATH:/path/to/clamav/bin"'
                         />
                         <p><Trans
                              ns="no-clamav-page"
                              i18nKey="add-to-path.linux.kbd-shortcut"
                              components={{
                                   save: <KbdGroup>
                                        <Kbd>Ctrl</Kbd>
                                        <span>+</span>
                                        <Kbd>S</Kbd>
                                   </KbdGroup>,
                                   exit: <KbdGroup>
                                        <Kbd>Ctrl</Kbd>
                                        <span>+</span>
                                        <Kbd>X</Kbd>
                                   </KbdGroup>
                              }}
                         /></p>
                         <CommandSnippetBlock
                              command='source ~/.bashrc'
                         />
                         <p>{t("add-to-path.linux.verification")}</p>
                         <CommandSnippetBlock
                              command="clamscan --version"
                         />
                    </TabsContent>
               </Tabs>
               <p><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.check-step"
                    components={{
                         code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>,
                         bold: <span className="font-semibold"/>
                    }}
               /></p>
          </div>
     )
}