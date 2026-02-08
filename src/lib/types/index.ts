import * as z from "zod"
import { LucideProps } from "lucide-react";
import { SettingsProps } from "./props";
import { ExclusionsSchema, SchedulerSchema } from "../schemas";
import { QuickAccessLink, SidebarLink } from "./enums";

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
     page: SettingsTab,
     name: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     Loader: React.FC,
     LazyComponent: React.LazyExoticComponent<React.FC<SettingsProps>>
}

// Schemas
export type SchedulerType = z.infer<typeof SchedulerSchema>
export type ExclusionsType = z.infer<typeof ExclusionsSchema>