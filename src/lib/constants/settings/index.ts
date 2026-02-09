import { Files, Folder, Monitor, Moon, Sun, Gauge, ChevronsLeftRightEllipsis, ShieldCheck, SearchCode, LucideProps } from "lucide-react";
import { BackendSettings, IDateFormatSettings, ISettings, IThemeSettings } from "@/lib/types/settings";
import { DateFormatType, ScanProfiles, ScanOptionGroup, BehaviorMode } from "@/lib/types/enums";

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
     currScanProfile: ScanProfiles.Custom,
     realTime: true,
     enableSchedulerUI: true,
     notifOnScanStart: false,
     notifOnScanFinish: true,
     notifPermitted: false,
     behavior: BehaviorMode.Balanced,
}
export const DEFAULT_BACKEND_SETTINGS: BackendSettings = {
     scanProfiles: {
          main: {},
          custom: {},
          file: {}
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
               theme: "system"
          },
          {
               Icon: Sun,
               theme: "light"
          },
          {
               Icon: Moon,
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
          type: DateFormatType.American,
          format: "MM/dd/yyyy HH:mm:ss"
     },
     {
          type: DateFormatType.European,
          format: "dd/MM/yyyy HH:mm:ss"
     },
     {
          type: DateFormatType.International,
          format: "yyyy-MM-dd HH:mm:ss"
     }
]