import { Search, SearchCheck, FolderSearch, FileSearch } from "lucide-react";
import { IScanMenuItem, ISpecialThanksItem } from "../types";
import { ScanType } from "../types/enums";

export const DAYS_OF_THE_WEEK = ["mon","tue","wed","thu","fri","sat","sun"] as const;
export const INTERVALS = ["daily","weekly","monthly"] as const

export const SCAN_TYPES: IScanMenuItem[] = [
     {
          type: ScanType.Main,
          Icon: Search
     },
     {
          type: ScanType.Full,
          Icon: SearchCheck
     },
     {
          type: ScanType.Custom,
          Icon: FolderSearch
     },
     {
          type: ScanType.File,
          Icon: FileSearch
     }
]
export const SCAN_ENUM = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>val.type);
export const SCAN_OPTIONS = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>({
     value: val.type,
     icon: val.Icon
}))

export const SPECIAL_THANKS: ISpecialThanksItem[] = [
     {
          handle: "@LorNapes2",
          link: "https://www.youtube.com/@LorNapes2",
          note: "early-test",
     },
     {
          handle: "@EinfxxhMicro",
          link: "https://www.youtube.com/@EinfxchMicro",
          note: "bug-report-test"
     },
];