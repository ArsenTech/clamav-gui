import CreditsSection from "@/components/credits";
import { AppLayout } from "@/components/layout";
import Logo from "@/components/logo";
import { COMPONENTS } from "@/lib/constants";
import { INITIAL_VERSION_INFO } from "@/lib/constants/states";
import { parseClamVersion } from "@/lib/helpers";
import { IClamAvVersion } from "@/lib/types";
import { IVersion } from "@/lib/types/states";
import {getTauriVersion, getVersion} from "@tauri-apps/api/app"
import { invoke } from "@tauri-apps/api/core";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function AboutPage(){
     const [versions, setVersions] = useState<IVersion>(()=>JSON.parse(localStorage.getItem("versions") as string) || INITIAL_VERSION_INFO);
     const [clamavVersion, setClamavVersion] = useState<IClamAvVersion|null>(()=>JSON.parse(localStorage.getItem("clamav-version") as string) || null);
     const {t} = useTranslation("about")
     useEffect(()=>{
          (async()=>{
               const app = await getVersion();
               const tauri = await getTauriVersion();
               const newVersions: IVersion = {app, tauri,}
               setVersions(prev=>({...prev,...newVersions}));
               localStorage.setItem("versions",JSON.stringify(newVersions));
               const clamAVraw = await invoke<string>("get_clamav_version");
               const parsed = parseClamVersion(clamAVraw);
               if(parsed){
                    setClamavVersion(prev=>({
                    ...prev,
                         engine: parsed.engine,
                         dbVersion: parsed.dbVersion
                    }))
                    localStorage.setItem("clamav-version", JSON.stringify({
                         engine: parsed.engine,
                         dbVersion: parsed.dbVersion
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
                    <p className="text-sm text-muted-foreground"></p>
                    {translatedBy.trim()!=="" && (
                         <Markdown options={{
                              overrides: COMPONENTS,
                              wrapper: "p",
                              forceWrapper: true,
                         }}>{translatedBy}</Markdown>
                    )}
                    <p className="text-muted-foreground text-center">&copy; {year} ArsenTech | {t("all-rights-reserved")}</p>
               </div>
               <CreditsSection/>
          </AppLayout>
     )
}