import { SCAN_SETTINGS } from "@/lib/settings/custom-scan-options";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"
import useSettings from "@/hooks/use-settings";
import { DEFAULT_SETTINGS, SCAN_OPTION_TITLE } from "@/lib/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Braces, FlaskConical, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import SettingsItem from "@/components/settings-item";

export default function AdvancedSettings(){
     const {settings, setSettings} = useSettings();
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
                         <Select>
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
                                   />
                              )}
                         </div>
                    ))}
               </SettingsItem>
          </div>
     )
}