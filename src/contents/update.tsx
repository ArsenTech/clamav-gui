import LogText from "@/components/log";
import { Button } from "@/components/ui/button";
import { INITIAL_UPDATE_STATE } from "@/lib/constants/states";
import { IUpdatePageState } from "@/lib/types/states";
import { cn } from "@/lib/utils";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { AlertCircle, CheckCircle, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { invoke } from "@tauri-apps/api/core";
import { getExitText, parseClamVersion } from "@/lib/helpers";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSettings from "@/hooks/use-settings";

export default function UpdateContent(){
     const {settings} = useSettings()
     const [updateState, setUpdateState] = useState<IUpdatePageState>(INITIAL_UPDATE_STATE);
     const [clamAvVersion, setClamavVersion] = useState<string>(()=>localStorage.getItem("clamav-version") || "");
     const setState = (overrides: Partial<IUpdatePageState>) =>
          setUpdateState(prev=>({
               ...prev,
               ...overrides
          }))
     const handleUpdate = async()=>{
          if (updateState.isUpdating) return;
          await invoke("update_definitions")
     }
     const updateVersions = (parsed: ReturnType<typeof parseClamVersion>) => {
          if(!parsed) return;
          const versionText = `ClamAV v${parsed.engine}, Database Version: ${parsed.dbVersion}`;
          localStorage.setItem("clamav-version", versionText);
          setClamavVersion(versionText);
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
                    updateVersions(parsed)
               } catch {
                    setState({
                         isRequired: true,
                    })
               }
          })()
     },[])
     useEffect(()=>{
          const unsubs: Promise<UnlistenFn>[] = [
               listen("freshclam:start",() => setState({
                    log: [],
                    isUpdating: true
               })),
               listen<string>("freshclam:output",e=>
                    setUpdateState(prev=>({
                         ...prev,
                         log: [
                              ...prev.log.slice(-settings.maxLogLines),
                              e.payload
                         ],
                    }))
               ),
               listen<string>("freshclam:error",e=>
                    setUpdateState(prev=>({
                         ...prev,
                         log: [
                              ...prev.log.slice(-settings.maxLogLines),
                              `ERROR: ${e.payload}`
                         ],
                         isRequired: true,
                         isUpdating: false
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
                              isUpdating: false,
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
     const {isRequired, exitMsg, log, lastUpdated, isUpdating} = updateState
     const isInitializing = !lastUpdated && !isUpdating
     const Icon = (isUpdating || isInitializing) ? Spinner : !isRequired ? CheckCircle : AlertCircle
     return (
          <>
          <div className="space-y-4">
               <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Definition Updater</h1>
               <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center items-center gap-4">
                         <Icon className={cn("size-12",isRequired ? "text-destructive" : "text-emerald-600", (isUpdating || isInitializing) && "text-muted-foreground")}/>
                         <div className="text-center space-y-0.5">
                              <h2 className={cn("text-xl md:text-2xl lg:text-3xl xl:text-[32px] font-semibold",isRequired ? "text-red-900 dark:text-red-300" : (isUpdating || isInitializing) ? "text-muted-foreground" : "text-emerald-900 dark:text-emerald-300")}>
                                   {isUpdating ? "Updating definitions..." :
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
                    <Button disabled={isUpdating} onClick={handleUpdate}>
                         <RotateCw className={cn(isUpdating && "animate-spin")}/>
                         {isUpdating ? "Updating..." : "Update Database"}
                    </Button>
                    {clamAvVersion.trim()!=="" && (
                         <p className="text-sm text-muted-foreground" title="Virus definition database version">{clamAvVersion}</p>
                    )}
                    {exitMsg!==null && (
                         <p className="text-sm text-muted-foreground">{getExitText(exitMsg,"update")}</p>
                    )}
               </div>
          </div>
          <ScrollArea className="max-h-[800px]">
               <div className="space-y-3 px-3 text-lg">
                    <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                    <LogText logs={log}/>
               </div>
          </ScrollArea>
          </>
     )
}