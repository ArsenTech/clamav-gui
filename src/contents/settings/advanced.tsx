import { SCAN_SETTINGS } from "@/lib/settings/custom-scan-options";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"
import { useSettings, useBackendSettings } from "@/hooks/use-settings";
import { DEFAULT_BACKEND_SETTINGS, DEFAULT_SETTINGS, SCAN_OPTION_TITLE } from "@/lib/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Braces, FlaskConical, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { BackendSettings, BehaviorMode } from "@/lib/types/settings";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanProfile } from "@/hooks/use-scan-profile";

export default function AdvancedSettings(){
     const {settings, setSettings} = useSettings();
     const [isFetching, startTransition] = useTransition();
     const {fetchBackendSettings, setBackendSettings} = useBackendSettings()
     const { values, setValue, isLoading } = useScanProfile(settings.currScanProfile);
     const [advancedSettings, setAdvancedSettings] = useState<BackendSettings["advanced"]>(DEFAULT_BACKEND_SETTINGS.advanced)
     useEffect(()=>{
          startTransition(async()=>{
               try {
                    const settings = await fetchBackendSettings("advanced")
                    setAdvancedSettings(val=>!settings ? val : settings)
               } catch (err){
                    toast.error("Failed to fetch existing advanced settings");
                    console.error(err)
               }
          })
     },[])
     const updateAdvancedSettings = async <K extends keyof BackendSettings["advanced"]>(key: K, value: BackendSettings["advanced"][K]) => {
          await setBackendSettings("advanced",key,value);
          setAdvancedSettings(prev=>({...prev, [key]: value}))
     }
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Braces}
                    title="Advanced GUI Options"
                    className="space-y-4"
                    description="It may break some features and reduce detection accuracy"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Developer Mode</Label>
                              <p className="text-muted-foreground text-sm">Shows the ID on every data. Perfect for developers!</p>
                         </div>
                         <Switch
                              defaultChecked={settings.developerMode || DEFAULT_SETTINGS.developerMode}
                              checked={settings.developerMode}
                              onCheckedChange={checked=>setSettings({developerMode: checked})}
                         />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Behavior</Label>
                              <p className="text-muted-foreground text-sm">How the ClamAV GUI act in other cases?</p>
                         </div>
                         {isFetching ? (
                              <Skeleton className="w-32 h-9"/>
                         ) : (
                              <Select
                                   defaultValue={advancedSettings.behavior || DEFAULT_BACKEND_SETTINGS.advanced.behavior}
                                   value={advancedSettings.behavior}
                                   onValueChange={value=>updateAdvancedSettings("behavior",value as BehaviorMode)}
                              >
                                   <SelectTrigger>
                                        <SelectValue placeholder="ClamAV Behavior"/>
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="balanced"><Scale/> Balanced</SelectItem>
                                        <SelectItem value="safe"><ShieldCheck/> Safe</SelectItem>
                                        <SelectItem value="strict"><ShieldAlert/> Strict</SelectItem>
                                        <SelectItem value="expert"><FlaskConical/> Expert</SelectItem>
                                   </SelectContent>
                              </Select>
                         )}
                    </div>
               </SettingsItem>
               <SettingsItem
                    Icon={SCAN_OPTION_TITLE.advanced.Icon}
                    title={SCAN_OPTION_TITLE.advanced.title}
                    className="space-y-4"
                    description="Advanced options for the Custom Scan. It may reduce detection accuracy"
               >
                    {Object.entries(SCAN_SETTINGS).filter(([__dirname,option])=>option.group==="advanced").map(([key,option])=>(
                         <div key={key} className="flex flex-row items-center justify-between">
                              <div className="space-y-1">
                                   <Label>{option.label}</Label>
                                   <p className="text-muted-foreground text-sm">{option.flag}</p>
                              </div>
                              {option.value.kind==="yes-no" ? (
                                   isLoading ? (
                                        <Skeleton className="w-8 h-[18px]"/>
                                   ): (
                                        <Switch
                                             checked={(values[key] ?? option.value.default) as boolean}
                                             onCheckedChange={checked => setValue(key, checked)}
                                        />
                                   )
                              ) : option.value.kind==="choice" ? (
                                   isLoading ? (
                                        <Skeleton className="h-9 w-32"/>
                                   ) : (
                                        <Select
                                             value={String(values[key] ?? option.value.default)}
                                             onValueChange={val=>setValue(key, typeof option.value.default === "number" ? Number(val) : val)}
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
                                        value={(values[key] ?? option.value.default ?? "") as number}
                                        onChange={e =>setValue(key, Number(e.target.value))}
                                   />
                              )}
                         </div>
                    ))}
               </SettingsItem>
          </div>
     )
}