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
  { scanType: "main", threats: 275, fill: "var(--color-main)" },
  { scanType: "full", threats: 200, fill: "var(--color-full)" },
  { scanType: "custom", threats: 187, fill: "var(--color-custom)" },
  { scanType: "file", threats: 173, fill: "var(--color-file)" },
  { scanType: "real-time", threats: 90, fill: "var(--color-real-time)" },
]
export const THREAT_STATUS_DATA: IThreatStatusStat[] = [
  { status: "quarantined", threats: 275, fill: "var(--color-quarantined)" },
  { status: "ignored", threats: 200, fill: "var(--color-ignored)" },
  { status: "deleted", threats: 287, fill: "var(--color-deleted)" },
  { status: "unresolved", threats: 173, fill: "var(--color-unresolved)" },
]
export const VIRUS_TYPE_DATA: IVirusTypeStat[] = [
  { type: "trojan", threats: 275, fill: "var(--color-trojan)" },
  { type: "ransomware", threats: 200, fill: "var(--color-ransomware)" },
  { type: "spyware", threats: 187, fill: "var(--color-spyware)" },
  { type: "rootkit", threats: 173, fill: "var(--color-rootkit)" },
  { type: "other", threats: 90, fill: "var(--color-other)" },
]