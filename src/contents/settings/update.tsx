import { Button } from "@/components/ui/button";
import { INITIAL_DEF_UPDATE_STATE } from "@/lib/constants/states";
import { IDefsUpdaterState } from "@/lib/types/states";
import { cn } from "@/lib/utils";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { AlertCircle, BugOff, CheckCircle, RotateCcw, RotateCw, ScrollText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { invoke } from "@tauri-apps/api/core";
import { parseClamVersion } from "@/lib/helpers";
import { toast } from "sonner";
import SettingsItem from "@/components/settings-item";
import { ButtonGroup } from "@/components/ui/button-group";
import Popup from "@/components/popup";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "markdown-to-jsx"
import { COMPONENTS } from "@/lib/constants/md-components";
import { Progress } from "@/components/ui/progress";
import {useGuiUpdater} from "@/hooks/use-gui-updater";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n/locale";
import { IClamAvVersion } from "@/lib/types";

export default function UpdateSettings(){
     const [updateState, setUpdateState] = useState<IDefsUpdaterState>(INITIAL_DEF_UPDATE_STATE);
     const [clamAvVersion, setClamavVersion] = useState<IClamAvVersion|null>(()=>JSON.parse(localStorage.getItem("clamav-version") as string) || null);
     const {t} = useTranslation("update");
     const {dateFns} = useLocale();
     const setState = (overrides: Partial<IDefsUpdaterState>) => setUpdateState(prev=>({ ...prev, ...overrides }))
     const handleUpdateDefs = async()=>{
          if (updateState.isUpdatingDefs) return;
          await invoke("update_definitions")
     }
     const updateVersions = (parsed: ReturnType<typeof parseClamVersion>) => {
          if(!parsed) return;
          const version: IClamAvVersion = {
               engine: parsed.engine,
               dbVersion: parsed.dbVersion
          }
          localStorage.setItem("clamav-version", JSON.stringify(version));
          setClamavVersion(version);
     }
     useEffect(()=>{
          (async()=>{
               try{
                    const raw = await invoke<string>("get_clamav_version");
                    const parsed = parseClamVersion(raw);
                    if(!parsed) return;
                    const stored = localStorage.getItem("last-updated");
                    setState({
                         lastUpdated: stored
                              ? new Date(stored)
                              : parsed.dbDate ?? null,
                         isRequired: parsed.isOutdated,
                    });
                    updateVersions(parsed);
               } catch {
                    setState({
                         isRequired: true,
                    });
               }
          })()
     },[])
     const {t: messageTxt} = useTranslation("messages")
     useEffect(()=>{
          const unsubs: Promise<UnlistenFn>[] = [
               listen("freshclam:start",() => setState({
                    isUpdatingDefs: true
               })),
               listen("freshclam:error",()=>
                    setUpdateState(prev=>({
                         ...prev,
                         isRequired: true,
                         isUpdatingDefs: false
                    }))
               ),
               listen<number>("freshclam:done",async(e)=>{
                    try{
                         const now = new Date();
                         localStorage.setItem("last-updated", now.toISOString());
                         setState({
                              isRequired: false,
                              lastUpdated: now,
                              exitMsg: e.payload,
                              isUpdatingDefs: false,
                         });
                         const raw = await invoke<string>("get_clamav_version");
                         const parsed = parseClamVersion(raw);
                         updateVersions(parsed);
                    } catch (err) {
                         toast.error(messageTxt("def-update-error",{
                              description: String(err)
                         }))
                    }
               })
          ];
          return () => {
               Promise.all(unsubs).then(fns=>fns.forEach(fn=>fn()));
          }
     },[])
     const {isRequired, exitMsg, lastUpdated, isUpdatingDefs} = updateState
     const isInitializing = !lastUpdated && !isUpdatingDefs
     const Icon = (isUpdatingDefs || isInitializing) ? Spinner : !isRequired ? CheckCircle : AlertCircle;
     const {status, currProgress, relaunchApp, updateGUI, isChecking, isUpdating, setIsOpenNotes, isOpenNotes, notes, checkForUpdates} = useGuiUpdater()
     const exitCodes = t("definitions.exit-codes",{returnObjects: true});
     const definitionsText = useMemo(()=>isUpdatingDefs ? "updating" : isInitializing ? "checking" : isRequired ? "outdated" : "updated",[isUpdatingDefs,isInitializing,isRequired])
     return (
          <>
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={BugOff}
                    title={t("definitions.title")}
                    className="flex flex-col items-center gap-4"
               >
                    <div className="flex justify-center items-center gap-4">
                         <Icon className={cn("size-12",isRequired ? "text-destructive" : "text-emerald-600", (isUpdatingDefs || isInitializing) && "text-muted-foreground")}/>
                         <div className="text-center space-y-0.5">
                              <h2 className={cn(
                                   "text-xl md:text-2xl lg:text-3xl xl:text-[32px] font-semibold",
                                   isRequired ? "text-red-900 dark:text-red-300" :
                                   (isUpdatingDefs || isInitializing) ? "text-muted-foreground" :
                                   "text-emerald-900 dark:text-emerald-300")}
                              >{t(`definitions.status.${definitionsText}`)}</h2>
                              {lastUpdated && (
                                   <p className="text-sm text-muted-foreground">
                                        {t("definitions.last-updated",{
                                             date: formatDistanceToNow(lastUpdated,{
                                                  includeSeconds: true,
                                                  addSuffix: true,
                                                  locale: dateFns
                                             })
                                        })}
                                   </p>
                              )}
                         </div>
                    </div>
                    <Button disabled={isUpdatingDefs} onClick={handleUpdateDefs}>
                         <RotateCw className={cn(isUpdatingDefs && "animate-spin")}/>
                         {isUpdatingDefs ? t("definitions.update.pending") : t("definitions.update.original")}
                    </Button>
                    {clamAvVersion && (
                         <p className="text-sm text-muted-foreground" title={t("definitions.version")}>{t("definitions.clamav-version",{
                              engine: clamAvVersion.engine,
                              dbVersion: clamAvVersion.dbVersion
                         })}</p>
                    )}
                    {exitMsg!==null && (
                         <p className="text-sm text-muted-foreground">{exitCodes[exitMsg]}</p>
                    )}
               </SettingsItem>
               <SettingsItem
                    Icon={RotateCcw}
                    title={t("gui.title")}
                    className="flex justify-center items-center gap-2 flex-col"
               >
                    <h2 className={cn(
                         "text-xl md:text-2xl lg:text-3xl font-semibold",
                         (status==="failed-check" || status==="failed-update") && "text-destructive",
                         (status==="checking" || status==="updating") && "text-muted-foreground"
                    )}>{t(`gui.${status}.main`)}</h2>
                    <p className="text-muted-foreground">{t(`gui.${status}.secondary`)}</p>
                    {status==="needs-update" && (
                         <div className="flex items-center justify-center w-full max-w-md gap-3">
                              <span className="font-medium">{currProgress.toFixed(0)}%</span>
                              <Progress value={currProgress}/>
                         </div>
                    )}
                    {status==="completed" ? (
                         <Button onClick={relaunchApp}>
                              <RotateCcw/>
                              {t("gui.buttons.relaunch")}
                         </Button>
                    ) : status==="needs-update" ? (
                         <ButtonGroup>
                              <Button disabled={isUpdating} onClick={updateGUI}>
                                   <RotateCw className={cn(isUpdating && "animate-spin")}/>
                                   {isUpdating ? t("gui.buttons.update.pending") : t("gui.buttons.update.original")}
                              </Button>
                              <Button variant="secondary" size="icon" title={t("notes.button-text")} onClick={()=>setIsOpenNotes(true)}>
                                   <ScrollText/>
                              </Button>
                         </ButtonGroup>   
                    ) : (
                         <Button onClick={checkForUpdates} disabled={isChecking}>
                              <RotateCw className={cn(isChecking && "animate-spin")}/>
                              {isChecking ? t("gui.buttons.check.pending") : t("gui.buttons.check.original")}
                         </Button>
                    )}
               </SettingsItem>
          </div>
          <Popup
               open={isOpenNotes}
               onOpen={setIsOpenNotes}
               title={t("notes.title")}
               hideButtons
          >
               <ScrollArea className={cn(!!notes && "h-[400px] md:h-[600px]")}>
                    {notes ? (
                         <Markdown options={{ overrides: COMPONENTS }} className="mt-2 prose prose-slate dark:prose-invert">
                              {notes}
                         </Markdown>
                    ) : (
                         <p className="text-muted-foreground text-center">{t("notes.no-notes")}</p>
                    )}
               </ScrollArea>
          </Popup>
          </>
     )
}