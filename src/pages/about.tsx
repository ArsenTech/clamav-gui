import CreditsSection from "@/components/credits";
import { AppLayout } from "@/components/layout";
import Logo from "@/components/logo";
import { INITIAL_VERSION_INFO } from "@/lib/constants/states";
import { parseClamVersion } from "@/lib/helpers";
import { IVersion } from "@/lib/types/states";
import {getTauriVersion, getVersion} from "@tauri-apps/api/app"
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function AboutPage(){
     const [versions, setVersions] = useState<IVersion>(()=>JSON.parse(localStorage.getItem("versions") as string) || INITIAL_VERSION_INFO);
     useEffect(()=>{
          (async()=>{
               const app = await getVersion();
               const tauri = await getTauriVersion();
               const stored = localStorage.getItem("clamav-version");
               let clamAvVersion = "";
               if(stored){
                    clamAvVersion = stored
               } else {
                    const clamAVraw = await invoke<string>("get_clamav_version");
                    const parsed = parseClamVersion(clamAVraw);
                    if(parsed){
                         const versionText = `ClamAV v${parsed.engine}, Database Version: ${parsed.dbVersion}`;
                         localStorage.setItem("clamav-version", versionText);
                         clamAvVersion = versionText;
                    }
               }
               const newVersions: IVersion = {
                    ...versions,
                    app, tauri,
                    clamAV: clamAvVersion
               }
               setVersions(newVersions);
               const {clamAV, ...newV} = newVersions;  
               localStorage.setItem("versions",JSON.stringify(newV))
          })();
     },[])
     const year = new Date().getFullYear();
     return (
          <AppLayout className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-1 w-fit border-primary/50">About ClamAV GUI</h1>
                    <Logo width={500} height={130}/>
                    <h2 className="text-2xl md:text-3xl text-center font-medium">Version {versions.app} {versions.versionType.trim()!=="" ? `- ${versions.versionType}` : null}</h2>
                    <p>A minimal, open-source interface for file scanning and threat detection that makes the Antivirus itself look professional and work exactly like ClamAV (A FOSS CLI Antivirus).</p>
                    <p>Built with Tauri, React, and modern desktop and web tools. This software is provided as-is. No data is collected or transmitted. This GUI uses ClamAV's <code className="text-muted-foreground font-medium">clamscan</code> and <code className="text-muted-foreground font-medium">freshclam</code> engines. Scan types are presets that define which locations and which limits are used.</p>
                    <p>ClamAV is a trademark of Cisco Systems, Inc. This project is an independent, open-source GUI and is not affiliated with or endorsed by Cisco.</p>
                    <ul className="text-sm text-muted-foreground">
                         <li title="Virus definition database version">{versions.clamAV}</li>
                         <li>Tauri v{versions.tauri}</li>
                    </ul>
                    <p className="text-sm text-muted-foreground"></p>
                    <p className="text-muted-foreground text-center">&copy; {year} ArsenTech | All Rights Reserved</p>
               </div>
               <CreditsSection/>
          </AppLayout>
     )
}