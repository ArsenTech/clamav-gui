import { ChartNoAxesCombined, ClipboardClock, Cog, Info, SearchCheck, History, ShieldCheck, BugOff, RotateCcw, FolderSearch, Search, FileSearch } from "lucide-react"
import { GUIUpdaterStatus, HistoryClearType, IQuickAccessItem } from "../types"

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
          name: "About ClamAV GUI",
          href: "/about",
          Icon: Info
     }
]
export const QUICK_ACCESS_LINKS: IQuickAccessItem[] = [
     {
          name: "Main Scan",
          desc: "Check common locations now",
          href: "/scan/main",
          Icon: Search,
          openDialogType: "none"
     },
     {
          name: "Full Scan",
          desc: "Scan everything (might take a while)",
          href: "/scan/full",
          Icon: SearchCheck,
          openDialogType: "none"
     },
     {
          name: "Custom Scan",
          desc: "Choose a folder to scan",
          href: "/scan/custom",
          Icon: FolderSearch,
          openDialogType: "folder"
     },
     {
          name: "File Scan",
          desc: "Choose a file to scan",
          href: "/scan/file",
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
          href: "/settings?tab=update",
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
          name: "Real-Time Scan",
          desc: "Scans newly created files in real time",
          href: "/settings?tab=advanced",
          Icon: ShieldCheck,
          openDialogType: "none"
     },
]
export const HISTORY_CLEAR_MSGS: Record<HistoryClearType,string> = {
     all: "History Cleared!",
     acknowledged: "Acknowledged Entries Cleared!",
     error: "All errors Cleared!"
}
export const UPDATER_TEXTS: Record<GUIUpdaterStatus,{
     main: string,
     secondary: string
}> = {
     checking: {
          main: "Checking for new version...",
          secondary: "Please Wait..."
     },
     updating: {
          main: "Updating the GUI...",
          secondary: "Please Wait until it finishes downloading contents..."
     },
     "needs-update": {
          main: "The New Version is Available!",
          secondary: "Make sure to update the GUI for improvements."
     },
     updated: {
          main: "The GUI is Up to Date!",
          secondary: "No New updates are available"
     },
     "failed-check": {
          main: "Failed to check for updates",
          secondary: "Make sure to try again later to check for the new version."
     },
     completed: {
          main: "The GUI has been updated to the new version!",
          secondary: "Make sure to relaunch the app to finalize the update."
     },
     "failed-update": {
          main: "Failed to update the GUI",
          secondary: "Make sure to try again later.",
     }
}