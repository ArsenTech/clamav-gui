import { Files, Folder, Monitor, Moon, Sun, Gauge, ChevronsLeftRightEllipsis, ShieldCheck, SearchCode, LucideProps } from "lucide-react";
import { BackendSettings, IDateFormatSettings, ISettings, IThemeSettings, ScanOptionGroup } from "../types/settings";

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
     maxLogLines: 500,
     currScanProfile: "custom",
     realTime: true,
     enableSchedulerUI: true,
     notifOnScanStart: false,
     notifOnScanFinish: true,
     notifPermitted: false,
     behavior: "balanced",
}
export const DEFAULT_BACKEND_SETTINGS: BackendSettings = {
     scanProfiles: {
          main: {},
          custom: {},
          file: {}
     },
     scanSettings: {
          autoStartupScan: false,
          silentScheduledScans: false,
     },
     exclusions: [],
}
export const FILE_SCAN_WHITELIST =  [
     "algorithmicDetection",
     "heuristicAlerts",
     "detectPUA",
     "scanArchive",
     "scanPDF",
     "scanHTML",
];
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
/* TODO: Finish the settings page according to this route ([X] - Finished, [Impl] - Currently Implemented) + Reorganize Settings

Real-Time Scan monitors file activity and scans files when they change.
It does not install kernel drivers.

Completed:
Settings
├── General (uses LocalStorage)
│   ├── Theme [X]
│   ├── Color [X]
│   ├── Date format [X]
│   └── Logs & UI
│       ├── Auto-scroll [X]
│       ├── Max log lines [X]
│       └── Language [X]
│
├── Scheduler
│   ├── Enable Scheduler UI [X]
│   └── Notifications
│       ├── On scan start [X]
│       └── On scan finish [X]
│ 
├── Exclusions [X]
└── Advanced
    ├── Custom Scan Options [X]
    ├── Developer Mode (Shows ID on Tables) [X]
    ├── Real-Time Scan [X]
    └── Behavior [X]

Settings
├── Scan
│   ├── Auto startup scan [Impl]
│   ├── Confirm stop [X]
│   ├── Silent scheduled scans [Impl]
│   └── Custom Scan Options [X]
*/