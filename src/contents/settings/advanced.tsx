import { SCAN_SETTINGS } from "@/lib/settings/custom-scan-options";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"
import { useSettings } from "@/context/settings";
import { DEFAULT_SETTINGS, FILE_SCAN_WHITELIST, MAX_LONG_LINES_CHOICES, SCAN_OPTION_TITLE } from "@/lib/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Braces, FlaskConical, Scale, ScrollText, ShieldAlert, ShieldCheck } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { BehaviorMode } from "@/lib/types/settings";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanProfile } from "@/hooks/use-scan-profile";
import { SettingsProps } from "@/lib/types";
import { RealTimeToggle } from "@/components/settings-item/real-time-toggler";

export default function AdvancedSettings({scanProfile}: SettingsProps){
     const {settings, setSettings} = useSettings();
     const { values, setValue, isLoading } = useScanProfile(scanProfile);
     const visibleOptions = useMemo(()=>{
          const options = Object.entries(SCAN_SETTINGS).filter(([__dirname,option])=>option.group==="advanced")
          return scanProfile === "file" ? options.filter(([k]) =>FILE_SCAN_WHITELIST.includes(k)) : options;
     },[scanProfile])
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
                              <Label>Real-Time Scan</Label>
                              <p className="text-muted-foreground text-sm">Automatically scans files when they are created or modified.</p>
                         </div>
                         <RealTimeToggle/>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Behavior</Label>
                              <p className="text-muted-foreground text-sm">How the ClamAV GUI act in other cases?</p>
                         </div>
                         <Select
                              defaultValue={settings.behavior || DEFAULT_SETTINGS.behavior}
                              value={settings.behavior}
                              onValueChange={value=>setSettings({behavior: value as BehaviorMode})}
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
                    </div>
               </SettingsItem>
               <SettingsItem
                    Icon={ScrollText}
                    title="Logs"
                    className="space-y-4"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Auto-scroll text</Label>
                              <p className="text-muted-foreground text-sm">Scrolls the log automatically once the new log is added</p>
                         </div>
                         <Switch
                              defaultChecked={settings.autoScrollText || DEFAULT_SETTINGS.autoScrollText}
                              checked={settings.autoScrollText}
                              onCheckedChange={autoScrollText=>setSettings({autoScrollText})}
                         />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Max Log Lines</Label>
                              <p className="text-muted-foreground text-sm">Shows the log up to the mentioned maximum line count</p>
                         </div>
                         <Select
                              defaultValue={String(settings.maxLogLines || DEFAULT_SETTINGS.maxLogLines)}
                              onValueChange={lines=>setSettings({maxLogLines: parseInt(lines)})}
                         >
                              <SelectTrigger>
                                   <SelectValue placeholder="Select a max line count"/>
                              </SelectTrigger>
                              <SelectContent>
                                   {MAX_LONG_LINES_CHOICES.map(choice=>(
                                        <SelectItem key={choice} value={choice.toString()}>{choice} lines</SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>
               </SettingsItem>
               <SettingsItem
                    Icon={SCAN_OPTION_TITLE.advanced.Icon}
                    title={SCAN_OPTION_TITLE.advanced.title}
                    className="space-y-4"
                    description="Advanced options for the Custom Scan. It may reduce detection accuracy"
               >
                    {visibleOptions.map(([key,option])=>(
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