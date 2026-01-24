import React, { useEffect, useState, useTransition } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/main-sidebar";
import { cn } from "@/lib/utils";
import {invoke} from "@tauri-apps/api/core"
import NoClamAVPage from "./no-clamav";
import SplashScreen from "./splash-screen";
import { ClamAVState } from "@/lib/types";
import { Toaster } from "../ui/sonner";
import { useNavigate } from "react-router";
import { useStartupScan } from "@/context/startup-scan";

interface Props{
     children: React.ReactNode,
     className?: string
}
export function AppLayout({children, className}: Props){
     const cached = localStorage.getItem("clamav") as ClamAVState | null;
     const [status, setStatus] = useState<ClamAVState>(cached || "checking");
     const navigate = useNavigate();
     const [isLoading, startTransition] = useTransition();
     const startupScan = useStartupScan()
     const handleCheck = () => {
          startTransition(async() => {
               try{
                    const isAvailable = await invoke<boolean>("check_availability");
                    setStatus(isAvailable ? "available" : "missing");
                    localStorage.setItem("clamav",isAvailable ? "available" : "missing");
               } catch {
                    setStatus("missing");
                    localStorage.setItem("clamav","missing");
               }
          })
     }
     useEffect(() => {
          if (!startupScan) return;
          if (startupScan.isStartup && startupScan.scanType)
               navigate(`/scan/${startupScan.scanType}`, { replace: true });
     }, [startupScan]);
     return (
          <>
               {status==="checking" ? (
                    <SplashScreen/>
               ) : status==="missing" ? (
                    <NoClamAVPage
                         isPending={isLoading}
                         handleCheck={handleCheck}
                    />
               ) : startupScan?.isStartup ? (
                    <main className="py-2 w-full">
                         <div className={cn("w-full",className)}>
                              {children}
                         </div>
                    </main>
               ) : (
                    <SidebarProvider>
                         <MainSidebar/>
                         <main className="py-2 w-full">
                              <SidebarTrigger className="mx-2"/>
                              <div className={cn("w-full",className)}>
                                   {children}
                              </div>
                         </main>
                    </SidebarProvider>
               )}
               <Toaster
                    richColors
                    position="top-right"
                    duration={2000}
               />
          </>
     )
}