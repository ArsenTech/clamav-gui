import { ScanOption } from "../types";

export const CUSTOM_SCAN_OPTIONS: ScanOption = {
     recursive: {
          label: "Recursive",
          flag: "--recursive",
          level: "basic",
          conflictsWith: [],
     },
     heuristicAlerts: {
          label: "Heuristic Alerts",
          flag: "--heuristic-alerts",
          level: "basic",
          conflictsWith: []
     },
     alertEncrypted: {
          label: "Alert on encrypted archives and documents",
          flag: "--alert-encrypted",
          level: "basic",
          conflictsWith: []
     },
     quiet: {
          label: "Suppress normal output",
          flag: "--quiet",
          level: "basic",
          conflictsWith: ["verbose","infected"]
     },
     bell: {
          label: "Play sound on detection",
          flag: "--bell",
          level: "basic",
          conflictsWith: []
     },
     crossFs: {
          label: "Scan Files and directories on other systems",
          flag: "--cross-fs",
          level: "basic",
          conflictsWith: []
     },
     noSummary: {
          label: "Hide scan summary",
          flag: "--no-summary",
          level: "basic",
          conflictsWith: []
     },
     verbose: {
          label: "Output detailed logs",
          flag: "--verbose",
          level: "basic",
          conflictsWith: ["quiet","infected"]
     },
     infected: {
          label: "List only infected files",
          flag: "--infected",
          level: "basic",
          conflictsWith: ["verbose","quiet"]
     },
     noCerts: {
          label: "Disable authenticode certificate chain verification in PE files",
          flag: "--nocerts",
          level: "advanced",
          conflictsWith: []
     },
     disableCache: {
          label: "Disable caching and cache checks for hash sums of scanned files",
          flag: "--disable-cache",
          level: "advanced",
          conflictsWith: []
     },
     officialDbOnly: {
          label: "Only Load Official Signatures",
          flag: "--official-db-only",
          level: "advanced",
          conflictsWith: []
     },
     leaveTemps: {
          label: "Don't remove temporary files",
          flag: "--leave-temps",
          level: "advanced",
          conflictsWith: []
     }
}
/* TODO: Finish the settings page according to this route ([X] - Completed)
Settings
├── General (uses LocalStorage)
│   ├── Theme [X]
│   ├── Language
│   └── Date format (DD/MM/YYYY, MM/DD/YYYY, ISO)
│
├── Scan (uses @tauri-apps/plugin-store)
│   ├── Auto startup scan
│   ├── Confirm stop
│   ├── Silent scheduled scans
│   └── Custom Scan Options
│       ├── Options with Switch Togglers
│       └── Options with Input Boxes
│
├── Scheduler
│   ├── Enable scheduler UI
│   └── Notifications
│       ├── On scan start
│       ├── On scan finish
│       └── On detection
│
├── Logs & UI
│   ├── Auto-scroll
│   └── Max log lines
│
├── Protection
│   ├── Real-Time Protection
│   ├── Exclusions
│   └── ClamD status
│
└── Advanced
    ├── Custom Scan Options
    │   ├── Options with Switch Togglers
    │   └── Options with Input Boxes
    │
    ├── Developer Mode (Shows ID on Tables)
    └── Behavior
*/