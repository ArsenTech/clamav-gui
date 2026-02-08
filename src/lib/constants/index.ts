import { Search, SearchCheck, FolderSearch, FileSearch } from "lucide-react";
import { IScanMenuItem } from "../types";

export const DAYS_OF_THE_WEEK = ["sun","mon","tue","wed","thu","fri","sat"] as const;

export const SCAN_TYPES: IScanMenuItem[] = [
     {
          type: "main",
          Icon: Search
     },
     {
          type: "full",
          Icon: SearchCheck
     },
     {
          type: "custom",
          Icon: FolderSearch
     },
     {
          type: "file",
          Icon: FileSearch
     }
]
export const SCAN_ENUM = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>val.type);
export const SCAN_OPTIONS = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>({
     value: val.type,
     icon: val.Icon
}))