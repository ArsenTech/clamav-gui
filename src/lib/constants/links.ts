import { ChartNoAxesCombined, ClipboardClock, Cog, Info, SearchCheck, History, ShieldCheck, BugOff, RotateCcw, FolderSearch, Search, FileSearch } from "lucide-react"
import { IQuickAccessItem, ISidebarItem } from "../types"
import { QuickAccessLink, SidebarLink } from "../types/enums"

export const SIDEBAR_LINKS: ISidebarItem[] = [
     {
          name: SidebarLink.Overview,
          href: "/",
          Icon: ShieldCheck
     },
     {
          name: SidebarLink.Scan,
          href: "/scan",
          Icon: SearchCheck
     },
     {
          name: SidebarLink.Quarantine,
          href: "/quarantine",
          Icon: BugOff
     },
     {
          name: SidebarLink.History,
          href: "/history",
          Icon: History
     },
     {
          name: SidebarLink.Stats,
          href: "/stats",
          Icon: ChartNoAxesCombined
     },
     {
          name: SidebarLink.Scheduler,
          href: "/scheduler",
          Icon: ClipboardClock
     },
]
export const SIDEBAR_FOOTER_LINKS = [
     {
          name: SidebarLink.Settings,
          href: "/settings",
          Icon: Cog
     },
     {
          name: SidebarLink.About,
          href: "/about",
          Icon: Info
     }
]
export const QUICK_ACCESS_LINKS: IQuickAccessItem[] = [
     {
          type: QuickAccessLink.MainScan,
          href: "/scan/main",
          Icon: Search,
          openDialogType: "none"
     },
     {
          type: QuickAccessLink.FullScan,
          href: "/scan/full",
          Icon: SearchCheck,
          openDialogType: "none"
     },
     {
          type: QuickAccessLink.CustomScan,
          href: "/scan/custom",
          Icon: FolderSearch,
          openDialogType: "folder"
     },
     {
          type: QuickAccessLink.FileScan,
          href: "/scan/file",
          Icon: FileSearch,
          openDialogType: "file"
     },
     {
          type: QuickAccessLink.Quarantine,
          href: "/quarantine",
          Icon: BugOff,
          openDialogType: "none"
     },
     {
          type: QuickAccessLink.Update,
          href: "/settings?tab=update",
          Icon: RotateCcw,
          openDialogType: "none"
     },
     {
          type: QuickAccessLink.History,
          href: "/history",
          Icon: History,
          openDialogType: "none"
     },
     {
          type: QuickAccessLink.RealTime,
          href: "/settings?tab=advanced",
          Icon: ShieldCheck,
          openDialogType: "none"
     },
]