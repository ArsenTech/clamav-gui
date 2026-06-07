import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { SIDEBAR_FOOTER_LINKS, SIDEBAR_LINKS } from "@/lib/constants/links";
import { Link, useLocation } from "react-router"
import Logo from "./logo";
import { useMemo } from "react";
import { useSettings } from "@/context/settings";
import { useTranslation } from "react-i18next";
import { SidebarLink } from "@/lib/types/enums";
import { useQuarantineCount } from "@/context/antivirus/quarantine-count";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainSidebar(){
     const location = useLocation();
     const {settings} = useSettings();
     const {quarantineCount} = useQuarantineCount()
     const sidebarLinks = useMemo(()=>!settings.enableSchedulerUI ? SIDEBAR_LINKS.filter(val=>val.href!=="/scheduler") : SIDEBAR_LINKS,[settings.enableSchedulerUI])
     const {t} = useTranslation();
     const {state} = useSidebar()
     const isMobile = useIsMobile()
     return (
          <Sidebar collapsible={settings.sidebarCollapsible}>
               <SidebarHeader>
                    <Logo
                         width={isMobile ? 370 : 240}
                         height={isMobile ? 100 : 64}
                         state={state}
                         collapsibleState={settings.sidebarCollapsible}
                    />
               </SidebarHeader>
               <SidebarContent>
                    <SidebarGroup>
                         <SidebarMenu>
                              {sidebarLinks.map(({Icon,name,href},i)=>(
                                   <SidebarMenuItem key={`${name}-${i}`}>
                                        <SidebarMenuButton isActive={location.pathname===href} asChild>
                                             <Link to={href} className="text-muted-foreground"><Icon className="text-primary dark:text-chart-1"/> {t(`sidebar.${name}`)}</Link>
                                        </SidebarMenuButton>
                                        {(name===SidebarLink.Quarantine && quarantineCount>0) && (
                                             <SidebarMenuBadge>{quarantineCount}</SidebarMenuBadge>
                                        )}
                                   </SidebarMenuItem>
                              ))}
                         </SidebarMenu>
                    </SidebarGroup>
               </SidebarContent>
               <SidebarFooter>
                    <SidebarMenu>
                         {SIDEBAR_FOOTER_LINKS.map(({Icon,name,href},i)=>(
                              <SidebarMenuButton isActive={location.pathname===href} asChild key={`${name}-${i}`}>
                                   <Link to={href} className="text-muted-foreground"><Icon className="text-primary dark:text-accent-foreground"/> {t(`sidebar.${name}`)}</Link>
                              </SidebarMenuButton>
                         ))}
                    </SidebarMenu>
               </SidebarFooter>
               <SidebarRail/>
          </Sidebar>
     )
}