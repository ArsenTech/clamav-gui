import { ScanType } from ".";

export interface IDeviceInfo {
     sys_name: string;
     sys_os: string;
     sys_host: string;
}
export interface IVersion{
     app: string,
     tauri: string,
     versionType: string
}
export interface IScanPageState{
     scanType: ScanType,
     logs: string[],
     currLocation: string,
     isFinished: boolean,
     duration: number,
     scannedFiles: number,
     totalFiles: number,
     paths: string[]
}
export interface IUpdatePageState{
     isUpdating: boolean,
     isFetching: boolean
     isRequired: boolean,
     lastUpdated: Date | null,
     log: string[]
}