import { Search, SearchCheck, FolderSearch, FileSearch } from "lucide-react";
import { IScanMenuItem } from "../types";

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
export const SCAN_EXIT_CODE_MSG: Record<number, string> = {
     0: "Scan completed successfully",
     1: "Threats were detected",
     2: "Some files could not be scanned due to access restrictions",
}
export const UPDATE_EXIT_CODE_MSG: Record<number, string> = {
     0: "Definitions are updated successfully",
     1: "Some update sources may not have been reachable",
}