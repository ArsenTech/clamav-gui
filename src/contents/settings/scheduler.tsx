import SettingsItem from "@/components/settings-item";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { Bell, ClipboardClock, Search, SearchCheck } from "lucide-react";

export default function SchedulerSettings(){
     const {settings, setSettings} = useSettings();
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
                         <Switch
                              defaultChecked={settings.enableSchedulerUI || DEFAULT_SETTINGS.enableSchedulerUI}
                              checked={settings.enableSchedulerUI}
                              onCheckedChange={checked=>setSettings({enableSchedulerUI: checked})}
                         />
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