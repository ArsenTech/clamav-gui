import { Search, SearchCheck, FolderSearch, FileSearch, Bug, ClipboardClock, Cog, RotateCcw, ShieldCheck } from "lucide-react";
import { IHistoryData, IScanMenuItem } from "../types";

export const DAYS_OF_THE_WEEK = ["sun","mon","tue","wed","thu","fri","sat"] as const;

export const SCAN_TYPES: IScanMenuItem[] = [
     {
          type: "main",
          name: "Main Scan",
          desc: "Check common locations for malicious files",
          Icon: Search
     },
     {
          type: "full",
          name: "Full Scan",
          desc: "Scan everything inside this device (might take a while)",
          Icon: SearchCheck
     },
     {
          type: "custom",
          name: "Custom Scan",
          desc: "Choose a folder to scan",
          Icon: FolderSearch
     },
     {
          type: "file",
          name: "File Scan",
          desc: "Choose a file to scan",
          Icon: FileSearch
     }
]
export const SCAN_ENUM = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>val.type);
export const SCAN_OPTIONS = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>({
     value: val.type,
     content: val.name,
     icon: val.Icon
}))
export const LOG_ITEMS = [
     {name: "Scan", Icon: Search},
     {name: "Quarantine", Icon: Bug},
     {name: "Scheduler", Icon: ClipboardClock},
     {name: "Updates", Icon: RotateCcw},
     {name: "Real-Time Protection", Icon: ShieldCheck},
     {name: "Settings", Icon: Cog}
]
export const HISTORY_DATA: IHistoryData[] = [
     {
          id: "1",
          timestamp: "2026-01-01",
          action: "Scan",
          details: "Scan finished. No infected files",
          status: "error"
     },
     {
          id: "2",
          timestamp: "2026-01-02",
          action: "Config",
          details: "Config initialized successfully",
          status: "success"
     },
     {
          id: "3",
          timestamp: "2026-01-03",
          action: "Update",
          details: "Database already up to date",
          status: "warning"
     }
]