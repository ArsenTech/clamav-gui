import * as z from "zod"
import { LucideProps } from "lucide-react";
import { SettingsProps } from "./props";

export type ScanType = "" | "main" | "full" | "custom" | "file"
export type ClamAVState = "checking" | "available" | "missing";
export type GUIUpdaterStatus = "checking" | "updating" | "needs-update" | "updated" | "failed-check" | "completed" | "failed-update"
export type SettingsTab = "general" | "advanced" | "scan" | "update"
export type QuarantineAction = "restore" | "delete"
export type FsOption = "file" | "folder";

export interface IScanMenuItem{
     type: ScanType,
     name: string,
     desc: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}
export interface IQuickAccessItem{
     name: string,
     desc: string,
     href: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     openDialogType: "none" | "file" | "folder"
}
export interface ISettingsTab{
     page: SettingsTab,
     name: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     Loader: React.FC,
     LazyComponent: React.LazyExoticComponent<React.FC<SettingsProps>>
}

// Schemas
import { ExclusionsSchema, SchedulerSchema } from "../schemas";

export type SchedulerType = z.infer<typeof SchedulerSchema>
export type ExclusionsType = z.infer<typeof ExclusionsSchema>