import { ScanOptionGroup } from "@/lib/types/enums";
import { ScanOptionKeys } from "@/lib/types/settings";

export const SCAN_SETTINGS = {
  // File System
  recursive: {
    flag: "--recursive",
    group: ScanOptionGroup.FileSystem,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  crossFs: {
    flag: "--cross-fs",
    group: ScanOptionGroup.FileSystem,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  followDirSymlinks: {
    flag: "--follow-dir-symlinks",
    group: ScanOptionGroup.FileSystem,
    conflictsWith: [],
    dependsOn: [],
    value: {
      kind: "choice",
      default: 1,
      choices: [ 0, 1, 2 ],
      choiceKey: "sym-links"
    },
  },
  followFileSymlinks: {
    flag: "--follow-file-symlinks",
    group: ScanOptionGroup.FileSystem,
    conflictsWith: [],
    dependsOn: [],
    value: {
      kind: "choice",
      default: 1,
      choices: [ 0, 1, 2 ],
      choiceKey: "sym-links"
    },
  },

  // Output
  quiet: {
    flag: "--quiet",
    group: ScanOptionGroup.Output,
    conflictsWith: ["verbose", "infected"],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  verbose: {
    flag: "--verbose",
    group: ScanOptionGroup.Output,
    conflictsWith: ["quiet", "infected"],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  infected: {
    flag: "--infected",
    group: ScanOptionGroup.Output,
    conflictsWith: ["verbose", "quiet"],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  noSummary: {
    flag: "--no-summary",
    group: ScanOptionGroup.Output,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  bell: {
    flag: "--bell",
    group: ScanOptionGroup.Output,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  debug: {
    flag: "--debug",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },

  // Detection
  algorithmicDetection: {
    flag: "--algorithmic-detection",
    group: ScanOptionGroup.Detection,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  heuristicAlerts: {
    flag: "--heuristic-alerts",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  heuristicPrecedence: {
    flag: "--heuristic-scan-precedence",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  detectPUA: {
    flag: "--detect-pua",
    group: ScanOptionGroup.Detection,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  detectStructured: {
    flag: "--detect-structured",
    group: ScanOptionGroup.Detection,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  structuredSSNFormat: {
    flag: "--structured-ssn-format",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: ["detectStructured"],
    value: {
      kind: "choice",
      default: 0,
      choices: [ 0, 1, 2 ],
      choiceKey: "ssn-formats"
    },
  },
  structuredSSNCount: {
    flag: "--structured-ssn-count",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: ["detectStructured"],
    value: { kind: "input", inputType: "number", min: 1, max: 100, default: undefined },
  },
  structuredCCCount: {
    flag: "--structured-cc-count",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: ["detectStructured"],
    value: { kind: "input", inputType: "number", min: 1, max: 100, default: undefined },
  },

  // File Types
  scanPE: {
    flag: "--scan-pe",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  scanELF: {
    flag: "--scan-elf",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  scanOLE2: {
    flag: "--scan-ole2",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  scanPDF: {
    flag: "--scan-pdf",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  scanHTML: {
    flag: "--scan-html",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  scanArchive: {
    flag: "--scan-archive",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  scanMail: {
    flag: "--scan-mail",
    group: ScanOptionGroup.FileTypes,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  detectBroken: {
    flag: "--detect-broken",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },

  // Limits / Performance
  maxFileSize: {
    flag: "--max-filesize",
    group: ScanOptionGroup.LimitsPerformance,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "number", min: 64, max: 1024 * 1024, default: 100_000 },
  },
  maxScanSize: {
    flag: "--max-scansize",
    group: ScanOptionGroup.LimitsPerformance,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "number", min: 64, max: 1024 * 1024, default: 400_000 },
  },
  alertEncrypted: {
    flag: "--alert-encrypted",
    group: ScanOptionGroup.Output,
    conflictsWith: [],
    dependsOn: [],
    value: {kind: "yes-no", default: true}
  },
  maxFiles: {
    flag: "--max-files",
    group: ScanOptionGroup.LimitsPerformance,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "number", min: 1, max: 100000, default: undefined },
  },
  maxRecursion: {
    flag: "--max-recursion",
    group: ScanOptionGroup.LimitsPerformance,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "number", min: 1, max: 50, default: undefined },
  },
  maxDirRecursion: {
    flag: "--max-dir-recursion",
    group: ScanOptionGroup.LimitsPerformance,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "number", min: 1, max: 100, default: undefined },
  },

  // Advanced
  noCerts: {
    flag: "--nocerts",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  disableCache: {
    flag: "--disable-cache",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  officialDbOnly: {
    flag: "--official-db-only",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  leaveTemps: {
    flag: "--leave-temps",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: false },
  },
  bytecode: {
    flag: "--bytecode",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "yes-no", default: true },
  },
  bytecodeUnsigned: {
    flag: "--bytecode-unsigned",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: ["bytecode"],
    value: { kind: "yes-no", default: false },
  },
  bytecodeTimeout: {
    flag: "--bytecode-timeout",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: ["bytecode"],
    value: { kind: "input", inputType: "number", min: 100, max: 60000, default: undefined },
  },
  databasePath: {
    flag: "--database",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "path", default: undefined, min: undefined, max: undefined },
  },
  tempDir: {
    flag: "--tempdir",
    group: ScanOptionGroup.Advanced,
    conflictsWith: [],
    dependsOn: [],
    value: { kind: "input", inputType: "path", default: undefined, min: undefined, max: undefined },
  },
} as const

export const SCAN_SETTINGS_GROUPED = Object.groupBy(
  Object.entries(SCAN_SETTINGS).map(([key,obj])=>({
  ...obj,
  optionKey: key as ScanOptionKeys
})),({group})=>group)
const DESC_WHITELIST = ["debug","heuristicAlerts","bytecodeUnsigned"] as const

// TODO: Move
const DESC_KEYS: Set<ScanOptionKeys> = new Set(DESC_WHITELIST)
export function isDescKey(key: ScanOptionKeys): key is typeof DESC_WHITELIST[number] {
  return DESC_KEYS.has(key as ScanOptionKeys);
}