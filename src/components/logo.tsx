import { useTheme } from "@/context/themes"
import { useMemo } from "react";

interface Props{
     width: number,
     height: number
}
export default function Logo({width, height}: Props){
     const {resolvedTheme, color} = useTheme();
     const imgPath = useMemo(()=>{
          const isDark = resolvedTheme==="dark"
          return `/logo-${color}${isDark ? "-dark" : ""}.webp`.trim()
     },[resolvedTheme, color])
     return (
          <img
               src={imgPath}
               alt="ClamAV GUI"
               width={width}
               height={height}
               className="object-contain"
          />
     )
}