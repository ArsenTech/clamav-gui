import { useTheme } from "@/context/themes";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Palette, Sun } from "lucide-react";

export default function GeneralSettings(){
     const {setTheme, theme, setColor, color} = useTheme()
     return (
          <div className="px-1 py-2 space-y-3">
               <h2 className="text-lg sm:text-xl font-semibold">Theme</h2>
               <div className="flex justify-center items-center flex-wrap gap-3">
                    <div className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-primary hover:cursor-pointer transition-all",theme==="system" ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setTheme("system")}>
                         <Monitor className="size-16"/>
                         <h2 className="text-lg font-medium">System</h2>
                    </div>
                    <div className={cn("bext-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-primary hover:cursor-pointer transition-all",theme==="light" ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setTheme("light")}>
                         <Sun className="size-16"/>
                         <h2 className="text-lg font-medium">Light</h2>
                    </div>
                    <div className={cn("text-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-primary hover:cursor-pointer transition-all",theme==="dark" ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setTheme("dark")}>
                         <Moon className="size-16"/>
                         <h2 className="text-lg font-medium">Dark</h2>
                    </div>
               </div>
               <h2 className="text-lg sm:text-xl font-semibold">Color</h2>
               <div className="flex justify-center items-center flex-wrap gap-3">
                    <div className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-blue-600 hover:cursor-pointer transition-all",color==="blue" ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setColor("blue")}>
                         <Palette className="size-16 text-blue-600 dark:text-blue-400"/>
                         <h2 className="text-lg font-medium">Blue</h2>
                    </div>
                    <div className={cn("bext-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-green-600 hover:cursor-pointer transition-all",color==="green" ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setColor("green")}>
                         <Palette className="size-16 text-green-600 dark:text-green-400"/>
                         <h2 className="text-lg font-medium">Green</h2>
                    </div>
                    <div className={cn("text-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-rose-600 hover:cursor-pointer transition-all",color==="rose" ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setColor("rose")}>
                         <Palette className="size-16 text-rose-600 dark:text-rose-400"/>
                         <h2 className="text-lg font-medium">Rose</h2>
                    </div>
               </div>
          </div>
     )
}