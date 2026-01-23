import { IActivityStat, IScanTypeStat, IThreatStatusStat, IVirusTypeStat } from "../types"

// TODO: Replace with Dynamic Data, but don't delete the types
export const ACTIVITY_DATA: IActivityStat[] = [
  { month: "January", unresolved: 186, resolved: 80 },
  { month: "February", unresolved: 305, resolved: 200 },
  { month: "March", unresolved: 237, resolved: 120 },
  { month: "April", unresolved: 73, resolved: 190 },
  { month: "May", unresolved: 209, resolved: 130 },
  { month: "June", unresolved: 214, resolved: 140 },
]
export const SCAN_TYPE_DATA: IScanTypeStat[] = [
  { scan_type: "main", threats: 275, fill: "var(--color-main)" },
  { scan_type: "full", threats: 200, fill: "var(--color-full)" },
  { scan_type: "custom", threats: 187, fill: "var(--color-custom)" },
  { scan_type: "file", threats: 173, fill: "var(--color-file)" },
  { scan_type: "realtime", threats: 90, fill: "var(--color-realtime)" },
]
export const THREAT_STATUS_DATA: IThreatStatusStat[] = [
  { status: "quarantined", threats: 275, fill: "var(--color-quarantined)" },
  { status: "skipped", threats: 200, fill: "var(--color-skipped)" },
  { status: "deleted", threats: 287, fill: "var(--color-deleted)" },
  { status: "unresolved", threats: 173, fill: "var(--color-unresolved)" },
]
export const VIRUS_TYPE_DATA: IVirusTypeStat[] = [
  { virus_type: "trojan", threats: 275, fill: "var(--color-trojan)" },
  { virus_type: "ransomware", threats: 200, fill: "var(--color-ransomware)" },
  { virus_type: "spyware", threats: 187, fill: "var(--color-spyware)" },
  { virus_type: "rootkit", threats: 173, fill: "var(--color-rootkit)" },
  { virus_type: "other", threats: 90, fill: "var(--color-other)" },
]