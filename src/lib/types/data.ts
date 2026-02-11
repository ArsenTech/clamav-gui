import { HistoryType, ScanType } from "./enums"
import { DAYS_OF_THE_WEEK, INTERVALS } from "../constants"
import { LogCategory } from "./enums";
import { HistoryDetails } from ".";

export type ThreatStatus = "quarantined" | "deleted" | "detected";
export type HistoryStatus = "success" | "warning" | "error" | "acknowledged";
export type DataType = "state" | "type"
export type IntervalType = typeof INTERVALS[number]

interface HistoryDataBase{
     id: string,
     timestamp: string,
     action: HistoryType,
     status: HistoryStatus,
     category: LogCategory | null
}
export type IHistoryData<T extends DataType> =
     T extends "type" ? HistoryDataBase & {
          log_id?: string
          details: HistoryDetails
     }
     : HistoryDataBase & {
          logId?: string;
          details: string
     }
export interface IThreatsData{
     id: string,
     displayName: string,
     filePath: string,
     status: ThreatStatus,
     detectedAt: Date
}
export interface IQuarantineData{
     id: string,
     threat_name: string,
     file_path: string,
     quarantined_at: Date,
     size: number
}
export type ISchedulerData<T extends DataType> = (T extends "type" ? {
     scan_type: ScanType,
     days: typeof DAYS_OF_THE_WEEK[number],
     time: string
     last_run: string | null
} : {
     scanType: ScanType,
     lastScan: Date | null,
     nextScan: Date | null
}) & {
     id: string,
     interval: IntervalType,
     log_id?: string
}