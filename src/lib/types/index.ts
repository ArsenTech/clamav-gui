import { LucideProps } from "lucide-react";

export type ScanType = "" | "main" | "full" | "custom" | "file"
export type ClamAVState = "checking" | "available" | "missing";

export interface IScanMenuItem{
     type: ScanType,
     name: string,
     desc: string,
     Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}
export interface IDeviceInfo {
  sys_name: string;
  sys_os: string;
  sys_host: string;
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
export interface IVersion{
     app: string,
     tauri: string,
     versionType: string
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