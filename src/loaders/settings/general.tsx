import { DATE_TIME_FORMATS, THEME_SETTINGS } from "@/lib/settings"

export default function GeneralSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3">
               <div className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                    <div className="h-4 bg-accent rounded-md w-1/3"/>
                    <div className="h-4 sm:h-5 w-28 bg-accent rounded-md"/>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.theme.map(({theme})=>(
                              <div key={theme} className="h-32 min-w-32 flex-1 bg-accent rounded-md"/>
                         ))}
                    </div>
                    <div className="h-4 sm:h-5 w-28 bg-accent rounded-md"/>
                    <div className="flex justify-center items-center flex-wrap gap-3">
                         {THEME_SETTINGS.color.map(({name})=>(
                              <div key={name} className="h-32 min-w-32 flex-1 bg-accent rounded-md"/>
                         ))}
                    </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                         <div className="h-4 bg-accent rounded-md w-1/3"/>
                         <div className="space-y-2 w-full">
                              {DATE_TIME_FORMATS.map(({name,format})=>(
                                   <div key={`${name}-${format}`} className="h-[78px] bg-accent rounded-md w-full"/>
                              ))}
                         </div>
                    </div>
                    <div className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                         <div className="h-4 bg-accent rounded-md w-1/3"/>
                    </div>
               </div>
          </div>
     )
}