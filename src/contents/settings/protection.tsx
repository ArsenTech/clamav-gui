import SettingsItem from "@/components/settings-item";
import DirExclusionsItem from "@/components/settings-item/dir-exclusions";
import PuaExclusionsItem from "@/components/settings-item/pua-exclusions";
import { RealTimeToggle } from "@/components/settings-item/real-time-toggler";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import useClamd from "@/hooks/use-clamd";
import { useBackendSettings } from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS } from "@/lib/settings";
import { BackendSettings } from "@/lib/types/settings";
import { cn } from "@/lib/utils";
import ExclusionsLoader from "@/loaders/components/exclusions";
import { platform } from "@tauri-apps/plugin-os";
import { ArrowDownUp, CheckCircle, CirclePower, Power, Shield, XCircle } from "lucide-react";
import { useTransition, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function ProtectionSettings(){
     const [isFetching, startTransition] = useTransition()
     const {fetchBackendSettings, setBackendSettings} = useBackendSettings()
     const [exclusions, setExclusions] = useState<BackendSettings["exclusions"]>(DEFAULT_BACKEND_SETTINGS.exclusions);
     const { isActive, isBusy, start, shutdown, ping} = useClamd();
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const settings = await fetchBackendSettings("exclusions")
                    setExclusions(val=>!settings ? val : settings)
               } catch (err){
                    toast.error("Failed to fetch existing protection settings");
                    console.error(err)
               }
          })
     },[])
     const updateExclusions = async <K extends keyof BackendSettings["exclusions"]>(key: K, value: BackendSettings["exclusions"][K]) => {
          await setBackendSettings("exclusions",key,value);
          setExclusions(prev=>({...prev, [key]: value}))
     }
     const dirExclusions = useMemo(()=>!exclusions.directory ? DEFAULT_BACKEND_SETTINGS.exclusions.directory : exclusions.directory,[exclusions.directory]);
     const puaExclusions = useMemo(()=>!exclusions.puaCategory ? DEFAULT_BACKEND_SETTINGS.exclusions.puaCategory : exclusions.puaCategory,[exclusions.puaCategory]);
     const isWindows = platform()==="windows"
     const handleExclusionAction = async  <K extends keyof BackendSettings["exclusions"]>(value: string, key: K, action: "exclude" | "remove") => {
          let newArr: string[] = []
          if(key === "directory") {
               const {directory} = exclusions
               const mainArr = !directory ? DEFAULT_BACKEND_SETTINGS.exclusions.directory : directory
               newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          } else {
               const {puaCategory} = exclusions
               const mainArr = !puaCategory ? DEFAULT_BACKEND_SETTINGS.exclusions.puaCategory : puaCategory
               newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          }
          await updateExclusions(key,newArr);
          setExclusions(prev=>({
               ...prev,
               [key]: newArr
          }))
     }
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Shield}
                    title="Real Time Scan Settings"
                    className="space-y-4"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Real-Time Scan</Label>
                              <p className="text-muted-foreground text-sm">Scans the new file once it appeared</p>
                         </div>
                         <RealTimeToggle/>
                    </div>
                    {isWindows && (
                         <p className="text-sm text-muted-foreground">ClamD is not available on Windows. File protection will use on-demand scanning instead.</p>
                    )}
               </SettingsItem>
               {!isWindows && (
                    <SettingsItem
                         Icon={Shield}
                         title="ClamD (Daemon)"
                         className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                         <div className="flex flex-col flex-wrap justify-center items-center gap-3">
                              <ButtonGroup className="w-full">
                                   <Button className="flex-1" disabled={isBusy || isWindows} onClick={start}>{isBusy ? <Spinner/> : <Power/>} Start</Button>
                                   <Button variant="secondary" className="flex-1" disabled={isBusy || isWindows} onClick={shutdown}>{isBusy ? <Spinner/> : <CirclePower/>} Shutdown</Button>
                              </ButtonGroup>
                              <Button className="w-full" disabled={isBusy} onClick={ping}>{isBusy ? <Spinner/> : <ArrowDownUp/>} Ping</Button>
                         </div>
                         <div className="flex flex-col items-center justify-center gap-2">
                              <div className="flex items-center justify-center gap-2 w-full">
                                   {isActive === null ? (
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                   ) : isActive ? (
                                        <CheckCircle className="text-emerald-600 size-10" />
                                   ) : (
                                        <XCircle className="text-destructive size-10" />
                                   )}
                                   <span className={cn("text-3xl font-medium", isActive ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
                                        {isActive ? 'ClamD is Active!' : "ClamD is Inactive!"}
                                   </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                   {isActive ? "The ClamD (Daemon) is Active" : "Please start the ClamD to activate the real time deteciton alongside clamonacc"}
                              </p>
                         </div>
                    </SettingsItem>
               )}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isFetching ? (
                         <ExclusionsLoader items={dirExclusions.length}/>
                    ) : (
                         <DirExclusionsItem
                              data={dirExclusions}
                              onSubmit={values=>handleExclusionAction(values.path,"directory","exclude")}
                              onDelete={path=>handleExclusionAction(path,"directory","remove")}
                         />
                    )}
                    {isFetching ? (
                         <ExclusionsLoader items={puaExclusions.length}/>
                    ) : (
                         <PuaExclusionsItem
                              data={puaExclusions}
                              onSubmit={values=>handleExclusionAction(values.category,"puaCategory","exclude")}
                              onDelete={category=>handleExclusionAction(category,"puaCategory","remove")}
                         />
                    )}
               </div>
          </div>
     )
}