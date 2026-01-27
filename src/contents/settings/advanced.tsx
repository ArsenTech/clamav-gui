import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SCAN_SETTINGS } from "@/lib/settings/custom-scan-options";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"
import useSettings from "@/hooks/use-settings";
import { DEFAULT_SETTINGS, SCAN_OPTION_TITLE } from "@/lib/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Braces } from "lucide-react";

export default function AdvancedSettings(){
     const {settings, setSettings} = useSettings();
     return (
          <div className="px-1 py-2 space-y-3">
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><Braces className="size-5"/> Advanced GUI Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
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
                         </div>
                    </CardContent>
               </Card>
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              {SCAN_OPTION_TITLE.advanced.icon}
                              {SCAN_OPTION_TITLE.advanced.title}
                         </CardTitle>
                         <CardDescription>Advanced options for the Custom Scan. It may reduce detection accuracy</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
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
                         </div>
                    </CardContent>
               </Card>
          </div>
     )
}