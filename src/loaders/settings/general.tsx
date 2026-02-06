import { DATE_TIME_FORMATS, THEME_SETTINGS } from "@/lib/settings"

export default function GeneralSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3 w-full">
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
                    <div className="space-y-4 w-full">
                         <div className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-1 w-full">
                                   <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                   <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                              </div>
                              <div className="w-8 h-[18px] bg-accent rounded-md"/>
                         </div>
                         <div className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-1 w-full">
                                   <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                   <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                              </div>
                              <div className="w-[105px] h-9 bg-accent rounded-md"/>
                         </div>
                         {/* <div className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-1 w-full">
                                   <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                   <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                              </div>
                              <div className="w-32 h-9 bg-accent rounded-md"/>
                         </div> */}
                    </div>
               </div>
               <div className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                    <div className="h-4 bg-accent rounded-md w-1/3"/>
                    <div className="space-y-4 w-full">
                         <div className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-1 w-full">
                                   <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                   <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                              </div>
                              <div className="w-8 h-[18px] bg-accent rounded-md"/>
                         </div>
                         <div className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-1 w-full">
                                   <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                   <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                              </div>
                              <div className="w-8 h-[18px] bg-accent rounded-md"/>
                         </div>
                    </div>
               </div>
          </div>
     )
}