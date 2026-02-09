import { lazy, Suspense, useEffect, useState, useTransition } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/main-sidebar";
import { cn } from "@/lib/utils";
import {invoke} from "@tauri-apps/api/core"
import SplashScreen from "./splash-screen";
import { ClamAVState } from "@/lib/types/enums";
import { Toaster } from "../ui/sonner";
import { useNavigate } from "react-router";
import { useStartupScan } from "@/context/startup-scan";
import { useSettings } from "@/context/settings";
import { isPermissionGranted, requestPermission, } from '@tauri-apps/plugin-notification';
import { listen, UnlistenFn } from "@tauri-apps/api/event";

const NoClamAVPage = lazy(()=>import("./no-clamav"));

interface Props{
     children: React.ReactNode,
     className?: string
}
export function AppLayout({children, className}: Props){
     const cached = localStorage.getItem("clamav") as ClamAVState | null;
     const [status, setStatus] = useState<ClamAVState>(cached || ClamAVState.Checking);
     const navigate = useNavigate();
     const [isLoading, startTransition] = useTransition();
     const {setSettings} = useSettings()
     const startupScan = useStartupScan()
     const handleCheck = () => {
          startTransition(async() => {
               try{
                    const isAvailable = await invoke<boolean>("check_availability");
                    const next: ClamAVState = isAvailable ? ClamAVState.Available : ClamAVState.Missing;
                    setStatus(next);
                    localStorage.setItem("clamav",next);
               } catch {
                    setStatus(ClamAVState.Missing);
                    localStorage.setItem("clamav","missing");
               }
          })
     }
     useEffect(() => {
          handleCheck();
          (async()=>{
               let permissionGranted = await isPermissionGranted();
               if(!permissionGranted){
                    const permission = await requestPermission();
                    permissionGranted = permission === 'granted';
               }
               setSettings({notifPermitted: permissionGranted})
          })()
     }, []);
     useEffect(() => {
          if (!startupScan) return;
          if (startupScan.isStartup && startupScan.scanType)
               navigate(`/scan/${startupScan.scanType}`, { replace: true });
     }, [startupScan]);
     useEffect(()=>{
          const listeners: Promise<UnlistenFn>[] = [
               listen<string>("systray:move",e=>navigate(encodeURI(e.payload)))
          ]
          return () => {
               Promise.all(listeners).then(fns=>fns.forEach(fn=>fn()))
          }
     },[])
     return (
          <>
               {status==="checking" ? (
                    <SplashScreen/>
               ) : status==="missing" ? (
                    <Suspense fallback={<SplashScreen/>}>
                         <NoClamAVPage
                              isPending={isLoading}
                              handleCheck={handleCheck}
                         />
                    </Suspense>
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