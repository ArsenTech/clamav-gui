import { CREDIS_DATA, SPECIAL_THANKS } from "@/lib/constants/credits";
import { Button } from "./ui/button";
import { openUrl } from "@tauri-apps/plugin-opener";

export default function CreditsSection(){
     return (
          <div className="space-y-4 px-3 overflow-y-auto max-h-[800px]">
               <h2 className="text-2xl md:text-3xl font-medium border-b pb-1.5 w-fit border-primary/50">Credits</h2>
               {Object.entries(CREDIS_DATA).map(([key,{title,entries}])=>(
                    <div key={key} className="space-y-1">
                         <p className="text-lg md:text-xl font-medium border-b w-fit pb-1 mb-1.5">{title}</p>
                         <ul>
                              {entries.map((entry,i)=>(
                                   <li key={`${key}-${i+1}`}>
                                        {entry}
                                   </li>
                              ))}
                         </ul>
                    </div>
               ))}
               <div className="space-y-1">
                    <p className="text-lg md:text-xl font-medium border-b w-fit pb-1 mb-1.5">Special Thanks To</p>
                    <ul>
                         {SPECIAL_THANKS.map((person,i)=>(
                              <li key={`person-${i+1}`}>
                                   <Button className="p-0 h-3" variant="link" onClick={()=>openUrl(person.link)}>
                                        {person.handle}
                                   </Button> - {person.note}
                              </li>
                         ))}
                    </ul>
               </div>
               <p>Special thanks to users who tested pre-release versions and reported issues directly.</p>
               <p>Built with respect for users, privacy, and open-source software. <span className="font-semibold">Made by ArsenTech with love & trust</span></p>
          </div>
     )
}