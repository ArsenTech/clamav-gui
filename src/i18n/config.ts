export type LangCode = "en" | "hy" | "ru"
type CountryCode = "us" | "am" | "ru"
type languageOption = { language: string; code: LangCode, countryCode: CountryCode };
import {enUS,hy,ru, type Locale} from "date-fns/locale"

export const languageOptions: languageOption[] = [
     { language: "English", code: "en", countryCode: "us"},
     { language: "Հայերեն", code: "hy", countryCode: "am"},
     { language: "Русский", code: "ru", countryCode: "ru"},
];

export const dateFnsLanguages: Record<LangCode,Locale> = {
     en: enUS,
     hy, ru
}

export const suffixWhitelist: Set<LangCode> = new Set(["en"])