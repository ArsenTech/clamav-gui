import * as z from "zod"
import { LucideProps } from "lucide-react";
import { SettingsProps } from "./props";
import { ExclusionsSchema, SchedulerSchema } from "../schemas";
import { QuickAccessLink, SettingsTab, SidebarLink, ScanType } from "./enums";

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type QuarantineAction = "restore" | "delete"
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
export type SchedulerType = z.infer<typeof SchedulerSchema>
export type ExclusionsType = z.infer<typeof ExclusionsSchema>