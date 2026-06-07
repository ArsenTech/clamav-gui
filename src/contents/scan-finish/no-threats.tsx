import { Button } from "@/components/ui/button";
import { useAntivirus } from "@/context/antivirus";
import useWindowTitle from "@/hooks/use-window-title";
import { formatDuration } from "@/lib/helpers/formating";
import { ShieldX, Timer, LogOut, ShieldCheck, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props{
     isStartup: boolean,
     handlePrimaryAction: () => void
}
export default function ScanFinishedContent({isStartup, handlePrimaryAction}: Props){
     const {scanState} = useAntivirus()
     const {errMsg, duration, exitCode} = scanState
     const isPartialScan = exitCode === 2;
     const hasErrors = !!errMsg && errMsg.trim() !== "";
     const {t} = useTranslation("scan");
     const exitCodes = t("exit-code",{returnObjects: true})
     const scanResultTitle = hasErrors
          ? t("finished.error")
          : isPartialScan
               ? t("finished.partial")
               : t("finished.no-threats");
     useWindowTitle(scanResultTitle)
     return (
          <>
               {hasErrors ? (
                    <ShieldX className="size-32 text-destructive"/>
               ) : isPartialScan ? (
                    <ShieldAlert className="size-32 text-amber-600 dark:text-amber-500"/>     
               ) : (
                    <ShieldCheck className="size-32 text-emerald-700 dark:text-emerald-500"/>
               )}
               <h2 className="text-lg sm:text-xl md:text-2xl font-medium">{scanResultTitle}</h2>
               <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2.5 w-fit">
                    <Timer className="text-primary"/>
                    {formatDuration(duration)}
               </h2>
               {errMsg && (
                    <p>{errMsg}</p>
               )}
               <Button onClick={handlePrimaryAction}>
                    <LogOut/>
                    {isStartup ? t("close") : t("back-to-overview")}
               </Button>
               <p className="text-muted-foreground">{t("exit-code-formatting",{
                    msg: exitCodes[exitCode] ?? t("exit-code-fallback"),
                    exitCode
               })}</p>
          </>
     )
}