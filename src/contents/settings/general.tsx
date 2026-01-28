import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useTheme } from "@/context/themes";
import useSettings from "@/hooks/use-settings";
import { DATE_TIME_FORMATS, DEFAULT_SETTINGS, MAX_LONG_LINES_CHOICES, THEME_SETTINGS } from "@/lib/settings";
import { capitalizeText } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Calendar, Languages, Palette, ScrollText } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GeneralSettings(){
     const {setTheme, theme: currTheme, setColor, color: currColor} = useTheme();
     const {setSettings, settings} = useSettings()
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Palette}
                    title="Appearance"
                    className="space-y-3"
               >
                    <p className="text-muted-foreground font-semibold">Theme</p>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.theme.map(({theme, name, Icon})=>(
                              <div key={theme} className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-primary hover:cursor-pointer transition-all",currTheme===theme ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setTheme(theme)}>
                                   <Icon className="size-16"/>
                                   <h2 className="text-lg font-medium">{name}</h2>
                              </div>
                         ))}
                    </div>
                    <p className="text-muted-foreground font-semibold">Color</p>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.color.map(({name, className, hoverClass})=>(
                              <div key={name} className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-blue-600 hover:cursor-pointer transition-all",currColor===name ? "border-primary bg-primary/10" : "border-border bg-card",hoverClass)} onClick={()=>setColor(name)}>
                                   <Palette className={cn("size-16",className)}/>
                                   <h2 className="text-lg font-medium">{capitalizeText(name)}</h2>
                              </div>
                         ))}
                    </div>
               </SettingsItem>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SettingsItem
                         Icon={Calendar}
                         title="Date Format"
                         className="space-y-2"
                    >
                         {DATE_TIME_FORMATS.map(({format,name})=>(
                              <Item
                                   key={`${name}-${format}`}
                                   variant={settings.dateFormat===format ? "muted" : "outline"}
                                   onClick={()=>setSettings({dateFormat: format})}
                              >
                                   <ItemContent>
                                        <ItemTitle>{name}</ItemTitle>
                                        <ItemDescription>{format}</ItemDescription>
                                   </ItemContent>
                              </Item>
                         ))}
                    </SettingsItem>
                    <SettingsItem
                         Icon={Languages}
                         title="Language"
                    >
                         TODO: Implement i18n support
                    </SettingsItem>
               </div>
               <SettingsItem
                    Icon={ScrollText}
                    title="Logs and UI"
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
          </div>
     )
}