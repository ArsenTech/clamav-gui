import Popup from "@/components/popup";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useSettings } from "@/context/settings";
import { useLocale } from "@/i18n/locale";
import { formatNumber } from "@/lib/helpers/formating";
import { ScanType } from "@/lib/types/enums";
import { IScanPageState } from "@/lib/types/states";
import { invoke } from "@tauri-apps/api/core";
import { exit } from "@tauri-apps/plugin-process";
import { Bug, Clock, Dot, Folder, SearchCheck, ShieldAlert, ShieldCheck, Square } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Props{
     scanState: IScanPageState,
     handleReset: () => void,
     isStartup: boolean
}
export default function ScanProcess({scanState, handleReset, isStartup}: Props){
     const navigate = useNavigate();
     const {settings} = useSettings();
     const {scanType, threats, currLocation, totalFiles, scannedFiles, paths} = scanState
     const [isOpen, setIsOpen] = useState(false);
     const {formatDate} = useSettings()
     const dateRef = useRef<Date>(new Date(Date.now()))
     const handleStopScan = async () => {
          if(settings.confirmStopScan) setIsOpen(false);
          handleReset();
          try {
               await invoke("stop_scan");
               if (isStartup){
                    await exit(0);
               } else {
                    navigate("/scan");
               }
          } catch (e){
               toast.error("Failed to stop the scan");
               console.error(e);
               navigate("/scan");
          }
     }
     const percentage = useMemo(()=>totalFiles>0 ? Math.min(100,Math.floor((scannedFiles/totalFiles)*100)) : 0,[scannedFiles,totalFiles]);
     const {t} = useTranslation("scan");
     const {locale} = useLocale();
     const {t: numSuffixTxt} = useTranslation()
     return (
          <>
               {scanType!==ScanType.None && (
                    <p className="text-muted-foreground font-medium">{t("scan-type.title",{
                         scanType: t(`scan-type.${scanType}.name`)
                    })}</p>
               )}
               {scanType!=="full" ? (
                    <>
                    <Progress value={percentage}/>
                    <p className="text-2xl font-semibold text-center flex justify-center items-center gap-1.5"><Spinner className="size-9 text-muted-foreground"/> {scannedFiles<=0 ? t("process.preparing") : t("process.percentage",{
                         percentage,
                         scanned: formatNumber(scannedFiles,numSuffixTxt,locale),
                         total: formatNumber(totalFiles,numSuffixTxt,locale)
                    })}</p>
                    </>
               ) : (
                    <>
                    <p className="text-2xl font-semibold text-center flex justify-center items-center gap-1.5"><Spinner className="size-9 text-muted-foreground"/> {scannedFiles<=0 ? t("process.preparing") : (
                         <>{t("process.scanning")} <Dot/> {t("process.files",{
                              scanned: formatNumber(scannedFiles,numSuffixTxt,locale)
                         })}</>
                    )}</p>
                    <p className="text-muted-foreground">{t("full-scan-warn")}</p>
                    </>
               )}
               <div className="flex justify-center items-center gap-2 flex-col">
                    {currLocation.trim() !== "" && (
                         <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit">
                                   <SearchCheck className="text-primary"/>
                                   {t("items.currently-scanned")}
                              </h2>
                              <code className="min-h-6 break-all">{currLocation}</code>
                         </div>
                    )}
                    {(paths && paths.length>0) && (
                         <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit">
                                   <Folder className="text-primary"/>
                                   {t("items.location")}
                              </h2>
                              <ul>
                                   {paths.map((path,i)=>(
                                        <li key={`location-${i+1}`} className="break-all font-mono">{path}</li>
                                   ))}
                              </ul>
                         </div>
                    )}
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit">
                              <Bug className="text-primary"/>
                              {t("items.findings")}
                         </h2>
                         <p className="flex items-center gap-2 min-h-6">
                              {threats.length<=0 ? <ShieldCheck className="text-emerald-700 dark:text-emerald-500"/> : <ShieldAlert className="text-destructive"/>}
                              {t("items.threat",{threats: threats.length})}
                         </p>
                    </div>
                    <div className="p-4 border bg-card text-card-foreground shadow-sm rounded-md w-full">
                         <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 border-b pb-0.5 mb-2 w-fit">
                              <Clock className="text-primary"/>
                              {t("items.start-time")}
                         </h2>
                         <code className="min-h-6">{formatDate(dateRef.current)}</code>
                    </div>
                    <Button className="flex-1" onClick={()=>settings.confirmStopScan ? setIsOpen(true) : handleStopScan()}><Square/> {t("stop-scan")}</Button>
               </div>
               <Popup
                    open={isOpen}
                    onOpen={setIsOpen}
                    title={t("confirmation.title.stop-scan",{scanName: scanType!=="" ? t(`scan-type.${scanType}.name`) : ""})}
                    description={t("confirmation.desc.stop-scan")}
                    submitTxt={t("confirmation.stop")}
                    closeText={t("confirmation.cancel")}
                    submitEvent={handleStopScan}
                    type="danger"
               />
          </>
     )
}