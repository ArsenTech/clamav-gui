import { UPDATE_EXIT_CODE_MSG, SCAN_EXIT_CODE_MSG } from "../constants/maps";
import { HistoryStatus, ThreatStatus } from "../types/data";

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
  const ageDays = (Date.now() - dbDate.getTime()) / (1000 * 60 * 60 * 24);
  return {
    engine: match[1],
    dbVersion: match[2],
    dbDate,
    isOutdated: ageDays > 7,
  };
}

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

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export function ObjectEntries<T extends object>(t: T): Entries<T>[] {
  return Object.entries(t) as any;
}