import { Button } from "@/components/ui/button";
import { INITIAL_UPDATE_STATE } from "@/lib/constants/states";
import { IUpdatePageState } from "@/lib/types/states";
import { cn } from "@/lib/utils";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { AlertCircle, BugOff, CheckCircle, RotateCcw, RotateCw, ScrollText } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { invoke } from "@tauri-apps/api/core";
import { getExitText, parseClamVersion } from "@/lib/helpers";
import { toast } from "sonner";
import SettingsItem from "@/components/settings-item";
import { relaunch } from "@tauri-apps/plugin-process";
import { GUIUpdaterStatus } from "@/lib/types";
import { UPDATER_TEXTS } from "@/lib/constants/links";
import { ButtonGroup } from "@/components/ui/button-group";
import Popup from "@/components/popup";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "markdown-to-jsx"
import { COMPONENTS } from "@/lib/constants/md-components";
import {check} from "@tauri-apps/plugin-updater"
import { Progress } from "@/components/ui/progress";

export default function UpdateSettings(){
     const [updateState, setUpdateState] = useState<IUpdatePageState>(INITIAL_UPDATE_STATE);
     const [isChecking, startChecking] = useTransition();
     const [isUpdating, startUpdating] = useTransition();
     const [clamAvVersion, setClamavVersion] = useState<string>(()=>localStorage.getItem("clamav-version") || "");
     const [guiUpdate, setGuiUpdate] = useState<{
          status: GUIUpdaterStatus,
          notes: string | null,
          newVersion: string | null,
          patchDate: Date | null,
          isOpenNotes: boolean,
          downloaded: number,
          total: number
     }>({
          status: "checking",
          notes: null,
          newVersion: null,
          patchDate: null,
          isOpenNotes: false,
          downloaded: 0,
          total: 0
     })
     const updateGuiUpdaterState = (overrides: Partial<typeof guiUpdate>) => setGuiUpdate(prev=>({...prev, ...overrides}))
     const setState = (overrides: Partial<IUpdatePageState>) => setUpdateState(prev=>({ ...prev, ...overrides }))
     const handleUpdate = async()=>{
          if (updateState.isUpdatingDefs) return;
          await invoke("update_definitions")
     }
     const updateVersions = (parsed: ReturnType<typeof parseClamVersion>) => {
          if(!parsed) return;
          const versionText = `ClamAV v${parsed.engine}, Database Version: ${parsed.dbVersion}`;
          localStorage.setItem("clamav-version", versionText);
          setClamavVersion(versionText);
     }
     const checkForUpdates = async () => {
          updateGuiUpdaterState({
               status: "checking",
               downloaded: 0,
               total: 0
          })
          startChecking(async()=>{
               try {
                    const update = await check();
                    if(update){
                         updateGuiUpdaterState({
                              status: "needs-update",
                              notes: !update.body ? null : update.body
                         })
                    } else {
                         updateGuiUpdaterState({
                              status: "updated",
                         })
                    }
               } catch (err){
                    console.error(err)
                    updateGuiUpdaterState({
                         status: "failed-check",
                    })
               }
          })
     }
     const updateGUI = () => {
          updateGuiUpdaterState({
               status: "updating",
               downloaded: 0,
               total: 0
          })
          startUpdating(async()=>{
               try {
                    const update = await check();
                    if(update){
                         let downloaded = 0, contentLength = 0;
                         await update.downloadAndInstall((event) => {
                              switch (event.event) {
                                   case 'Started':
                                        contentLength = event.data.contentLength || 0;
                                        updateGuiUpdaterState({
                                             total: contentLength,
                                             downloaded
                                        })
                                        break;
                                   case 'Progress':
                                        downloaded += event.data.chunkLength;
                                        updateGuiUpdaterState({
                                             total: contentLength,
                                             downloaded
                                        })
                                        break;
                                   case 'Finished':
                                        updateGuiUpdaterState({
                                             status: "completed"
                                        })
                                        break;
                              }
                         });
                    }
               } catch (err){
                    console.error(err)
                    updateGuiUpdaterState({
                         status: "failed-update",
                         total: 0,
                         downloaded: 0
                    })
               }
          })
     }
     const relaunchApp = async() => await relaunch();
     useEffect(()=>{
          checkForUpdates()
     },[])
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
                    } catch (e) {
                         toast.error("Failed to update definitions")
                         console.error(e)
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
     const updaterText = useMemo(()=>UPDATER_TEXTS[guiUpdate.status],[guiUpdate.status]);
     const currProgress = useMemo(()=>(guiUpdate.downloaded/guiUpdate.total)*100,[guiUpdate.downloaded,guiUpdate.total])
     return (
          <>
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={BugOff}
                    title="Definitions"
                    className="flex flex-col items-center gap-4"
               >
                    <div className="flex justify-center items-center gap-4">
                         <Icon className={cn("size-12",isRequired ? "text-destructive" : "text-emerald-600", (isUpdatingDefs || isInitializing) && "text-muted-foreground")}/>
                         <div className="text-center space-y-0.5">
                              <h2 className={cn("text-xl md:text-2xl lg:text-3xl xl:text-[32px] font-semibold",isRequired ? "text-red-900 dark:text-red-300" : (isUpdatingDefs || isInitializing) ? "text-muted-foreground" : "text-emerald-900 dark:text-emerald-300")}>
                                   {isUpdatingDefs ? "Updating definitions..." :
                                   isInitializing ? "Checking database status..." :
                                   isRequired ? "Update Required!" : "Up to date!"}
                              </h2>
                              {lastUpdated && (
                                   <p className="text-sm text-muted-foreground">Last Updated: {formatDistanceToNow(lastUpdated,{
                                        includeSeconds: true,
                                        addSuffix: true
                                   })}</p>
                              )}
                         </div>
                    </div>
                    <Button disabled={isUpdatingDefs} onClick={handleUpdate}>
                         <RotateCw className={cn(isUpdatingDefs && "animate-spin")}/>
                         {isUpdatingDefs ? "Updating..." : "Update Database"}
                    </Button>
                    {clamAvVersion.trim()!=="" && (
                         <p className="text-sm text-muted-foreground" title="Virus definition database version">{clamAvVersion}</p>
                    )}
                    {exitMsg!==null && (
                         <p className="text-sm text-muted-foreground">{getExitText(exitMsg,"update")}</p>
                    )}
               </SettingsItem>
               <SettingsItem
                    Icon={RotateCcw}
                    title="GUI Updater"
                    className="flex justify-center items-center gap-2 flex-col"
               >
                    <h2 className={cn(
                         "text-xl md:text-2xl lg:text-3xl font-semibold",
                         (guiUpdate.status==="failed-check" || guiUpdate.status==="failed-update") && "text-destructive",
                         (guiUpdate.status==="checking" || guiUpdate.status==="updating") && "text-muted-foreground"
                    )}>{updaterText.main}</h2>
                    <p className="text-muted-foreground">{updaterText.secondary}</p>
                    {guiUpdate.status==="needs-update" && (
                         <div className="flex items-center justify-center w-full max-w-md gap-3">
                              <span className="font-medium">{currProgress.toFixed(0)}%</span>
                              <Progress value={currProgress}/>
                         </div>
                    )}
                    {guiUpdate.status==="completed" ? (
                         <Button onClick={relaunchApp}><RotateCcw/> Relaunch</Button>
                    ) : guiUpdate.status==="needs-update" ? (
                         <ButtonGroup>
                              <Button disabled={isUpdating} onClick={updateGUI}>
                                   <RotateCw className={cn(isUpdating && "animate-spin")}/>
                                   {isUpdating ? "Updating..." : "Update"}
                              </Button>
                              <Button variant="secondary" size="icon" title="Notes" onClick={()=>updateGuiUpdaterState({isOpenNotes: true})}>
                                   <ScrollText/>
                              </Button>
                         </ButtonGroup>   
                    ) : (
                         <Button onClick={checkForUpdates} disabled={isChecking}>
                              <RotateCw className={cn(isChecking && "animate-spin")}/>
                              {isChecking ? "Checking..." : "Check for the Updates"}
                         </Button>
                    )}
               </SettingsItem>
          </div>
          <Popup
               open={guiUpdate.isOpenNotes}
               onOpen={isOpenNotes=>updateGuiUpdaterState({isOpenNotes})}
               title="New Version Notes"
               hideButtons
          >
               <ScrollArea className={cn(!!guiUpdate.notes && "h-[400px] md:h-[600px]")}>
                    {guiUpdate.notes ? (
                         <Markdown options={{
                              overrides: COMPONENTS
                         }} className="mt-2 prose prose-slate dark:prose-invert">
                              {guiUpdate.notes}
                         </Markdown>
                    ) : (
                         <p className="text-muted-foreground text-center">No release notes available.</p>
                    )}
               </ScrollArea>
          </Popup>
          </>
     )
}