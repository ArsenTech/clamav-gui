import { UPDATE_EXIT_CODE_MSG } from "../constants";
import { SCAN_EXIT_CODE_MSG } from "../constants";
import { FILE_SCAN_WHITELIST } from "../settings";
import { SCAN_SETTINGS } from "../settings/custom-scan-options";
import { HistoryStatus, ThreatStatus } from "../types";
import { ScanProfileValues } from "../types/settings";

export function formatBytes(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

export function pickKeys<T extends object, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
  const out = {} as Pick<T, K[number]>
  for (const key of keys)
    if (key in obj)
      out[key] = obj[key];
  return out;
}

export function formatDuration(seconds: number){
  const hh = Math.floor(seconds/3600).toString().padStart(2,"0");
  const mm = Math.floor((seconds%3600)/60).toString().padStart(2,"0");
  const ss = (seconds%60).toString().padStart(2,"0");
  return `${hh}:${mm}:${ss}`;
}

export function normalizePaths(
  value: string | string[] | null
): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseClamVersion(raw: string) {
  const match = raw.match(/ClamAV\s(.+?)\/(\d+)\/(.+)/);
  if (!match) return null;

  const dbDate = new Date(match[3]);

  const ageDays =
    (Date.now() - dbDate.getTime()) / (1000 * 60 * 60 * 24);

  return {
    engine: match[1],
    dbVersion: match[2],
    dbDate,
    isOutdated: ageDays > 7,
  };
}

export const capitalizeText = (cellValue: string) => `${cellValue.toUpperCase()[0]}${cellValue.slice(1)}`;

export function getThreatStatusBadges(cellValue: ThreatStatus) {
  return cellValue ==="deleted" ? "default" :
    cellValue === "detected" ? "destructive" : "outline"
}

export function getHistoryStatusBadges(cellValue: HistoryStatus) {
  return cellValue === "warning" ? "warning" : 
    cellValue === "error" ? "destructive" :
    cellValue==="success" ? "success" : "outline";
}
export const getExitText = (exitCode: number, type: "scan" | "update") => {
  const exitMsgs: Record<number,string> = type==="scan" ? SCAN_EXIT_CODE_MSG : UPDATE_EXIT_CODE_MSG;
  const fallbackMsg = type==="scan" ? "Scan failed due to an internal error" : "Update Failed"
  const msg = exitMsgs[exitCode] ?? fallbackMsg
  return `${msg} (Exit Code: ${exitCode})`
}
export function hydrateProfile(profile: ScanProfileValues, isFile = false) {
  const whitelist = new Set(FILE_SCAN_WHITELIST)
  const result: ScanProfileValues = {};
  for (const key in SCAN_SETTINGS) {
    if(!whitelist.has(key) && isFile) continue;
    const opt = SCAN_SETTINGS[key];
    if (opt.value.default !== undefined) {
      result[key] = opt.value.default;
    }
  }
  return { ...result, ...profile };
}
export const formatNumber = (n: number): string => {
  if (n < 1e3) return String(n);
  if (n >= 1e3 && n < 1e6)
    return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9)
    return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12)
    return +(n / 1e9).toFixed(1) + "B";
  return +(n / 1e12).toFixed(1) + "T";
}