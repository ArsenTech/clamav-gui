import SettingsItem from "@/components/settings-item";
import DirExclusionsItem from "@/components/settings-item/dir-exclusions";
import PuaExclusionsItem from "@/components/settings-item/pua-exclusions";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import useSettings from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS } from "@/lib/settings";
import { BackendSettings } from "@/lib/types/settings";
import { cn } from "@/lib/utils";
import ExclusionsLoader from "@/loaders/components/exclusions";
import { ArrowDownUp, CheckCircle, CirclePower, Power, Shield, Square, Terminal, XCircle } from "lucide-react";
import { useTransition, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function ProtectionSettings(){
     const [isFetching, startTransition] = useTransition()
     const {fetchBackendSettings,setBackendSettings} = useSettings();
     const [protectionSettings, setProtectionSettings] = useState<BackendSettings["protection"]>(DEFAULT_BACKEND_SETTINGS.protection)
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const settings = await fetchBackendSettings("protection")
                    setProtectionSettings(val=>!settings ? val : settings)
               } catch (err){
                    toast.error("Failed to fetch existing protection settings");
                    console.error(err)
               }
          })
     },[])
     const updateProtectionSettings = async <K extends keyof BackendSettings["protection"]>(key: K, value: BackendSettings["protection"][K]) => {
          await setBackendSettings("protection",key,value);
          setProtectionSettings(prev=>({...prev, [key]: value}))
     }
     const handleExclusionAction = async(value: string, key: "dirExclusions" | "puaExclusions", action: "exclude" | "remove") => {
          let newArr: string[] = []
          if(key === "dirExclusions") {
               const {dirExclusions} = protectionSettings
               const mainArr = !dirExclusions ? DEFAULT_BACKEND_SETTINGS.protection.dirExclusions : dirExclusions
               newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          } else {
               const {puaExclusions} = protectionSettings
               const mainArr = !puaExclusions ? DEFAULT_BACKEND_SETTINGS.protection.puaExclusions : puaExclusions
               newArr = action==="exclude" ? [...mainArr,value] : mainArr.filter(val=>val!==value)
          }
          await updateProtectionSettings(key,newArr);
          setProtectionSettings(prev=>({
               ...prev,
               [key]: newArr
          }))
     }
     const isActive = true;
     const dirExclusions = useMemo(()=>!protectionSettings.dirExclusions ? DEFAULT_BACKEND_SETTINGS.protection.dirExclusions : protectionSettings.dirExclusions,[protectionSettings.dirExclusions]);
     const puaExclusions = useMemo(()=>!protectionSettings.puaExclusions ? DEFAULT_BACKEND_SETTINGS.protection.puaExclusions : protectionSettings.puaExclusions,[protectionSettings.puaExclusions])
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Shield}
                    title="Real Time Protection Settings"
                    className="space-y-4"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Real-Time Protection</Label>
                              <p className="text-muted-foreground text-sm">Scans the new file once it appeared</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>
                         ) : (
                              <Switch
                                   defaultChecked={protectionSettings.realTime || DEFAULT_BACKEND_SETTINGS.protection.realTime}
                                   checked={protectionSettings.realTime}
                                   onCheckedChange={checked=>updateProtectionSettings("realTime",checked)}
                              />
                         )}
                    </div>
               </SettingsItem>
               <SettingsItem
                    Icon={Shield}
                    title="ClamD (Daemon)"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
               >
                    <div className="flex flex-col flex-wrap justify-center items-center gap-3">
                         <ButtonGroup className="w-full">
                              <Button className="flex-1"><Power/> Start</Button>
                              <Button variant="secondary" className="flex-1"><Square/> Stop</Button>
                         </ButtonGroup>
                         <Button className="w-full"><Terminal/> Show Supported Commands</Button>
                         <ButtonGroup className="w-full">
                              <Button className="flex-1"><ArrowDownUp/> Ping</Button>
                              <Button className="flex-1" variant="secondary"><CirclePower/> Shutdown</Button>
                         </ButtonGroup>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                         <div className="flex items-center justify-center gap-2 w-full">
                              {isActive ? (
                                   <CheckCircle className="text-emerald-700 dark:text-emerald-400 size-10"/>
                              ) : (
                                   <XCircle className="text-destructive size-10"/>
                              )}
                              <span className={cn("text-3xl font-medium", isActive ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
                                   {isActive ? 'ClamD is Active!' : "ClamD is Inactive!"}
                              </span>
                         </div>
                         <p className="text-sm text-muted-foreground">
                              {isActive ? "The Direct Scan feature is Active" : "Please start the ClamD to activate the real time protection"}
                         </p>
                    </div>
               </SettingsItem>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isFetching ? (
                         <ExclusionsLoader items={dirExclusions.length}/>
                    ) : (
                         <DirExclusionsItem
                              data={dirExclusions}
                              onSubmit={values=>handleExclusionAction(values.path,"dirExclusions","exclude")}
                              onDelete={path=>handleExclusionAction(path,"dirExclusions","remove")}
                         />
                    )}
                    {isFetching ? (
                         <ExclusionsLoader items={puaExclusions.length}/>
                    ) : (
                         <PuaExclusionsItem
                              data={puaExclusions}
                              onSubmit={values=>handleExclusionAction(values.category,"puaExclusions","exclude")}
                              onDelete={category=>handleExclusionAction(category,"puaExclusions","remove")}
                         />
                    )}
               </div>
          </div>
     )
}