import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/main-sidebar";
import { cn } from "@/lib/utils";
// TODO: Add that page once `where clamscan` returns ""
// import NoClamAVPage from "@/pages/no-clamav";

interface Props{
     children: React.ReactNode,
     className?: string
}
export function AppLayout({children, className}: Props){
     return (
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
}