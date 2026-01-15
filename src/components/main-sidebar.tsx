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
} from "@/components/ui/sidebar"
import { ChartNoAxesCombined, ClipboardClock, Cog, Info, SearchCheck, History, ShieldCheck, BugOff } from "lucide-react"
import { Link, useLocation } from "react-router"

const sidebarLinks = [
     {
          name: "Overview",
          href: "/",
          Icon: ShieldCheck
     },
     {
          name: "Scan",
          href: "/scan",
          Icon: SearchCheck
     },
     {
          name: "Quarantine",
          href: "/quarantine",
          Icon: BugOff
     },
     {
          name: "History",
          href: "/history",
          Icon: History
     },
     {
          name: "Statistics",
          href: "/stats",
          Icon: ChartNoAxesCombined
     },
     {
          name: "Scheduler",
          href: "/scheduler",
          Icon: ClipboardClock
     },
]
const sidebarFooterLinks = [
     {
          name: "Settings",
          href: "/settings",
          Icon: Cog
     },
     {
          name: "About ClamAV GUI",
          href: "/about",
          Icon: Info
     }
]

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
                              {sidebarLinks.map(({Icon,name,href},i)=>(
                                   <SidebarMenuItem key={`${name}-${i}`}>
                                        <SidebarMenuButton isActive={location.pathname===href} asChild>
                                             <Link to={href} className="text-muted-foreground"><Icon className="text-primary"/> {name}</Link>
                                        </SidebarMenuButton>
                                        {name.toLowerCase()==="quarantine" && (
                                             <SidebarMenuBadge>0</SidebarMenuBadge>
                                        )}
                                   </SidebarMenuItem>
                              ))}
                         </SidebarMenu>
                    </SidebarGroup>
               </SidebarContent>
               <SidebarFooter>
                    <SidebarGroup>
                         <SidebarMenu>
                              {sidebarFooterLinks.map(({Icon,name,href},i)=>(
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