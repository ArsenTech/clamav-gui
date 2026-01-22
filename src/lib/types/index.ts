import { ColumnDef } from "@tanstack/react-table";
import { LucideProps } from "lucide-react";

export type ScanType = "" | "main" | "full" | "custom" | "file"
export type ClamAVState = "checking" | "available" | "missing";
export type ThreatStatus = "quarantined" | "deleted" | "safe" | "detected";
export type HistoryStatus = "success" | "warning" | "error" | "acknowledged";
export type ThreatStatusStat = Exclude<ThreatStatus,"detected"|"safe"> | "unresolved" | "skipped";
export type ComputerVirusType = "trojan" | "ransomware" | "spyware" | "rootkit" | "other";
export type ScanTypeStat = Exclude<ScanType,""> | "real-time";

export interface IScanMenuItem{
     type: ScanType,
     name: string,
     desc: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}
interface SystemStatBase{
     ram_used: number,
     ram_total: number,
     disk_read_bytes: number,
     disk_written_bytes: number,
}
export interface SystemStats extends SystemStatBase{
     cpu_usage: number[],
     cpu_frequency: number[],
}
export interface HookReturnType extends SystemStatBase{
     cpu_usage: number,
     cpu_frequency: number,
}
export interface IHistoryData{
     id: string,
     timestamp: string,
     action: string,
     details: string
     status: HistoryStatus,
     logId?: string
}
export interface IQuickAccessItem{
     name: string,
     desc: string,
     href: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
     openDialogType: "none" | "file" | "folder"
}
export interface IThreatsData{
     id: string,
     displayName: string,
     filePath: string,
     status: ThreatStatus,
     detectedAt: string
}
export interface IQuarantineData<T extends "state" | "type">{
     id: string,
     threat_name: string,
     file_path: string,
     quarantined_at: string,
     size: T extends "state" ? string | null : number
}
export interface ISchedulerData{
     id: string,
     interval: "daily" | "weekly" | "monthly",
     scanType: ScanType,
     lastScan: string,
     nextScan: string
}

interface IStatBase{
     threats: number,
     fill: string,
}
export interface IActivityStat{
     month: string,
     unresolved: number,
     resolved: number
}
export interface IScanTypeStat extends IStatBase{ scanType: ScanTypeStat }
export interface IThreatStatusStat extends IStatBase{ status: ThreatStatusStat }
export interface IVirusTypeStat extends IStatBase{ type: ComputerVirusType }
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  searchColumn?: string,
  headerElement?: React.JSX.Element
}