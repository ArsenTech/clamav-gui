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

export default function MainSidebar(){
     const location = useLocation();
     return (
          <Sidebar>
               <SidebarHeader>
                    <img src="/logo-blue.webp" alt="ClamAV GUI" width={1500} height={400}/>
               </SidebarHeader>
               <SidebarContent>
                    <SidebarGroup>
                         <SidebarMenu>
                              {SIDEBAR_LINKS.map(({Icon,name,href},i)=>(
                                   <SidebarMenuItem key={`${name}-${i}`}>
                                        <SidebarMenuButton isActive={location.pathname===href} asChild>
                                             <Link to={href} className="text-muted-foreground"><Icon className="text-primary"/> {name}</Link>
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
                                        <Link to={href} className="text-muted-foreground"><Icon className="text-primary"/> {name}</Link>
                                   </SidebarMenuButton>
                              ))}
                         </SidebarMenu>
                    </SidebarGroup>
               </SidebarFooter>
          </Sidebar>
     )
}