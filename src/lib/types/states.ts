import { ScanType } from "./enums";
import { IHistoryData, IQuarantineData, ISchedulerData, IThreatsData } from "./data"
import { GuiUpdaterStatus } from "./enums";

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
export interface IDefsUpdaterState{
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
     data: IQuarantineData[]
}
export interface ISchedulerState{
     isOpenDelete: boolean,
     isOpenClear: boolean,
     job_id: string,
     data: ISchedulerData<"state">[]
}
export interface IUpdaterState{
     status: GuiUpdaterStatus,
     notes: string | null,
     newVersion: string | null,
     patchDate: Date | null,
     isOpenNotes: boolean,
     downloaded: number,
     total: number
}
export interface IDangerZoneState{
     isOpenDelete: boolean,
     isOpenRestore: boolean
}