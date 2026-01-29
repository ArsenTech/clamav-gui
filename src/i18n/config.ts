export type LangCode = "en" | "hy" | "ru"
type CountryCode = "us" | "am" | "ru"
type languageOption = { language: string; code: LangCode, countryCode: CountryCode };

export const languageOptions: languageOption[] = [
     { language: "English", code: "en", countryCode: "us"},
     { language: "Հայերեն", code: "hy", countryCode: "am"},
     { language: "Русский", code: "ru", countryCode: "ru"},
];