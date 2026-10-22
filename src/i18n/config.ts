import * as DateFnsLocale from "date-fns/locale";

export type LangCode = "en" | "hy" | "ru" | "fr" | "pl" | "zh-CN"
type CountryCode = "us" | "am" | "ru" | "fr" | "pl" | "cn"
type languageOption = { language: string; code: LangCode, countryCode: CountryCode };

export const languageOptions: languageOption[] = [
     { language: "English", code: "en", countryCode: "us"},
     { language: "Français", code: "fr", countryCode: "fr"},
     { language: "Հայերեն", code: "hy", countryCode: "am"},
     { language: "Русский", code: "ru", countryCode: "ru"},
     { language: "Polski", code: "pl", countryCode: "pl" },
     { language: "中文", code: "zh-CN", countryCode: "cn" }
];

export const dateFnsLanguages: Record<LangCode,DateFnsLocale.Locale> = {
     en: DateFnsLocale.enUS,
     hy: DateFnsLocale.hy,
     ru: DateFnsLocale.ru,
     pl: DateFnsLocale.pl,
     fr: DateFnsLocale.fr,
     "zh-CN": DateFnsLocale.zhCN
}

export const suffixWhitelist: Set<LangCode> = new Set(["en"])