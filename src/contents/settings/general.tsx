import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useTheme } from "@/context/themes";
import { useSettings } from "@/context/settings";
import { DATE_TIME_FORMATS, DEFAULT_SETTINGS, THEME_SETTINGS } from "@/lib/settings";
import { capitalizeText } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Calendar, Palette, Bell, Search, SearchCheck } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {WindowIcon} from "@/components/app-icon";

const LanguageSelector = lazy(()=>import("@/i18n/languages"))

export default function GeneralSettings(){
     const {setTheme, theme: currTheme, setColor, color: currColor} = useTheme();
     const {setSettings, settings} = useSettings()
     const {t} = useTranslation("translation");
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
                    Icon={WindowIcon}
                    title="User Interface"
                    className="space-y-4"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Enable Scheduler UI</Label>
                              <p className="text-muted-foreground text-sm">Gives you an access to the Scheduler page</p>
                         </div>
                         <Switch
                              defaultChecked={settings.enableSchedulerUI || DEFAULT_SETTINGS.enableSchedulerUI}
                              checked={settings.enableSchedulerUI}
                              onCheckedChange={checked=>setSettings({enableSchedulerUI: checked})}
                         />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Language</Label>
                              <p className="text-muted-foreground text-sm">The Language of the ClamAV GUI. Text: {t("greeting")}</p>
                         </div>
                         <Suspense fallback={<Skeleton className="h-9 w-32"/>}>
                              <LanguageSelector/>
                         </Suspense>
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
                         <Switch
                              disabled={!settings.notifPermitted}
                              defaultChecked={settings.notifOnScanStart || DEFAULT_SETTINGS.notifOnScanStart}
                              checked={settings.notifOnScanStart}
                              onCheckedChange={checked=>setSettings({notifOnScanStart: checked})}
                         />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label className="flex items-center gap-2"><SearchCheck className="size-4"/> On Scan Finish</Label>
                              <p className="text-muted-foreground text-sm">Notifies once the scan has been finished</p>
                         </div>
                         <Switch
                              disabled={!settings.notifPermitted}
                              defaultChecked={settings.notifOnScanFinish || DEFAULT_SETTINGS.notifOnScanFinish}
                              checked={settings.notifOnScanFinish}
                              onCheckedChange={checked=>setSettings({notifOnScanFinish: checked})}
                         />
                    </div>
               </SettingsItem>
          </div>
     )
}