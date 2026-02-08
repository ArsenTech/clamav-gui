import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SIDEBAR_FOOTER_LINKS, SIDEBAR_LINKS } from "@/lib/constants/links";
import { Link, useLocation } from "react-router"
import Logo from "./logo";
import { useMemo } from "react";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";

export default function MainSidebar(){
     const location = useLocation();
     const {settings} = useSettings();
     const sidebarLinks = useMemo(()=>!settings.enableSchedulerUI ? SIDEBAR_LINKS.filter(val=>val.href!=="/scheduler") : SIDEBAR_LINKS,[settings.enableSchedulerUI])
     const {t} = useTranslation();
     return (
          <Sidebar>
               <SidebarHeader>
                    <Logo width={1500} height={400}/>
               </SidebarHeader>
               <SidebarContent>
                    <SidebarGroup>
                         <SidebarMenu>
                              {sidebarLinks.map(({Icon,name,href},i)=>(
                                   <SidebarMenuItem key={`${name}-${i}`}>
                                        <SidebarMenuButton isActive={location.pathname===href} asChild>
                                             <Link to={href} className="text-muted-foreground"><Icon className="text-primary dark:text-accent-foreground"/> {t(`sidebar.${name}`)}</Link>
                                        </SidebarMenuButton>
                                   </SidebarMenuItem>
                              ))}
                         </SidebarMenu>
                    </SidebarGroup>
               </SidebarContent>
               <SidebarFooter>
                    <SidebarGroup>
                         <SidebarMenu>
                              {SIDEBAR_FOOTER_LINKS.map(({Icon,name,href},i)=>(
                                   <SidebarMenuButton isActive={location.pathname===href} asChild key={`${name}-${i}`}>
                                        <Link to={href} className="text-muted-foreground"><Icon className="text-primary dark:text-accent-foreground"/> {t(`sidebar.${name}`)}</Link>
                                   </SidebarMenuButton>
                              ))}
                         </SidebarMenu>
                    </SidebarGroup>
               </SidebarFooter>
          </Sidebar>
     )
}