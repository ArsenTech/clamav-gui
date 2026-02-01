import { SCAN_SETTINGS_GROUPED } from "@/lib/settings/custom-scan-options";
import { ScanOptionGroup } from "@/lib/types/settings";

export default function ScanSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3 w-full">
               <div className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                    <div className="h-4 bg-accent rounded-md w-1/3"/>
                    <div className="h-3.5 bg-accent rounded-md w-1/2"/>
                    <div className="space-y-4">
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
                         <div className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-1 w-full">
                                   <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                   <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                              </div>
                              <div className="w-8 h-[18px] bg-accent rounded-md"/>
                         </div>
                    </div>
               </div>
               {Object.entries(SCAN_SETTINGS_GROUPED).filter(([key])=>key!=="advanced" as ScanOptionGroup).map(([key,options])=>(
                    <div key={key} className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                         <div className="h-4 bg-accent rounded-md w-1/3"/>
                         <div className="h-3.5 bg-accent rounded-md w-1/2"/>
                         <div className="space-y-4 w-full">
                              {options.map(({optionKey,value})=>(
                                   <div key={optionKey} className="flex flex-row items-center justify-between w-full">
                                        <div className="space-y-1 w-full">
                                             <div className="h-3.5 bg-accent rounded-md w-2/5"/>
                                             <div className="h-3.5 bg-accent rounded-md w-1/4"/>
                                        </div>
                                        {value.kind==="yes-no" ? (
                                             <div className="w-8 h-[18px] bg-accent rounded-md"/>
                                        ) : value.kind === "input" ? (
                                             <div className="w-1/3 h-9 bg-accent rounded-md"/>
                                        ) : (
                                             <div className="w-[192px] h-9 bg-accent rounded-md"/>
                                        )}
                                   </div>
                              ))}
                         </div>
                    </div>
               ))}
          </div>
     )
}