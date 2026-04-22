import { useTheme } from "@/context/themes"
import { SidebarCollapsible } from "@/lib/types/enums";
import { useMemo } from "react";

interface Props{
     width: number,
     height: number,
     state?: "collapsed" | "expanded",
     collapsibleState?: SidebarCollapsible
}
export default function Logo({
     width, height,
     state="expanded",
     collapsibleState=SidebarCollapsible.OffCanvas
}: Props){
     const {resolvedTheme, color} = useTheme();
     const isCollapsed = useMemo(()=>collapsibleState==="icon" && state==="collapsed",[collapsibleState,state])
     const imgPath = useMemo(()=>{
          const isDark = resolvedTheme==="dark"
          return isCollapsed ? `/icons/${color}.webp` : `/logo-${color}${isDark ? "-dark" : ""}.webp`.trim()
     },[resolvedTheme, color, state])
     return (
          <img
               src={imgPath}
               alt="ClamAV GUI"
               width={isCollapsed ? height : width}
               height={height}
               className="object-contain"
          />
     )
}