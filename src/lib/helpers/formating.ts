import { LangCode, suffixWhitelist } from "@/i18n/config";
import { TFunction } from "i18next";

export function formatBytes(bytes: number, t: TFunction<"translation">) {
  const sizes = [
    t("size-suffix.byte","Bytes"), 
    t("size-suffix.kb","KB"), 
    t("size-suffix.mb","MB"), 
    t("size-suffix.gb","GB"), 
    t("size-suffix.tb","TB")
  ];
  if (bytes === 0) return `0 ${sizes[0]}`;
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(seconds: number){
  const hh = Math.floor(seconds/3600).toString().padStart(2,"0");
  const mm = Math.floor((seconds%3600)/60).toString().padStart(2,"0");
  const ss = (seconds%60).toString().padStart(2,"0");
  return `${hh}:${mm}:${ss}`;
}

const formatSuffix = (text: string, locale: LangCode) => {
  const isInWhiteList = suffixWhitelist.has(locale);
  return !isInWhiteList ? ` ${text}` : text
}

export const formatNumber = (n: number,t: TFunction<"translation">, locale: LangCode): string => {
  if (n < 1e3) return String(n);
  if (n >= 1e3 && n < 1e6)
    return +(n / 1e3).toFixed(1) + formatSuffix(t("num-suffix.kilo"),locale);
  if (n >= 1e6 && n < 1e9)
    return +(n / 1e6).toFixed(1) + formatSuffix(t("num-suffix.million"),locale);
  if (n >= 1e9 && n < 1e12)
    return +(n / 1e9).toFixed(1) + formatSuffix(t("num-suffix.billion"),locale);
  return +(n / 1e12).toFixed(1) + formatSuffix(t("num-suffix.trillion"),locale);
}

export const capitalizeText = (cellValue: string) => `${cellValue.toUpperCase()[0]}${cellValue.slice(1)}`;