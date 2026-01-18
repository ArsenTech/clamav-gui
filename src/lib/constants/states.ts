import { ScanType } from "../types";
import { IDeviceInfo, IScanPageState, IVersion } from "../types/states";

export const INITIAL_DEIVCE_INFO: IDeviceInfo = {
     sys_os: "",
     sys_host: "",
     sys_name: "",
}
export const INITIAL_VERSION_INFO: IVersion = {
     app: "0.0.0",
     tauri: "0.0.0",
     versionType: "Early Build"
}
export const GET_INITIAL_SCAN_STATE = (type: ScanType | null): IScanPageState => ({
     scanType: type ?? "",
     logs: [],
     threats: 0,
     currLocation: "",
     isFinished: false,
     duration: 0,
     scannedFiles: 0,
     totalFiles: 0
})