import { SPECIAL_THANKS } from "@/lib/constants";
import { Button } from "./ui/button";
import { openUrl } from "@tauri-apps/plugin-opener";
import { ScrollArea } from "./ui/scroll-area";
import { Trans, useTranslation } from "react-i18next";

export default function CreditsSection(){
     const {t} = useTranslation("credits");
     const creditsData = t("credits-data",{returnObjects: true})
     return (
          <ScrollArea className="max-h-[820px]">
               <div className="prose dark:prose-invert relative">
                    <div className="w-full sticky top-0 left-0 bg-background mt-0">
                         <h2 className="mt-0 text-2xl md:text-3xl font-medium border-b pb-1.5 w-fit border-primary/50">{t("titles")}</h2>
                    </div>
                    {Object.entries(creditsData).map(([key,{title,entries}])=>(
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
                         <p className="text-lg md:text-xl font-medium border-b w-fit pb-1 mb-1.5">{t("special-thanks.title")}</p>
                         <ul>
                              {SPECIAL_THANKS.map((person,i)=>(
                                   <li key={`person-${i+1}`}>
                                        <Button className="p-0 h-4 text-base" variant="link" onClick={()=>openUrl(person.link)}>
                                             {person.handle}
                                        </Button> - {t(`special-thanks.notes.${person.note}`)}
                                   </li>
                              ))}
                         </ul>
                    </div>
                    <p>{t("special-thanks.desc.line1")}</p>
                    <p><Trans
                         ns="credits"
                         i18nKey="special-thanks.desc.line2"
                         components={{
                              bold: <span className="font-semibold"/>
                         }}
                    /></p>
               </div>
          </ScrollArea>
     )
}