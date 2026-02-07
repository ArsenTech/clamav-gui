import { SCAN_SETTINGS_GROUPED } from "@/lib/constants/settings/scan-options";
import { ScanOptionGroup } from "@/lib/types/settings";
import ExclusionsLoader from "@/components/loaders/exclusions";
import SettingsOptionLoader from "@/components/loaders/settings-options";
import SettingsItemLoader from "@/components/loaders/settings-item";

export default function ScanSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3 w-full">
               <SettingsItemLoader className="space-y-4">
                    <SettingsOptionLoader optionType="switch"/>
               </SettingsItemLoader>
               {Object.entries(SCAN_SETTINGS_GROUPED).filter(([key])=>key!=="advanced" as ScanOptionGroup).map(([key,options])=>(
                    <SettingsItemLoader key={key} className="space-y-4 w-full" noDescription>
                         {options.map(({optionKey,value})=>(
                              <SettingsOptionLoader key={optionKey} optionType={value.kind==="yes-no" ? "switch" : value.kind}/>
                         ))}
                    </SettingsItemLoader>
               ))}
               <ExclusionsLoader/>
          </div>
     )
}