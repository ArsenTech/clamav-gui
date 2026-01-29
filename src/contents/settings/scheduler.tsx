import SettingsItem from "@/components/settings-item";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import useSettings from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS } from "@/lib/settings";
import { BackendSettings } from "@/lib/types/settings";
import { Bell, ClipboardClock, Search, SearchCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function SchedulerSettings(){
     const [isFetching, startTransition] = useTransition()
     const {fetchBackendSettings, setBackendSettings} = useSettings();
     const [schedulerSettings, setSchedulerSettings] = useState<BackendSettings["scheduler"]>(DEFAULT_BACKEND_SETTINGS.scheduler);
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const settings = await fetchBackendSettings("scheduler")
                    setSchedulerSettings(val=>!settings ? val : settings)
               } catch (err){
                    toast.error("Failed to fetch existing scheduler settings");
                    console.error(err)
               }
          })
     },[])
     const updateSchedulerSettings = async <K extends keyof BackendSettings["scheduler"]>(key: K, value: BackendSettings["scheduler"][K]) => {
          await setBackendSettings("scheduler",key,value);
          setSchedulerSettings(prev=>({...prev, [key]: value}))
     }
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={ClipboardClock}
                    title="Scheduler Settings"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Enable Scheduler UI</Label>
                              <p className="text-muted-foreground text-sm">Gives you an access to the Scheduler page</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>     
                         ) : (
                              <Switch
                                   defaultChecked={schedulerSettings.enableSchedulerUI || DEFAULT_BACKEND_SETTINGS.scheduler.enableSchedulerUI}
                                   checked={schedulerSettings.enableSchedulerUI}
                                   onCheckedChange={checked=>updateSchedulerSettings("enableSchedulerUI",checked)}
                              />
                         )}
                    </div>
               </SettingsItem>
               <SettingsItem
                    Icon={Bell}
                    title="Notifications"
                    className="space-y-4"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label className="flex items-center gap-2"><Search className="size-4"/> On Scan Start</Label>
                              <p className="text-muted-foreground text-sm">Notifies once the scan has been started</p>
                         </div>
                         { isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>     
                         ): (
                              <Switch
                                   defaultChecked={schedulerSettings.notifOnScanStart || DEFAULT_BACKEND_SETTINGS.scheduler.notifOnScanStart}
                                   checked={schedulerSettings.notifOnScanStart}
                                   onCheckedChange={checked=>updateSchedulerSettings("notifOnScanStart",checked)}
                              />
                         )}
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label className="flex items-center gap-2"><SearchCheck className="size-4"/> On Scan Finish</Label>
                              <p className="text-muted-foreground text-sm">Notifies once the scan has been finished</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>     
                         ): (
                              <Switch
                                   defaultChecked={schedulerSettings.notifOnScanFinish || DEFAULT_BACKEND_SETTINGS.scheduler.notifOnScanFinish}
                                   checked={schedulerSettings.notifOnScanFinish}
                                   onCheckedChange={checked=>updateSchedulerSettings("notifOnScanFinish",checked)}
                              />
                         )}
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label className="flex items-center gap-2"><ShieldCheck className="size-4"/> On Detection</Label>
                              <p className="text-muted-foreground text-sm">Notifies once the new file has been detected with a malware</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>     
                         ): (
                              <Switch
                                   defaultChecked={schedulerSettings.notifOnDetection || DEFAULT_BACKEND_SETTINGS.scheduler.notifOnDetection }
                                   checked={schedulerSettings.notifOnDetection }
                                   onCheckedChange={checked=>updateSchedulerSettings("notifOnDetection",checked)}
                              />
                         )}
                    </div>
               </SettingsItem>
          </div>
     )
}