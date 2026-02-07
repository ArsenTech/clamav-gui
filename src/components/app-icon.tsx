import { platform } from "@tauri-apps/plugin-os";
import { AppWindow, AppWindowMac, LucideProps } from "lucide-react";
import { forwardRef, ForwardRefExoticComponent } from "react";

export const WindowIcon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> = forwardRef(props=>{
     const currentPlatform = platform();
     return currentPlatform==="macos" ? (
          <AppWindowMac {...props}/>
     ) : (
          <AppWindow {...props}/>
     )
})