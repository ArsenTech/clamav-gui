import { useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleFlag } from 'react-circle-flags'
import { LangCode, languageOptions } from "./config";
import { invoke } from "@tauri-apps/api/core";

export default function LanguageSelector(){
     const [lang, setLang] = useState<LangCode>(i18next.language as LangCode);
     const {i18n} = useTranslation();
     const handleChangeLang = async(lang: LangCode) => {
          setLang(lang);
          i18next.changeLanguage(lang)
          await invoke("set_language",{ lang });
          await invoke("rebuild_tray")
     }
     useEffect(()=>{
          document.body.dir = i18n.dir()
     },[i18n, i18n.language])
     return (
          <Select
               value={lang}
               onValueChange={lang=>handleChangeLang(lang as LangCode)}
          >
               <SelectTrigger>
                    <SelectValue placeholder="Choose the GUI Language"/>
               </SelectTrigger>
               <SelectContent>
                    {languageOptions.map(({language, code, countryCode})=>(
                         <SelectItem key={code} value={code}>
                              <CircleFlag countryCode={countryCode} width={16} height={16}/>
                              {language}
                         </SelectItem>
                    ))}
               </SelectContent>
          </Select>
     )
}