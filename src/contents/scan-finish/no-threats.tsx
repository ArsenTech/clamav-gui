import { Button } from "@/components/ui/button";
import { getExitText } from "@/lib/helpers";
import { formatDuration } from "@/lib/helpers/formating";
import { IScanPageState } from "@/lib/types/states";
import { ShieldX, Timer, LogOut, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

interface Props{
     isStartup: boolean,
     scanState: IScanPageState
     handlePrimaryAction: () => void
}
export default function ScanFinishedContent({isStartup, handlePrimaryAction, scanState}: Props){
     const {errMsg,duration,exitCode} = scanState
     const hasErrors = useMemo(()=>!!errMsg && errMsg.trim()!=="",[errMsg])
     return (
          <>
               {hasErrors ? (
                    <ShieldX className="size-32 text-destructive"/>
               ) : (
                    <ShieldCheck className="size-32 text-emerald-700 dark:text-emerald-500"/>
               )}
               <h2 className="text-lg sm:text-xl md:text-2xl font-medium">{hasErrors ? "Scan Failed" : "No items detected!"}</h2>
               <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit"><Timer className="text-primary"/>{formatDuration(duration)}</h2>
               {errMsg && (
                    <p>{errMsg}</p>
               )}
               <Button onClick={handlePrimaryAction}>
                    {isStartup && <LogOut/>}
                    {isStartup ? "Close" : "Back to the overview"}
               </Button>
               <p className="text-muted-foreground">{getExitText(exitCode,"scan")}</p>
          </>
     )
}