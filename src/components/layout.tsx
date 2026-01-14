import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/main-sidebar";
import { cn } from "@/lib/utils";

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