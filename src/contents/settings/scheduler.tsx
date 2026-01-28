import SettingsItem from "@/components/settings-item";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
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
                    className="space-y-3"
               >
                    <Item variant="outline">
                         <ItemMedia variant="icon">
                              <Search/>
                         </ItemMedia>
                         <ItemContent>
                              <ItemTitle>On Scan Start</ItemTitle>
                              <ItemDescription>Notifies once the scan has been started</ItemDescription>
                         </ItemContent>
                    </Item>
                    <Item variant="outline">
                         <ItemMedia variant="icon">
                              <SearchCheck/>
                         </ItemMedia>
                         <ItemContent>
                              <ItemTitle>On Scan Finish</ItemTitle>
                              <ItemDescription>Notifies once the scan has been finished</ItemDescription>
                         </ItemContent>
                    </Item>
                    <Item variant="outline">
                         <ItemMedia variant="icon">
                              <ShieldCheck/>
                         </ItemMedia>
                         <ItemContent>
                              <ItemTitle>On Detection</ItemTitle>
                              <ItemDescription>Notifies once the new file has been detected with a malware</ItemDescription>
                         </ItemContent>
                    </Item>
               </SettingsItem>
          </div>
     )
}