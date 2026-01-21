import { AppLayout } from "@/components/layout";
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

export default function UpdateDefinitions(){
     const [updateState, setUpdateState] = useState<IUpdatePageState>(INITIAL_UPDATE_STATE);
     const [clamavVersion, setClamavVersion] = useState<string | null>(
          localStorage.getItem("clamav-version")
     );
     const [exitMsg, setExitMsg] = useState<number | null>(null)
     const setState = (overrides: Partial<IUpdatePageState>) =>
          setUpdateState(prev=>({
               ...prev,
               ...overrides
          }))
     const handleUpdate = async () => {
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
          setState({ isFetching: true });
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
                         isFetching: false,
                    });
                    updateVersions(parsed)
               } catch {
                    setState({
                         isRequired: true,
                         isFetching: false
                    })
               }
          })()
     },[])
     useEffect(()=>{
          const unsubs: Promise<UnlistenFn>[] = [
               listen("freshclam:start",() => setState({
                    isUpdating: true,
                    log: []
               })),
               listen<string>("freshclam:output",e=>
                    setUpdateState(prev=>({
                         ...prev,
                         log: [
                              ...prev.log,
                              e.payload
                         ]
                    }))
               ),
               listen<string>("freshclam:error",e=>
                    setUpdateState(prev=>({
                         ...prev,
                         log: [
                              ...prev.log,
                              `ERROR: ${e.payload}`
                         ],
                         isUpdating: false,
                         isRequired: true
                    }))
               ),
               listen<number>("freshclam:done",async(e)=>{
                    try{
                         const now = new Date();
                         localStorage.setItem("last-updated", now.toISOString());
                         setState({
                              isRequired: false,
                              isUpdating: false,
                              lastUpdated: now,
                         });
                         setExitMsg(e.payload)
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
     const {isRequired, isFetching, isUpdating, log, lastUpdated} = updateState
     const Icon = (isUpdating || isFetching) ? Spinner : !isRequired ? CheckCircle : AlertCircle
     return (
          <AppLayout className="flex flex-col items-center justify-center gap-6 p-4">
               <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Definition Updater</h1>
                    <div className="flex flex-col items-center gap-4">
                         <div className="flex justify-center items-center gap-4">
                              <Icon className={cn("size-12",isRequired ? "text-destructive" : "text-emerald-600", (isUpdating || isFetching) && "text-muted-foreground")}/>
                              <div className="text-center space-y-0.5">
                                   <h2 className={cn("text-xl md:text-2xl lg:text-3xl xl:text-[32px] font-semibold",isRequired ? "text-red-900" : "text-emerald-900", (isUpdating || isFetching) && "text-muted-foreground")}>
                                        {isUpdating ? "Updating definitions..." :
                                        isFetching ? "Fetching the current version..." :
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
                         <Button disabled={isUpdating || isFetching} onClick={handleUpdate}>
                              {isFetching ? <Spinner/> : <RotateCw className={cn(isUpdating && "animate-spin")}/>}
                              {isFetching ? "Fetching..." : isUpdating ? "Updating..." : "Update Database"}
                         </Button>
                         {!!clamavVersion && (
                              <p className="text-sm text-muted-foreground" title="Virus definition database version">{clamavVersion}</p>
                         )}
                         {exitMsg!==null && (
                              <p className="text-sm text-muted-foreground">{getExitText(exitMsg,"update")}</p>
                         )}
                    </div>
               </div>
               <div className="space-y-3 px-3 text-lg overflow-y-auto max-h-[800px]">
                    <h2 className="text-2xl md:text-3xl font-medium border-b pb-2 w-fit">Log</h2>
                    <LogText logs={log}/>
               </div>
          </AppLayout>
     )
}