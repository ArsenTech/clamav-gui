import SettingsItemLoader from "@/loaders/components/settings-item"
import SettingsOptionLoader from "@/loaders/components/settings-options"
import { DATE_TIME_FORMATS, THEME_SETTINGS } from "@/lib/constants/settings"

export default function GeneralSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3 w-full">
               <SettingsItemLoader noDescription>
                    <div className="h-4 sm:h-5 w-28 bg-muted rounded-md"/>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.theme.map(({theme})=>(
                              <div key={theme} className="h-32 min-w-32 flex-1 bg-muted rounded-md"/>
                         ))}
                    </div>
                    <div className="h-4 sm:h-5 w-28 bg-muted rounded-md"/>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.color.map(({name})=>(
                              <div key={name} className="h-32 min-w-32 flex-1 bg-muted rounded-md"/>
                         ))}
                    </div>
               </SettingsItemLoader>
               <SettingsItemLoader className="space-y-2 w-full" noDescription>
                    {DATE_TIME_FORMATS.map(({type,format})=>(
                         <div key={`${type}-${format}`} className="h-[78px] bg-muted rounded-md w-full"/>
                    ))}
               </SettingsItemLoader>
               <SettingsItemLoader className="space-y-4 w-full" noDescription>
                    <SettingsOptionLoader optionType="switch"/>
                    <SettingsOptionLoader optionType="choice" width={105}/>
                    <SettingsOptionLoader optionType="choice" width={133}/>
               </SettingsItemLoader>
               <SettingsItemLoader className="space-y-4 w-full" noDescription>
                    <SettingsOptionLoader optionType="switch"/>
                    <SettingsOptionLoader optionType="switch"/>
               </SettingsItemLoader>
          </div>
     )
}