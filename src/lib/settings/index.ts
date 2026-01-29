import { Files, Folder, Monitor, Moon, Sun, Gauge, ChevronsLeftRightEllipsis, ShieldCheck, SearchCode, LucideProps } from "lucide-react";
import { IDateFormatSettings, ISettings, IThemeSettings, ScanOptionGroup } from "../types/settings";

export const SCAN_OPTION_TITLE: Record<ScanOptionGroup,{
     title: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}> = {
     detection: {
          title: "Detection",
          Icon: ShieldCheck
     },
     "file-types": {
          title: "File Types",
          Icon: Files
     },
     filesystem: {
          title: "Filesystem",
          Icon: Folder
     },
     "limits-performance": {
          title: "Limits and Performance",
          Icon: Gauge
     },
     output: {
          title: "Output",
          Icon: ChevronsLeftRightEllipsis
     },
     advanced: {
          title: "Advanced Scan Options",
          Icon: SearchCode
     },
}
export const DEFAULT_SETTINGS: ISettings = {
     theme: "system",
     color: "blue",
     dateFormat: "dd/MM/yyyy HH:mm:ss",
     developerMode: false,
     confirmStopScan: true,
     autoScrollText: true,
     maxLogLines: 500
}
export const MAX_LONG_LINES_CHOICES = [100, 500, 1000, 1500] as const
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
/* TODO: Finish the settings page according to this route ([UI] - Completed, [X] - Works, [Soon] - Coming soon)
Completed:
Settings
└── General (uses LocalStorage)
    ├── Theme [X]
    ├── Color [X]
    ├── Date format [X]
    └── Logs & UI
        ├── Auto-scroll [X]
        ├── Max log lines [X]
        └── Language [X]

Settings
├── Scan
│   ├── Auto startup scan [UI] (uses @tauri-apps/plugin-store)
│   ├── Confirm stop [X]
│   ├── Silent scheduled scans [UI] (uses @tauri-apps/plugin-store)
│   └── Custom Scan Options (uses @tauri-apps/plugin-store)
│       ├── Options with Switch Togglers [UI] 
│       └── Options with Input Boxes [UI] 
│
├── Scheduler
│   ├── Enable Scheduler UI [UI]
│   └── Notifications
│       ├── On scan start [UI]
│       ├── On scan finish [UI]
│       └── On detection [UI]
│
├── Protection (uses @tauri-apps/plugin-store)
│   ├── Real-Time Protection [UI]
│   ├── Exclusions [UI]
│   └── ClamD status [UI]
│
└── Advanced
    ├── Custom Scan Options (uses @tauri-apps/plugin-store)
    │   ├── Options with Switch Togglers [UI]
    │   └── Options with Input Boxes [UI]
    │
    ├── Developer Mode (Shows ID on Tables) [X]
    └── Behavior [UI]
*/