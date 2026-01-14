import { AppLayout } from "@/components/layout";
import {getTauriVersion, getVersion} from "@tauri-apps/api/app"
import { useEffect, useState } from "react";

export default function AboutPage(){
     const [versions, setVersions] = useState({
          app: "0.0.0",
          tauri: "0.0.0",
          versionType: "Early Build"
     });
     useEffect(()=>{
          const loadVersions = async()=>{
               const app = await getVersion();
               const tauri = await getTauriVersion();
               setVersions(prev=>({
                    ...prev,
                    app, tauri
               }))
          }
          loadVersions();
     },[])
     const year = new Date().getFullYear();
     return (
          <AppLayout className="grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">About ClamAV GUI</h1>
                    <img src="/logo-blue.webp" alt="ClamAV GUI" width={500} height={130}/>
                    <h2 className="text-2xl md:text-3xl text-center font-medium">Version {versions.app} {versions.versionType.trim()!=="" ? `- ${versions.versionType}` : null}</h2>
                    <p>A minimal, open-source interface for file scanning and threat detection that makes the Antivirus itself look professional and work exactly like ClamAV (A FOSS CLI Antivirus).</p>
                    <p>Built with ClamAV, Tauri, React, and modern desktop and web tools. This software is provided as-is. No data is collected or transmitted.</p>
                    <p className="text-muted-foreground text-center">&copy; {year} ArsenTech | All Rights Reserved</p>
               </div>
               <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[700px]">
                    <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Credits</h2>
                    <p>Core Technologies</p>
                    <ul className="list-disc px-5">
                         <li>ClamAV</li>
                    </ul>
                    <p>Interface & Platform</p>
                    <ul className="list-disc px-5">
                         <li>Tauri v{versions.tauri} (Desktop RunTime)</li>
                         <li>React (UI)</li>
                         <li>Rust (Backend)</li>
                         <li>React Router (Navigation)</li>
                         <li>ShadCN UI (Design system)</li>
                    </ul>
                    <p>Inspiration & Community</p>
                    <ul className="list-disc px-5">
                         <li>Open Source contributors</li>
                    </ul>
                    <p className="font-semibold">Made by ArsenTech with love & trust</p>
               </div>
          </AppLayout>
     )
}