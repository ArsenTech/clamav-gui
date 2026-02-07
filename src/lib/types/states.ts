import { IHistoryData, IQuarantineData, ISchedulerData, IThreatsData, ScanType } from ".";

export interface IDeviceInfo {
     sys_name: string;
     sys_os: string;
     sys_host: string;
}
export interface IVersion{
     app: string,
     tauri: string,
     versionType: string,
     clamAV: string
}
export interface IScanPageState{
     scanType: ScanType,
     logs: string[],
     currLocation: string,
     isFinished: boolean,
     duration: number,
     scannedFiles: number,
     totalFiles: number,
     paths: string[],
     exitCode: number,
     errMsg?: string,
     threats: IThreatsData[]
}
export interface IUpdatePageState{
     isRequired: boolean,
     isUpdatingDefs: boolean,
     lastUpdated: Date | null,
     exitMsg: number | null,
}
export interface IFinishScanState{
     currThreat: IThreatsData | null,
     isOpenDelete: boolean,
     bulkDelete: boolean
}
export interface IHistoryPageState{
     clearAll: boolean,
     clearAcknowledged: boolean,
     clearErrors: boolean
     data: IHistoryData<"state">[]
}
export interface IQuarantineState{
     bulkRestore: boolean,
     bulkDelete: boolean,
     isOpenRestore: boolean,
     isOpenDelete: boolean,
     id: string,
     data: IQuarantineData<"state">[]
}
export interface ISchedulerState{
     isOpenDelete: boolean,
     isOpenClear: boolean,
     job_id: string,
     data: ISchedulerData<"state">[]
}