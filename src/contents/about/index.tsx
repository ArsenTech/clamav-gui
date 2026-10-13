import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getAppDetails, getClamAvVersion } from "@/data/app";
import { COMPONENTS } from "@/lib/constants/md-components";
import { INITIAL_VERSION_INFO } from "@/lib/constants/states";
import { IClamAvVersion } from "@/lib/types";
import { IAppDetails } from "@/lib/types/states";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Code, Grid2X2Plus, Languages, MessageCircleWarning } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function AboutContent(){
     const [details, setDetails] = useState<IAppDetails>(()=>JSON.parse(localStorage.getItem("versions") as string) || INITIAL_VERSION_INFO);
     const [clamavVersion, setClamavVersion] = useState<IClamAvVersion|null>(()=>JSON.parse(localStorage.getItem("clamav-version") as string) || null);
     const {t} = useTranslation("about")
     useEffect(()=>{
          (async()=>{
               const newDetails = await getAppDetails()
               setDetails(prev=>({...prev,...newDetails}));
               localStorage.setItem("versions",JSON.stringify(newDetails));
               const clamAvVersion = await getClamAvVersion()
               if(clamAvVersion!==null){
                    setClamavVersion(prev=>({
                    ...prev,
                         engine: clamAvVersion.engine,
                         dbVersion: clamAvVersion.dbVersion
                    }))
                    localStorage.setItem("clamav-version", JSON.stringify({
                         engine: clamAvVersion.engine,
                         dbVersion: clamAvVersion.dbVersion
                    }));
               }
          })();
     },[])
     const year = new Date().getFullYear();
     const translatedBy: string = t("translated-by");
     console.log(details)
     return (
          <ScrollArea className="max-h-205">
               <div className="space-y-4">
                    <div className="w-full sticky top-0 left-0 bg-background mt-0 pb-1.5 flex flex-col items-center">
                         <h1 className="text-2xl md:text-3xl font-medium border-b pb-1 w-fit border-primary/50 self-start">{t("title")}</h1>
                         <Logo
                              width={500}
                              height={130}
                              className="pt-1.5 w-full max-w-125 h-auto"
                         />
                         {details.version.trim()!=="" ? (
                              <h2 className="text-2xl md:text-3xl text-center font-medium">{t("version",{version: details.version})}</h2>
                         ) : (
                              <Skeleton className="w-1/2 h-6 md:h-8"/>
                         )}
                    </div>
                    <p>{t("desc.line1")}</p>
                    <p>
                         <Trans
                              ns="about"
                              i18nKey="desc.line2"
                              components={{
                                   code: <code className="text-muted-foreground font-medium"/>
                              }}
                         />
                    </p>
                    <p>{t("desc.line3")}</p>
                    <div className="text-sm text-muted-foreground space-y-1.5 w-full">
                         {clamavVersion ? (
                              <div title={t("def-version")}>{t("clamav-version",{
                                   engine: clamavVersion.engine,
                                   dbVersion: clamavVersion.dbVersion
                              })}</div>
                         ) : (
                              <Skeleton className="h-3.5 w-3/4"/>
                         )}
                         {details.tauri.trim()!=="" ? (
                              <div>{t("tauri-version",{
                                   version: details.tauri
                              })}</div>
                         ) : (
                              <Skeleton className="h-3.5 w-1/4"/>
                         )}
                         {details.identifier.trim()!=="" ? (
                              <div>{t("identifier",{
                                   value: details.identifier
                              })}</div>
                         ) : (
                              <Skeleton className="h-3.5 w-1/2"/>
                         )}
                    </div>
                    {translatedBy.trim()!=="" && (
                         <p className="mb-0">
                              <Markdown options={{
                              overrides: COMPONENTS,
                              wrapper: null
                         }}>{translatedBy}</Markdown>
                         </p>
                    )}
                    <hr/>
                    <p>{t("desc.line4")}</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                         <Button variant="destructive" className="flex-1" onClick={async()=>await openUrl("https://github.com/ArsenTech/clamav-gui/issues/new?assignees=&labels=&template=bug_report.md&title=")}>
                              <MessageCircleWarning/>
                              {t("buttons.bug-report")}
                         </Button>
                         <Button className="flex-1" onClick={async()=>await openUrl("https://github.com/ArsenTech/clamav-gui/issues/new?assignees=&labels=&template=feature_request.md&title=")}>
                              <Grid2X2Plus/>
                              {t("buttons.feature-request")}
                         </Button>
                         <Button variant="outline" className="flex-1" onClick={async()=>await openUrl("https://github.com/ArsenTech/clamav-gui/blob/main/docs/CONTRIBUTING.md")}>
                              <Code/>
                              {t("buttons.contribute")}
                         </Button>
                         <Button variant="outline" className="flex-1" onClick={async()=>await openUrl("https://github.com/ArsenTech/clamav-gui/tree/main/public/locales")}>
                              <Languages/>
                              {t("buttons.translate")}
                         </Button>
                    </div>
                    <p className="text-muted-foreground text-center">&copy; {year} ArsenTech | {t("all-rights-reserved")}</p>
               </div>     
          </ScrollArea>
     )
}