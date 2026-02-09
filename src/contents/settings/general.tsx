import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useTheme } from "@/context/themes";
import { useSettings } from "@/context/settings";
import { DATE_TIME_FORMATS, DEFAULT_SETTINGS, THEME_SETTINGS } from "@/lib/constants/settings";
import { cn } from "@/lib/utils";
import { Calendar, Palette, Bell } from "lucide-react";
import SettingsItem from "@/components/settings-item";
import { Switch } from "@/components/ui/switch";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {WindowIcon} from "@/components/app-icon";
import { useTranslation } from "react-i18next";
import SettingsOption from "@/components/settings-item/settings-option";

const LanguageSelector = lazy(()=>import("@/i18n/languages"))

export default function GeneralSettings(){
     const {setTheme, theme: currTheme, setColor, color: currColor} = useTheme();
     const {setSettings, settings} = useSettings();
     const {t} = useTranslation("settings")
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={Palette}
                    title={t("appearance.title")}
                    className="space-y-3"
               >
                    <p className="text-muted-foreground font-semibold">{t("appearance.theme.title")}</p>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.theme.map(({theme, Icon})=>(
                              <div key={theme} className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-primary hover:cursor-pointer transition-all",currTheme===theme ? "border-primary bg-primary/10" : "border-border bg-card")} onClick={()=>setTheme(theme)}>
                                   <Icon className="size-16"/>
                                   <h2 className="text-lg font-medium">
                                        {t(`appearance.theme.${theme}`)}
                                   </h2>
                              </div>
                         ))}
                    </div>
                    <p className="text-muted-foreground font-semibold">{t("appearance.color.title")}</p>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.color.map(({name, className, hoverClass})=>(
                              <div key={name} className={cn("bgxt-card-foreground rounded-md shadow-sm border p-4 flex justify-center items-center gap-2 flex-col h-32 min-w-32 flex-1 text-center hover:border-blue-600 hover:cursor-pointer transition-all",currColor===name ? "border-primary bg-primary/10" : "border-border bg-card",hoverClass)} onClick={()=>setColor(name)}>
                                   <Palette className={cn("size-16",className)}/>
                                   <h2 className="text-lg font-medium">
                                        {t(`appearance.color.${name}`)}
                                   </h2>
                              </div>
                         ))}
                    </div>
               </SettingsItem>
               <SettingsItem
                    Icon={Calendar}
                    title={t("date-format.title")}
                    className="space-y-2"
               >
                    {DATE_TIME_FORMATS.map(({format,type})=>(
                         <Item
                              key={`${type}-${format}`}
                              variant={settings.dateFormat===format ? "muted" : "outline"}
                              onClick={()=>setSettings({dateFormat: format})}
                         >
                              <ItemContent>
                                   <ItemTitle>
                                        {t(`date-format.${type}.title`)}
                                   </ItemTitle>
                                   <ItemDescription>
                                        {t(`date-format.${type}.format`)}
                                   </ItemDescription>
                              </ItemContent>
                         </Item>
                    ))}
               </SettingsItem>
               <SettingsItem
                    Icon={WindowIcon}
                    title={t("ui.title")}
                    className="space-y-4"
               >
                    <SettingsOption
                         title={t("ui.scheduler-ui.title")}
                         description={t("ui.scheduler-ui.desc")}
                    >
                         <Switch
                              defaultChecked={settings.enableSchedulerUI || DEFAULT_SETTINGS.enableSchedulerUI}
                              checked={settings.enableSchedulerUI}
                              onCheckedChange={checked=>setSettings({enableSchedulerUI: checked})}
                         />
                    </SettingsOption>
                    <SettingsOption
                         title={t("ui.language.title")}
                         description={t("ui.language.desc")}
                    >
                         <Suspense fallback={<Skeleton className="h-9 w-32"/>}>
                              <LanguageSelector/>
                         </Suspense>
                    </SettingsOption>
               </SettingsItem>
               <SettingsItem
                    Icon={Bell}
                    title={t("notifs.title")}
                    className="space-y-4"
               >
                    <SettingsOption
                         title={t("notifs.scan-start.title")}
                         description={t("notifs.scan-start.desc")}
                    >
                         <Switch
                              disabled={!settings.notifPermitted}
                              defaultChecked={settings.notifOnScanStart || DEFAULT_SETTINGS.notifOnScanStart}
                              checked={settings.notifOnScanStart}
                              onCheckedChange={checked=>setSettings({notifOnScanStart: checked})}
                         />
                    </SettingsOption>
                    <SettingsOption
                         title={t("notifs.scan-finish.title")}
                         description={t("notifs.scan-finish.desc")}
                    >
                         <Switch
                              disabled={!settings.notifPermitted}
                              defaultChecked={settings.notifOnScanFinish || DEFAULT_SETTINGS.notifOnScanFinish}
                              checked={settings.notifOnScanFinish}
                              onCheckedChange={checked=>setSettings({notifOnScanFinish: checked})}
                         />
                    </SettingsOption>
               </SettingsItem>
          </div>
     )
}