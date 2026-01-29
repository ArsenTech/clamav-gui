import { LucideProps } from "lucide-react";
import { ScanType } from ".";
import { COLORS } from "../constants/colors";
import { SCAN_SETTINGS } from "../settings/custom-scan-options";
import { SchedulerType } from "./schema";

export type ScanOptionGroup = "detection" | "file-types" | "filesystem" | "limits-performance" | "output" | "advanced"

type ScanOptionValue =
  | { kind: "yes-no"; default?: boolean }
  | { kind: "input"; inputType: "number" | "path" | "string"; min?: number; max?: number, default?: string | number }
  | { kind: "choice"; choices: readonly { label: string; value: string | number }[]; default?: string | number };

export interface IScanOption{
     label: string;
     description?: string;
     flag: string;
     conflictsWith: readonly (keyof typeof SCAN_SETTINGS)[];
     group: ScanOptionGroup;
     value: ScanOptionValue;
     dependsOn: readonly (keyof typeof SCAN_SETTINGS)[];
}

export type ScanOption = Record<string,IScanOption>;
export interface ISchedulerFormValues{
     interval: SchedulerType["interval"] | null,
     scanType: ScanType | null
}
export type DateFormat = "dd/MM/yyyy HH:mm:ss" | "MM/dd/yyyy HH:mm:ss" | "yyyy-MM-dd HH:mm:ss"
export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;
export type Color = keyof typeof COLORS;
export interface IThemeSettings{
     theme: {
          Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
          name: string,
          theme: Theme
     }[],
     color: {
          name: Color,
          className: string,
          hoverClass: string
     }[]
}
export interface IDateFormatSettings{
     name: string,
     format: DateFormat
}
export interface ISettings{
     theme: Theme,
     color: Color,
     dateFormat: DateFormat,
     developerMode: boolean,
     confirmStopScan: boolean,
     autoScrollText: boolean,
     maxLogLines: number
}
export type BehaviorMode = "balanced" | "safe" | "strict" | "expert"
export type BackendSettings = {
     scan: {
          autoStartupScan: boolean,
          silentScheduledScans: boolean,
     },
     scanProfiles: {
          main: {},
          custom: {},
          file: {}
     }
     scheduler: {
          enableSchedulerUI: boolean,
          notifOnScanStart: boolean,
          notifOnScanFinish: boolean,
          notifOnDetection: boolean
     },
     protection: {
          realTime: boolean,
          dirExclusions: string[],
          puaExclusions: string[],
          clamdEnabled: boolean
     },
     advanced: {
          behavior: BehaviorMode
     }
}