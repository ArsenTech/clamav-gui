import SafetyIndicator from "@/components/antivirus/indicator";
import { useNavigate } from "react-router";
import { QUICK_ACCESS_LINKS } from "@/lib/constants/links";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { normalizePaths, parseClamVersion } from "@/lib/helpers";
import { invoke } from "@tauri-apps/api/core";
import { useSettings } from "@/context/settings";
import { FsOption } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { DefinitionStatus, Indicator } from "@/lib/types/enums";

export default function OverviewContent(){
     const navigate = useNavigate();
     const {settings} = useSettings();
     const {t} = useTranslation("overview")
     const [definitionStatus, setDefinitionStatus] = useState<DefinitionStatus>(DefinitionStatus.Loading)
     const openCustomScan = async(href: string, type: FsOption) => {
          const currPath = await open({
               multiple: type==="folder",
               directory: type==="folder",
          });
          if(!currPath) return;
          const paths = normalizePaths(currPath);
          const params = new URLSearchParams();
          for(const path of paths)
               params.append("path",path);
          navigate(`${href}?${params.toString()}`)
     }
     useEffect(()=>{
          (async()=>{
               try{
                    const raw = await invoke<string>("get_clamav_version");
                    const parsed = parseClamVersion(raw);
                    if(!parsed) return;
                    setDefinitionStatus(parsed.isOutdated ? DefinitionStatus.Outdated : DefinitionStatus.Updated)
               } catch {
                    setDefinitionStatus(DefinitionStatus.Outdated)
               }
          })()
     },[])
     return (
          <>
               <SafetyIndicator
                    definitionStatus={definitionStatus}
                    type={settings.realTime ? Indicator.Safe : Indicator.Alert}
               />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full p-4 gap-4">
                    {QUICK_ACCESS_LINKS.map(({type,href,Icon,openDialogType},i)=>(
                         <div key={`item-${i+1}`} className="w-full p-3 shadow-sm rounded-md bg-background text-foreground border grow shrink-0 h-36 flex justify-center items-center gap-4 hover:border-primary hover:cursor-pointer" onClick={()=>openDialogType==="none" ? navigate(href) : openCustomScan(href,openDialogType)}>
                              <Icon className="size-12 text-primary"/>
                              <div className="w-[calc(100%-48px)] space-y-0.5">
                                   <h2 className="text-lg md:text-xl font-medium">{t(`${type}.name`)}</h2>
                                   <p className="text-sm">{t(`${type}.desc`)}</p>
                              </div>
                         </div>
                    ))}
               </div>
          </>
     )
}