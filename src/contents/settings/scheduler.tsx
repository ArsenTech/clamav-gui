import SettingsItem from "@/components/settings-item";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, ClipboardClock, Search, SearchCheck, ShieldCheck } from "lucide-react";

export default function SchedulerSettings(){
     return (
          <div className="px-1 py-2 space-y-3">
               <SettingsItem
                    Icon={ClipboardClock}
                    title="Scheduler Settings"
               >
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label>Enable Scheduler UI</Label>
                              <p className="text-muted-foreground text-sm">Gives you an access to the scan scheduler</p>
                         </div>
                         <Switch />
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
                         <Switch />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label className="flex items-center gap-2"><SearchCheck className="size-4"/> On Scan Finish</Label>
                              <p className="text-muted-foreground text-sm">Notifies once the scan has been finished</p>
                         </div>
                         <Switch />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                              <Label className="flex items-center gap-2"><ShieldCheck className="size-4"/> On Detection</Label>
                              <p className="text-muted-foreground text-sm">Notifies once the new file has been detected with a malware</p>
                         </div>
                         <Switch />
                    </div>
               </SettingsItem>
          </div>
     )
}