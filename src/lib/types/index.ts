import * as z from "zod"
import { LucideProps } from "lucide-react";
import { SettingsProps } from "./props";
import { getExclusionsSchema, getSchedulerSchema } from "../schemas";
import { QuickAccessLink, SettingsTab, SidebarLink, ScanType, BehaviorMode, ScanResult } from "./enums";

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type ActionType = "restore" | "delete"
export type FsOption = "file" | "folder";
export type DesignType = "default" | "danger";

export interface IScanMenuItem{
     type: ScanType,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}
export interface IQuickAccessItem{
     type: QuickAccessLink
     href: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     openDialogType: "none" | "file" | "folder"
}
export interface ISidebarItem{
     name: SidebarLink,
     href: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
}
export interface ISettingsTab{
     page: SettingsTab
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     Loader: React.FC,
     LazyComponent: React.LazyExoticComponent<React.FC<SettingsProps>>
}
export interface IClamAvVersion{
     engine: string,
     dbVersion: string
}
export interface ISpecialThanksItem{
     handle: string,
     link: string,
     note: "early-test" | "bug-report-test"
}

// Schemas
export type SchedulerType = z.infer<ReturnType<typeof getSchedulerSchema>>
export type ExclusionsType = z.infer<ReturnType<typeof getExclusionsSchema>>

export interface IDetailsData {
     "real-time-error": { err: string };
     "real-time-start": { behavior: BehaviorMode; paths: number };
     "real-time-stop": null;
     "quarantine-threat": { threat: string };
     "restore-threat": { threat: string };
     "delete-threat": { threat: string };
     "scan-start": { scan_type: ScanType };
     "scan-finish": { result: ScanResult; exit_code: number; found_threats: number };
     "def-update-start": null;
     "def-update-finish": { exit_code: number };
     "def-update-error": { err: string };
     "scheduler-create": { task_name: string };
     "scheduler-delete": { task_name: string };
     "scheduler-trigger-error": { task_name: string };
     "scheduler-trigger": { task_name: string };
     "file-delete": { file_path: string };
     "file-delete-error": { err: string; file_path: string };
}

export type HistoryDetails =
     { [K in keyof IDetailsData]: { type: K; details: IDetailsData[K] } }[keyof IDetailsData];