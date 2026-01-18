import { ColumnDef } from "@tanstack/react-table";
import { LucideProps } from "lucide-react";

export type ScanType = "" | "main" | "full" | "custom" | "file"
export type ClamAVState = "checking" | "available" | "missing";

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
}
export interface IQuickAccessItem{
     name: string,
     desc: string,
     href: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}
export interface IQuarantineData{
     id: string,
     displayName: string,
     filePath: string,
     status: "quarantined" | "deleted" | "restored" | "ignored" | "blocked" | "detected",
     detectedAt: string
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
export interface IScanTypeStat extends IStatBase{ scanType: Exclude<ScanType,""> | "real-time" }
export interface IThreatStatusStat extends IStatBase{ status: "quarantined" | "ignored" | "deleted" | "unresolved" }
export interface IVirusTypeStat extends IStatBase{ type: "trojan" | "ransomware" | "spyware" | "rootkit" | "other" }
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}