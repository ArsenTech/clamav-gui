import { ScanType } from ".";
import { ThreatStatus } from "./data";

export type ScanTypeStat = Exclude<ScanType,""> | "realtime";
export type ThreatStatusStat = Exclude<ThreatStatus,"detected"|"safe"> | "unresolved";
export type ComputerVirusType = "trojan" | "ransomware" | "spyware" | "rootkit" | "other";

interface IStatBase{
     threats: number,
     fill: string,
}
export interface IActivityStat{
     month: string,
     unresolved: number,
     resolved: number
}
export interface IScanTypeStat extends IStatBase{ scan_type: ScanTypeStat }
export interface IThreatStatusStat extends IStatBase{ status: ThreatStatusStat }
export interface IVirusTypeStat extends IStatBase{ virus_type: ComputerVirusType }
export type StatsResponse<T extends "state" | "type"> = (T extends "state" ? {
     scanTypes: IScanTypeStat[],
     threatStatus: IThreatStatusStat[],
     virusTypes: IVirusTypeStat[]
} : {
     scan_types: IScanTypeStat[],
     threat_status: IThreatStatusStat[],
     virus_types: IVirusTypeStat[],
}) & {
     activity: IActivityStat[]
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