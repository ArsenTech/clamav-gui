import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useSettings from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS, DEFAULT_SETTINGS, SCAN_OPTION_TITLE } from "@/lib/settings";
import { SCAN_SETTINGS_GROUPED } from "@/lib/settings/custom-scan-options";
import { BackendSettings, ScanOptionGroup } from "@/lib/types/settings";
import { Search } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScanSettings(){
     const [isFetching, startTransition] = useTransition()
     const {settings, setSettings, fetchBackendSettings,setBackendSettings} = useSettings();
     const [scanSettings, setScanSettings] = useState<BackendSettings["scan"]>(DEFAULT_BACKEND_SETTINGS.scan)
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const settings = await fetchBackendSettings("scan")
                    setScanSettings(val=>!settings ? val : settings)
               } catch (err){
                    toast.error("Failed to fetch existing scan settings");
                    console.error(err)
               }
          })
     },[])
     const updateScanSettings = async <K extends keyof BackendSettings["scan"]>(key: K, value: BackendSettings["scan"][K]) => {
          await setBackendSettings("scan",key,value);
          setScanSettings(prev=>({...prev, [key]: value}))
     }
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Search}
                    title="Scan Settings"
                    className="space-y-4"
                    description="All of these settings are applied only on Main Scan, Custom Scan, and File Scan"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Confirm Stop</Label>
                              <p className="text-muted-foreground text-sm">Show a Confirm Message when you stop the scan.</p>
                         </div>
                         <Switch
                              defaultChecked={settings.confirmStopScan || DEFAULT_SETTINGS.confirmStopScan}
                              checked={settings.confirmStopScan}
                              onCheckedChange={checked=>setSettings({confirmStopScan: checked})}
                         />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Auto startup scan</Label>
                              <p className="text-muted-foreground text-sm">Scans files with a full scan on startup</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>
                         ) : (
                              <Switch
                                   defaultChecked={scanSettings.autoStartupScan || DEFAULT_BACKEND_SETTINGS.scan.autoStartupScan}
                                   checked={scanSettings.autoStartupScan}
                                   onCheckedChange={checked=>updateScanSettings("autoStartupScan",checked)}
                              />
                         )}
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Silent Scheduled Scans</Label>
                              <p className="text-muted-foreground text-sm">Starts the headless scheduled scan if checked</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-8 h-[18px]"/>
                         ) : (
                              <Switch
                                   defaultChecked={scanSettings.silentScheduledScans || DEFAULT_BACKEND_SETTINGS.scan.silentScheduledScans}
                                   checked={scanSettings.silentScheduledScans}
                                   onCheckedChange={checked=>updateScanSettings("silentScheduledScans",checked)}
                              />
                         )}
                    </div>
               </SettingsItem>
               {Object.entries(SCAN_SETTINGS_GROUPED).filter(([key])=>key!=="advanced" as ScanOptionGroup).map(([key,options])=>(
                    <SettingsItem
                         key={key}
                         Icon={SCAN_OPTION_TITLE[key as ScanOptionGroup].Icon}
                         title={SCAN_OPTION_TITLE[key as ScanOptionGroup].title}
                         className="space-y-4"
                    >
                         {options.map(option=>(
                              <div key={option.optionKey} className="flex flex-row items-center justify-between">
                                   <div className="space-y-1">
                                        <Label>{option.label}</Label>
                                        <p className="text-muted-foreground text-sm">{option.flag}</p>
                                   </div>
                                   {option.value.kind==="yes-no" ? (
                                        <Switch
                                             defaultChecked={option.value.default}
                                        />
                                   ) : option.value.kind==="choice" ? (
                                        <Select defaultValue={typeof option.value.default === "string" ? option.value.default : option.value.default?.toString()}>
                                             <SelectTrigger>
                                                  <SelectValue placeholder={option.label}/>
                                             </SelectTrigger>
                                             <SelectContent>
                                                  {option.value.choices.map(choice=>(
                                                       <SelectItem value={typeof choice.value==="string" ? choice.value : choice.value.toString()}>{choice.label}</SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                   ) : (
                                        <Input
                                             type={option.value.inputType==="number" ? "number" : "text"}
                                             min={option.value.min}
                                             max={option.value.max}
                                             className="max-w-1/3"
                                             defaultValue={option.value.default}
                                        />
                                   )}
                              </div>
                         ))}
                    </SettingsItem>
               ))}
          </div>
     )
}