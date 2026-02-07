import { ScanType } from "../types";
import { IDeviceInfo, IFinishScanState, IHistoryPageState, IQuarantineState, IScanPageState, ISchedulerState, IUpdatePageState, IVersion } from "../types/states";

export const INITIAL_DEIVCE_INFO: IDeviceInfo = {
     sys_os: "",
     sys_host: "",
     sys_name: "",
}
export const INITIAL_VERSION_INFO: IVersion = {
     app: "0.0.0",
     tauri: "0.0.0",
     versionType: "Beta",
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
     exitCode: 0,
     errMsg: undefined,
     threats: []
})
export const INITIAL_UPDATE_STATE: IUpdatePageState = {
     exitMsg: null,
     isRequired: false,
     lastUpdated: null,
     isUpdatingDefs: false,
}
export const INITIAL_FINISH_SCAN_STATE: IFinishScanState = {
     currThreat: null,
     isOpenDelete: false,
     bulkDelete: false
}
export const INITIAL_HISTORY_STATE: IHistoryPageState = {
     clearAll: false,
     clearAcknowledged: false,
     clearErrors: false,
     data: []
}
export const INITIAL_QUARANTINE_STATE: IQuarantineState = {
     isOpenRestore: false,
     isOpenDelete: false,
     id: "",
     bulkDelete: false,
     bulkRestore: false,
     data: []
}
export const INITIAL_SCHEDULER_STATE: ISchedulerState = {
     isOpenDelete: false,
     isOpenClear: false,
     job_id: "",
     data: []
}