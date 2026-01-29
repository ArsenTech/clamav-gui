import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { languageOptions } from "./languages";

i18next.use(LanguageDetector).use(initReactI18next).use(Backend).init({
     returnObjects: true,
     fallbackLng: "en",
     debug: true,
     supportedLngs: languageOptions.map(val=>val.code)
});