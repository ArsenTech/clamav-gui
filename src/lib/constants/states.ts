import { ScanType } from "../types";
import { IDeviceInfo, IScanPageState, IUpdatePageState, IVersion } from "../types/states";

export const INITIAL_DEIVCE_INFO: IDeviceInfo = {
     sys_os: "",
     sys_host: "",
     sys_name: "",
}
export const INITIAL_VERSION_INFO: IVersion = {
     app: "0.0.0",
     tauri: "0.0.0",
     versionType: "Early Build",
     clamAV: ""
}
export const GET_INITIAL_SCAN_STATE = (type: ScanType, path: string[] | null): IScanPageState => ({
     scanType: type,
     logs: [],
     currLocation: "",
     isFinished: false,
     duration: 0,
     scannedFiles: 0,
     totalFiles: 0,
     paths: path ?? [],
     exitCode: 0
})
export const INITIAL_UPDATE_STATE: IUpdatePageState = {
     isUpdating: false,
     isFetching: true,
     isRequired: false,
     lastUpdated: null,
     log: []
}