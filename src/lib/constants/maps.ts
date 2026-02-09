import { GuiUpdaterStatus } from "../types/enums"
import { HistoryClearType } from "../types/data"

export const SCAN_EXIT_CODE_MSG: Record<number, string> = {
     0: "Scan completed successfully",
     1: "Threats were detected",
     2: "Some files could not be scanned due to access restrictions",
}
export const UPDATE_EXIT_CODE_MSG: Record<number, string> = {
     0: "Definitions are updated successfully",
     1: "Some update sources may not have been reachable",
}
export const HISTORY_CLEAR_MSGS: Record<HistoryClearType,string> = {
     all: "History Cleared!",
     acknowledged: "Acknowledged Entries Cleared!",
     error: "All errors Cleared!"
}
export const UPDATER_TEXTS: Record<GuiUpdaterStatus,{
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