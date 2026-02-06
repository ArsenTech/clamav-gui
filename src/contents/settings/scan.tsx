import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/settings";
import { DEFAULT_BACKEND_SETTINGS, DEFAULT_SETTINGS, FILE_SCAN_WHITELIST, SCAN_OPTION_TITLE } from "@/lib/settings";
import { SCAN_SETTINGS_GROUPED } from "@/lib/settings/custom-scan-options";
import { BackendSettings, ScanOptionGroup } from "@/lib/types/settings";
import { Search } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanProfile } from "@/hooks/use-scan-profile";
import { SettingsProps } from "@/lib/types";
import { useBackendSettings } from "@/hooks/use-settings";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function ScanSettings({scanProfile}: SettingsProps){
     const {settings, setSettings} = useSettings();
     const { values, setValue, isLoading } = useScanProfile(scanProfile);
     const {fetchSettingsbySection, setSettingsbySection} = useBackendSettings();
     const [isFetching, startTransition] = useTransition();
     const [currSettings, setCurrSettings] = useState(DEFAULT_BACKEND_SETTINGS.scanSettings);
     useEffect(()=>{
          startTransition(async()=>{
               try{
                    const stored = await fetchSettingsbySection("scanSettings");
                    setCurrSettings(prev => !stored ? prev : ({
                         ...prev,
                         ...stored
                    }))
               } catch (e){
                    toast.error("Failed to fetch settings from backend");
                    console.error(e)
               }
          })
     },[])
     const updateState = async<K extends keyof BackendSettings["scanSettings"]>(key: K, value: BackendSettings["scanSettings"][K]) => {
          await setSettingsbySection("scanSettings",key,value);
          setCurrSettings(prev=>({
               ...prev,
               [key]: value
          }))
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
                                   checked={currSettings.autoStartupScan}
                                   onCheckedChange={checked=>updateState("autoStartupScan",checked)}
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
                                   checked={currSettings.silentScheduledScans}
                                   onCheckedChange={checked=>updateState("silentScheduledScans",checked)}
                              />
                         )}
                    </div>
               </SettingsItem>
               {Object.entries(SCAN_SETTINGS_GROUPED).filter(([key])=>key!=="advanced" as ScanOptionGroup).map(([key,options])=>{
                    const visibleOptions = scanProfile === "file" ? options.filter(o =>FILE_SCAN_WHITELIST.includes(o.optionKey)) : options;
                    return visibleOptions.length > 0 ? (
                         <SettingsItem
                              key={key}
                              Icon={SCAN_OPTION_TITLE[key as ScanOptionGroup].Icon}
                              title={SCAN_OPTION_TITLE[key as ScanOptionGroup].title}
                              className="space-y-4"
                         >
                              {visibleOptions.map(option=>(
                                   <div key={option.optionKey} className="flex flex-row items-center justify-between">
                                        <div className="space-y-1">
                                             <Label>{option.label}</Label>
                                             <p className="text-muted-foreground text-sm">{option.flag}</p>
                                        </div>
                                        {option.value.kind==="yes-no" ? (
                                             isLoading ? (
                                                  <Skeleton className="w-8 h-[18px]"/>
                                             ): (
                                                  <Switch
                                                       checked={(values[option.optionKey] ?? option.value.default) as boolean}
                                                       onCheckedChange={checked => setValue(option.optionKey, checked)}
                                                  />
                                             )
                                        ) : option.value.kind==="choice" ? (
                                             isLoading ? (
                                                  <Skeleton className="h-9 w-32"/>
                                             ) : (
                                                  <Select
                                                       value={String(values[option.optionKey] ?? option.value.default)}
                                                       onValueChange={val=>setValue(option.optionKey, typeof option.value.default === "number" ? Number(val) : val)}
                                                  >
                                                       <SelectTrigger>
                                                            <SelectValue placeholder={option.label}/>
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            {option.value.choices.map(choice=>(
                                                                 <SelectItem value={typeof choice.value==="string" ? choice.value : choice.value.toString()}>{choice.label}</SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             )
                                        ) : isLoading ? (
                                             <Skeleton className="w-1/3 h-9"/>
                                        ) : (
                                             <Input
                                                  type={option.value.inputType==="number" ? "number" : "text"}
                                                  min={option.value.min}
                                                  max={option.value.max}
                                                  className="max-w-1/3"
                                                  value={(values[option.optionKey] ?? option.value.default ?? "") as number}
                                                  onChange={e =>setValue(option.optionKey, Number(e.target.value))}
                                             />
                                        )}
                                   </div>
                              ))}
                         </SettingsItem>
                    ) : null})}
          </div>
     )
}