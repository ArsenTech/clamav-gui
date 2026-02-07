import SettingsItemLoader from "@/components/loaders/settings-item";
import SettingsOptionLoader from "@/components/loaders/settings-options";
import { SCAN_SETTINGS } from "@/lib/constants/settings/scan-options";

export default function AdvancedSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3 w-full">
               <SettingsItemLoader className="space-y-4">
                    <SettingsOptionLoader optionType="switch"/>
                    <SettingsOptionLoader optionType="switch"/>
                    <SettingsOptionLoader optionType="choice" width={140}/>
               </SettingsItemLoader>
               <SettingsItemLoader className="space-y-4" noDescription>
                    <SettingsOptionLoader optionType="switch"/>
                    <SettingsOptionLoader optionType="choice" width={105}/>
               </SettingsItemLoader>
               <SettingsItemLoader className="space-y-4 w-full">
                    {Object.entries(SCAN_SETTINGS).filter(([_,val])=>val.group==="advanced").map(([key,{value}])=>(
                         <SettingsOptionLoader
                              key={key}
                              optionType={value.kind==="yes-no" ? "switch" : value.kind}
                              width={120}
                         />
                    ))}
               </SettingsItemLoader>
          </div>
     )
}