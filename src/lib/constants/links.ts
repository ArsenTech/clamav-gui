import { ChartNoAxesCombined, ClipboardClock, Cog, Info, SearchCheck, History, ShieldCheck, BugOff, RotateCcw, FolderSearch, Search, FileSearch } from "lucide-react"
import { IQuickAccessItem } from "../types"

export const SIDEBAR_LINKS = [
     {
          name: "Overview",
          href: "/",
          Icon: ShieldCheck
     },
     {
          name: "Scan",
          href: "/scan",
          Icon: SearchCheck
     },
     {
          name: "Quarantine",
          href: "/quarantine",
          Icon: BugOff
     },
     {
          name: "History",
          href: "/history",
          Icon: History
     },
     {
          name: "Statistics",
          href: "/stats",
          Icon: ChartNoAxesCombined
     },
     {
          name: "Scheduler",
          href: "/scheduler",
          Icon: ClipboardClock
     },
]
export const SIDEBAR_FOOTER_LINKS = [
     {
          name: "Settings",
          href: "/settings",
          Icon: Cog
     },
     {
          name: "Definition Updater",
          href: "/update",
          Icon: RotateCcw
     },
     {
          name: "About ClamAV GUI",
          href: "/about",
          Icon: Info
     }
]
export const QUICK_ACCESS_LINKS: IQuickAccessItem[] = [
  {
    name: "Main Scan",
    desc: "Check common locations now",
    href: "/scan?type=main",
    Icon: Search,
    openDialogType: "none"
  },
  {
    name: "Full Scan",
    desc: "Scan everything (might take a while)",
    href: "/scan?type=full",
    Icon: SearchCheck,
    openDialogType: "none"
  },
  {
    name: "Custom Scan",
    desc: "Choose a folder to scan",
    href: "/scan?type=custom",
    Icon: FolderSearch,
    openDialogType: "folder"
  },
  {
    name: "File Scan",
    desc: "Choose a file to scan",
    href: "/scan?type=file",
    Icon: FileSearch,
    openDialogType: "file"
  },
  {
    name: "Quarantine",
    desc: "View isolated malicious files",
    href: "/quarantine",
    Icon: BugOff,
    openDialogType: "none"
  },
  {
    name: "Update",
    desc: "Update Virus Definitions from the ClamAV database",
    href: "/update",
    Icon: RotateCcw,
    openDialogType: "none"
  },
  {
    name: "History",
    desc: "View the ClamAV GUI Actions history",
    href: "/history",
    Icon: History,
    openDialogType: "none"
  },
  {
    name: "Real-Time Protection",
    desc: "Scans newly created files in real time",
    href: "/",
    Icon: ShieldCheck,
    openDialogType: "none"
  },
  {
    name: "Scheduler",
    desc: "Schedule a scan",
    href: "/scheduler",
    Icon: ClipboardClock,
    openDialogType: "none"
  },
  {
    name: "Statistics",
    desc: "View ClamAV GUI's stats including the System stats",
    href: "/stats",
    Icon: ChartNoAxesCombined,
    openDialogType: "none"
  },
]