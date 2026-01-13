import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Cog } from "lucide-react"
import { Link } from "react-router"

export default function MainSidebar(){
     return (
          <Sidebar>
               <SidebarHeader>
                    <img src="/logo-mark-red.webp" alt="ClamAV GUI" width={1500} height={400}/>
               </SidebarHeader>
               <SidebarContent>
                    <SidebarGroup />
                    <SidebarGroup />
               </SidebarContent>
               <SidebarFooter>
                    <SidebarMenuButton asChild>
                         <Link to="/"><Cog/> Settings</Link>
                    </SidebarMenuButton>
               </SidebarFooter>
          </Sidebar>
     )
}