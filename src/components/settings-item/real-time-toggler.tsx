import { useSettings } from "@/context/settings";
import { Switch } from "../ui/switch";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { useRealtimeScan } from "@/context/real-time";

export function RealTimeToggle(){
     const { settings, setSettings } = useSettings();
     const {start, stop} = useRealtimeScan()
     const onToggle = async (enabled: boolean) => {
          setSettings({realTime: enabled})
          if (enabled) {
               await start();
          } else {
               await stop();
          }
     };
     return (
          <Switch
               defaultChecked={settings.realTime || DEFAULT_SETTINGS.realTime}
               checked={settings.realTime}
               onCheckedChange={onToggle}
          />
     )
}