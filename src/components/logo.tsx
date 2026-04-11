import { useTheme } from "@/context/themes"
import { useMemo } from "react";

interface Props{
     width: number,
     height: number,
     state?: "collapsed" | "expanded"
}
export default function Logo({width, height, state="expanded"}: Props){
     const {resolvedTheme, color} = useTheme();
     const imgPath = useMemo(()=>{
          const isDark = resolvedTheme==="dark"
          return state==="collapsed" ? `/icons/${color}.webp` : `/logo-${color}${isDark ? "-dark" : ""}.webp`.trim()
     },[resolvedTheme, color, state])
     return (
          <img
               src={imgPath}
               alt="ClamAV GUI"
               width={state==="collapsed" ? height : width}
               height={height}
               className="object-contain"
          />
     )
}