import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/main-sidebar";

interface Props{
     children: React.ReactNode
}
export function AppLayout({children}: Props){
     return (
          <SidebarProvider>
               <MainSidebar/>
               <main className="px-4 py-2">
                    <SidebarTrigger />
                    {children}
               </main>
          </SidebarProvider>
     )
}