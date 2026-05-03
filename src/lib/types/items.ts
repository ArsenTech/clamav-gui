import { QuickAccessLink, SidebarLink, ScanType } from "./enums";
import { LucideIconType } from ".";

export interface IScanMenuItem{
     type: ScanType,
     Icon: LucideIconType
}
export interface IQuickAccessItem{
     type: QuickAccessLink
     href: string,
     Icon: LucideIconType,
     openDialogType: "none" | "file" | "folder"
}
export interface ISidebarItem{
     name: SidebarLink,
     href: string,
     Icon: LucideIconType,
}
export interface ISpecialThanksItem{
     handle: string,
     link: string,
     note: "early-test" | "bug-report-test"
}