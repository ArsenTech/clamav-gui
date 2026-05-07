import { ScanType } from "./enums";
import { IHistoryData, IQuarantineData, ISchedulerData, IThreatsData } from "./data"
import { GuiUpdaterStatus } from "./enums";
import { HistoryConfirmationState, QuarantineConfirmationState, ScanFinishConfState, ScanUIStatus, SchedulerConfState } from ".";

export interface IDeviceInfo {
     sys_name: string;
     sys_os: string;
     sys_host: string;
}
export interface IVersion{
     app: string,
     tauri: string,
}
export interface IScanPageState{
     status: ScanUIStatus
     logs: string[],
     threats: IThreatsData[],
     scannedFiles: number,
     totalFiles: number,
     errMsg?: string,
     exitCode: number,
     scanType: ScanType,
     currLocation: string,
     duration: number,
     paths: string[],
     isReconnected: boolean,
}
export interface IDefsUpdaterState{
     isRequired: boolean,
     isUpdatingDefs: boolean,
     lastUpdated: Date | null,
     exitMsg: number | null,
}
export interface IFinishScanState{
     currThreat: IThreatsData | null,
     popupState: ScanFinishConfState | ""
}
export interface IHistoryPageState{
     popupState: "" | HistoryConfirmationState
     showDetails: boolean,
     details: string | null
     data: IHistoryData<"state">[]
}
export interface IQuarantineState{
     popupState: "" | QuarantineConfirmationState
     id: string,
     data: IQuarantineData[],
     isInitializing: boolean
}
export interface ISchedulerState{
     popupState: SchedulerConfState | ""
     job_id: string,
     data: ISchedulerData<"state">[]
}
export interface IUpdaterState{
     status: GuiUpdaterStatus,
     newVersion: string | null,
     patchDate: Date | null,
     downloaded: number,
     total: number
}