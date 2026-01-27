import { Files, Folder, Monitor, Moon, Sun, Gauge, ChevronsLeftRightEllipsis, ShieldCheck, SearchCode } from "lucide-react";
import { IDateFormatSettings, ISettings, IThemeSettings, ScanOptionGroup } from "../types/settings";

export const SCAN_OPTION_TITLE: Record<ScanOptionGroup,{
     title: string,
     icon: React.JSX.Element
}> = {
     detection: {
          title: "Detection",
          icon: <ShieldCheck className="size-5"/>
     },
     "file-types": {
          title: "File Types",
          icon: <Files className="size-5"/>
     },
     filesystem: {
          title: "Filesystem",
          icon: <Folder className="size-5"/>
     },
     "limits-performance": {
          title: "Limits and Performance",
          icon: <Gauge className="size-5"/>
     },
     output: {
          title: "Output",
          icon: <ChevronsLeftRightEllipsis className="size-5"/>
     },
     advanced: {
          title: "Advanced Scan Options",
          icon: <SearchCode className="size-5"/>
     },
}
export const DEFAULT_SETTINGS: ISettings = {
     theme: "system",
     color: "blue",
     dateFormat: "dd/MM/yyyy HH:mm:ss",
     developerMode: false,
     confirmStopScan: true
}
export const THEME_SETTINGS: IThemeSettings = {
     theme: [
          {
               Icon: Monitor,
               name: "System",
               theme: "system"
          },
          {
               Icon: Sun,
               name: "Light",
               theme: "light"
          },
          {
               Icon: Moon,
               name: "Dark",
               theme: "dark"
          }
     ],
     color: [
          {
               name: "blue",
               className: "text-blue-600 dark:text-blue-400",
               hoverClass: "hover:border-blue-600"
          }, 
          {
               name: "green",
               className: "text-green-600 dark:text-green-400",
               hoverClass: "hover:border-green-600"
          }, 
          {
               name: "rose",
               className: "text-rose-600 dark:text-rose-400",
               hoverClass: "hover:border-rose-600"
          }
     ]
}
export const DATE_TIME_FORMATS: IDateFormatSettings[] = [
     {
          name: "European",
          format: "dd/MM/yyyy HH:mm:ss"
     },
     {
          name: "American",
          format: "MM/dd/yyyy HH:mm:ss"
     },
     {
          name: "International",
          format: "yyyy-MM-dd HH:mm:ss"
     }
]
/* TODO: Finish the settings page according to this route ([UI] - Completed, [X] - Works)
Settings
├── General (uses LocalStorage)
│   ├── Theme [X]
│   ├── Color [X]
│   ├── Language
│   └── Date format [X]
│
├── Scan
│   ├── Auto startup scan [UI] (uses @tauri-apps/plugin-store)
│   ├── Confirm stop [X]
│   ├── Silent scheduled scans [UI] (uses @tauri-apps/plugin-store)
│   └── Custom Scan Options (uses @tauri-apps/plugin-store)
│       ├── Options with Switch Togglers [UI] 
│       └── Options with Input Boxes [UI] 
│
├── Scheduler
│   ├── Enable Scheduler UI
│   └── Notifications
│       ├── On scan start
│       ├── On scan finish
│       └── On detection
│
├── Logs & UI
│   ├── Auto-scroll
│   └── Max log lines
│
├── Protection (uses @tauri-apps/plugin-store)
│   ├── Real-Time Protection
│   ├── Exclusions => --exclude-dir=REGEX Exclusions (perfect in Protection settings), --exclude-pua=CATEGORY Exclude a specific PUA category
│   └── ClamD status
│
└── Advanced
    ├── Custom Scan Options (uses @tauri-apps/plugin-store)
    │   ├── Options with Switch Togglers [UI]
    │   └── Options with Input Boxes [UI]
    │
    ├── Developer Mode (Shows ID on Tables) [X]
    └── Behavior
*/