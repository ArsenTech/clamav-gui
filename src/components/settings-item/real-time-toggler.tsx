import { useSettings } from "@/context/settings";
import { Switch } from "../ui/switch";
import { useRealtimeScan } from "@/context/antivirus/real-time";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlertBox from "../popup/alert";

export function RealTimeToggle(){
     const [isOpen, setIsOpen] = useState(false)
     const { settings, setSettings } = useSettings();
     const {start, stop} = useRealtimeScan()
     const handleToggle = async (enabled: boolean) => {
          if (enabled) {
               setSettings({ realTime: true });
               await start();
          } else {
               setIsOpen(true);
          }
     };
     const confirmDisable = async () => {
          setIsOpen(false);
          setSettings({ realTime: false });
          await stop();
     };
     const {t} = useTranslation("confirmation")
     return (
          <>
          <Switch
               checked={settings.realTime}
               onCheckedChange={handleToggle}
          />
          <AlertBox
               open={isOpen}
               setOpen={setIsOpen}
               title={t("real-time-scan.title")}
               description={t("real-time-scan.desc")}
               submitText={t("actions.turn-off")}
               submitEvent={confirmDisable}
               cancelText={t("actions.cancel")}
               type="danger"
          />
          </>
     )
}