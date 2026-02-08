import { useTranslation } from "react-i18next";
import { dateFnsLanguages, LangCode } from "./config";
import { useMemo } from "react";

export function useLocale(){
     const {i18n} = useTranslation();
     const dateFns = useMemo(()=>dateFnsLanguages[i18n.language as LangCode],[i18n.language])
     return {
          locale: i18n.language as LangCode,
          dateFns
     }
}