import { LucideProps } from "lucide-react";
import { SchedulerType } from ".";
import { ScanProfiles, ScanType } from "./enums";
import { COLORS } from "../constants/colors";
import { SCAN_SETTINGS } from "../constants/settings/scan-options";
import { DateFormatType, BehaviorMode } from "./enums";

export type DateFormat = "dd/MM/yyyy HH:mm:ss" | "MM/dd/yyyy HH:mm:ss" | "yyyy-MM-dd HH:mm:ss"
export type Theme = "dark" | "light" | "system";

export type ScanOptionKeys = keyof typeof SCAN_SETTINGS;
export type ScanProfileValues = {
     [K in ScanOptionKeys]?: string | number | boolean;
};
export interface ISchedulerFormValues{
     interval: SchedulerType["interval"] | null,
     scanType: ScanType | null
}
export type ResolvedTheme = Exclude<Theme, "system">;
export type Color = keyof typeof COLORS;
export interface IThemeSettings{
     theme: {
          Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
          theme: Theme
     }[],
     color: {
          name: Color,
          className: string,
          hoverClass: string
     }[]
}
export interface IDateFormatSettings{
     type: DateFormatType
     format: DateFormat
}
export interface ISettings{
     theme: Theme,
     color: Color,
     dateFormat: DateFormat,
     developerMode: boolean,
     confirmStopScan: boolean,
     autoScrollText: boolean,
     maxLogLines: number,
     currScanProfile: ScanProfiles,
     realTime: boolean,
     enableSchedulerUI: boolean,
     notifOnScanStart: boolean,
     notifOnScanFinish: boolean,
     notifPermitted: boolean,
     behavior: BehaviorMode,
}
export type BackendSettings = {
     scanProfiles: {
          main: ScanProfileValues,
          custom: ScanProfileValues,
          file: ScanProfileValues
     }
     exclusions: string[],
}