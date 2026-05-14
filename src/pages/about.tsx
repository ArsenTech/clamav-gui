import CreditsSection from "@/components/credits";
import { AppLayout } from "@/components/layout";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getAppVersions, getClamAvVersion } from "@/data/app";
import useWindowTitle from "@/hooks/use-window-title";
import { COMPONENTS } from "@/lib/constants/md-components";
import { INITIAL_VERSION_INFO } from "@/lib/constants/states";
import { IClamAvVersion } from "@/lib/types";
import { IVersion } from "@/lib/types/states";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Code, Grid2X2Plus, Languages, MessageCircleWarning } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function AboutPage(){
     const [versions, setVersions] = useState<IVersion>(()=>JSON.parse(localStorage.getItem("versions") as string) || INITIAL_VERSION_INFO);
     const [clamavVersion, setClamavVersion] = useState<IClamAvVersion|null>(()=>JSON.parse(localStorage.getItem("clamav-version") as string) || null);
     const {t} = useTranslation("about")
     useWindowTitle(t("title"))
     useEffect(()=>{
          (async()=>{
               const newVersions = await getAppVersions()
               setVersions(prev=>({...prev,...newVersions}));
               localStorage.setItem("versions",JSON.stringify(newVersions));
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
     return (
          <AppLayout className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-1 w-fit border-primary/50">{t("title")}</h1>
                    <Logo width={500} height={130}/>
                    <h2 className="text-2xl md:text-3xl text-center font-medium">{t("version",{version: versions.app})}</h2>
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
                    <ul className="text-sm text-muted-foreground">
                         {clamavVersion && (
                              <li title={t("def-version")}>{t("clamav-version",{
                                   engine: clamavVersion.engine,
                                   dbVersion: clamavVersion.dbVersion
                              })}</li>
                         )}
                         <li>Tauri v{versions.tauri}</li>
                    </ul>
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
               <CreditsSection/>
          </AppLayout>
     )
}