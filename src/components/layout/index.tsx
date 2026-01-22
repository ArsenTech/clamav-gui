import React, { useEffect, useState, useTransition } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/main-sidebar";
import { cn } from "@/lib/utils";
import {invoke} from "@tauri-apps/api/core"
import NoClamAVPage from "./no-clamav";
import SplashScreen from "./splash-screen";
import { ClamAVState } from "@/lib/types";
import { Toaster } from "../ui/sonner";

interface Props{
     children: React.ReactNode,
     className?: string
}
export function AppLayout({children, className}: Props){
     const cached = localStorage.getItem("clamav") as ClamAVState | null;
     const [status, setStatus] = useState<ClamAVState>(cached || "checking");
     const [isLoading, startTransition] = useTransition();
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
     useEffect(()=>{
          handleCheck();
     },[])
     const mainElem = status==="checking" ? (
          <SplashScreen/>
     ) : status==="missing" ? (
          <NoClamAVPage
               isPending={isLoading}
               handleCheck={handleCheck}
          />
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
     )
     return (
          <>
          {mainElem}
          <Toaster
               richColors
               position="top-right"
               duration={2000}
          />
          </>
     )
}